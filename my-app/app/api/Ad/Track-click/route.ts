import { prisma } from "@/app/lib/prisma";
import { redis } from "@/app/lib/redis";
import crypto from 'crypto';

const SECRET = process.env.TRACKING_SECRET!;

const LIMITS = {
    click: { max: 5, windowSec: 60 },
    impression: { max: 10, windowSec: 60 },
};

async function checkRateLimit(ip: string, adId: string, type: 'click' | 'impression') {
    const { max, windowSec } = LIMITS[type];
    
    const key = `rl:${type}:${ip}:${adId}`;
    const now = Date.now();
    const windowStart = now - windowSec * 1000;


    const pipe = redis.pipeline();
    pipe.zremrangebyscore(key, 0, windowStart);
    pipe.zadd(key, { score: now, member: String(now) });
    pipe.zcard(key);
    pipe.expire(key, windowSec);

    const results = await pipe.exec();
    const count = results[2] as number;

    return { allowed: count <= max, remaining: Math.max(0, max - count) };
}


function corsHeaders() {
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };
}

export async function OPTIONS() {
    return new Response(null, { headers: corsHeaders() });
}

const processedClicks = new Set<string>();
setInterval(() => {
    processedClicks.clear();
}, 60000);

interface CachedPublisher {
    id: string;
    expiresAt: number;
}

interface CachedCPC {
    cpc: number;
    expiresAt: number;
}

const publisherCache = new Map<string, CachedPublisher>();
const cpcCache = new Map<string, CachedCPC>();
const CACHE_TTL = 5 * 60 * 1000;


function scoreHuman(signals: any): boolean {
    if (!signals) return false;

    if (signals.timeOnPage < 500) return false;
    if (!signals.mouseMoved && !signals.scrolled) return false;

    let score = 0;
    if (signals.mouseMoved) score += 2;
    if (signals.scrolled) score += 1;
    if (signals.timeOnPage > 2000) score += 2;
    if (signals.mouseEvents > 3) score += 1;

    if (score >= 3) {
        return true;
    } else {
        return false;
    }
}

function verifyTrackingToken(token: string): { adId: string; publisherUrl: string } | null {
    try {
        const decoded = Buffer.from(token, 'base64url').toString();
        const { data, sig } = JSON.parse(decoded);
        const expected = crypto.createHmac('sha256', SECRET).update(data).digest('hex');
        if (sig !== expected) return null;
        const payload = JSON.parse(data);
        if (payload.exp < Date.now()) return null;
        return payload;
    } catch { return null; }
}

//rather than fetching from db i have added cahcing optimitaiton
export async function getPublisher(url: string) {

    const cached = publisherCache.get(url);

    if (cached && cached.expiresAt > Date.now()) {
        return { id: cached.id };
    }


    const publisher = await prisma.publisher.findUnique({
        where: { website_url: url },
        select: { id: true }
    });

    if (publisher) {
        publisherCache.set(url, {
            id: publisher.id,
            expiresAt: Date.now() + CACHE_TTL
        });
    }

    return publisher;
}

//rather than fetching from db i have added cahcing optimitaiton
export async function getAdCPC(adId: string): Promise<number | null> {

    const cached = cpcCache.get(adId);

    if (cached && cached.expiresAt > Date.now()) {
        return cached.cpc;
    }


    const ad = await prisma.ad.findUnique({
        where: { id: adId },
        select: { cost_per_click: true }
    });

    if (!ad?.cost_per_click) return null;

    const cpc = Math.round(Number(ad.cost_per_click) * 1_000_000_000);

    cpcCache.set(adId, {
        cpc,
        expiresAt: Date.now() + CACHE_TTL
    });

    return cpc;
}


//automatically deletes cache after 60sec
setInterval(() => {

    const now = Date.now();

    for (const [key, value] of publisherCache.entries()) {
        if (value.expiresAt < now) {
            publisherCache.delete(key);
        }
    }

    for (const [key, value] of cpcCache.entries()) {
        if (value.expiresAt < now) {
            cpcCache.delete(key);
        }
    }

    processedClicks.clear();

}, 60000)

async function processBatch(events: any[]) {

    const clicksToCreateInDB: any[] = [];
    let duplicates = 0;

    const adUpdateMap = new Map<String, number>();

    for (const e of events) {


        const { adId, publisher_url, clickId, signals } = e;

        if (!scoreHuman(e.signals)) {
            continue;
        }

        if (clickId && processedClicks.has(clickId)) {
            duplicates++;
            continue;
        }

        const publisher = await getPublisher(publisher_url);
        if (!publisher) {
            console.error(`Publisher not found: ${publisher_url}`);
            continue;
        }

        clicksToCreateInDB.push({
            ad_id: adId,
            publisher_id: publisher.id,
            publisher_url: publisher_url
        })

        const cpc = await getAdCPC(adId);
        if (!cpc) {
            console.error(`No CPC for ad: ${adId}`);
            continue;
        }

        if (!adUpdateMap.has(adId)) {
            adUpdateMap.set(adId, 0);
        }
        adUpdateMap.set(adId, adUpdateMap.get(adId)! + cpc);

        if (clickId) {
            processedClicks.add(clickId);
        }
    }

    if (clicksToCreateInDB.length === 0) {
        return { processed: 0, duplicates };
    }

    await prisma.$transaction(async (tx) => {
        await tx.click.createMany({
            data: clicksToCreateInDB,
        })

        for (const [adId, totalCost] of adUpdateMap.entries()) {
            await tx.ad.update({
                where: { id: adId },
                data: { RemainingAmount: { decrement: totalCost } }
            });
        }

    })

    return { processed: clicksToCreateInDB.length, duplicates };

}
export async function POST(request: Request) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
        ?? request.headers.get('x-real-ip')
        ?? '0.0.0.0';

    try {
        const contentType = request.headers.get('content-type') || '';
        const body = contentType.includes('application/json')
            ? await request.json()
            : JSON.parse(await request.text());

        const { events } = body;

        // 1 Guard
        if (!events || events.length === 0) {
            return new Response(JSON.stringify({ success: true }), {
                status: 200, headers: corsHeaders()
            });
        }

        // 2 Rate limit
        const adId = events[0]?.adId;
        const { allowed, remaining } = await checkRateLimit(ip, adId, 'click');
        if (!allowed) {
            console.error('[RateLimit] Exceeded for ip:', ip);
            return new Response(
                JSON.stringify({ success: false, error: 'Rate limit exceeded' }),
                { status: 429, headers: { ...corsHeaders(), 'Retry-After': '60' } }
            );
        }

        // 3 Verify tokens
        for (const e of events) {
            const verified = verifyTrackingToken(e.trackingToken);
            if (!verified || verified.adId !== e.adId) {
                console.error('[Token] Invalid token for adId:', e.adId);
                return new Response('Unauthorized', { status: 401 });
            }
        }

        // 4 Human check
        const validEvents = events.filter((e: any) => {
            const human = scoreHuman(e.signals);
            if (!human) console.error('[Bot] Filtered — adId:', e.adId, 'signals:', e.signals);
            return human;
        });


        if (validEvents.length === 0) {
            return new Response(JSON.stringify({ success: true, queued: 0 }), {
                status: 200, headers: corsHeaders()
            });
        }

        const pipeline = redis.pipeline();
        for (const e of validEvents) {
            pipeline.rpush('click_queue', JSON.stringify({
                adId: e.adId,
                publisher_url: e.publisher_url,
                clickId: e.clickId,
                timestamp: e.timestamp
            }));
        }
        await pipeline.exec();

        return new Response(
            JSON.stringify({
                success: true,
                queued: validEvents.length,
                'X-RateLimit-Remaining': String(remaining),
            }),
            { status: 200, headers: { ...corsHeaders(), 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('[Error]', error);
        return new Response(
            JSON.stringify({ success: false, error: String(error) }),
            { status: 500, headers: corsHeaders() }
        );
    }
}