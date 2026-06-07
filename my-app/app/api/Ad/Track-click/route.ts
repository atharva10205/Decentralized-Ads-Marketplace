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

    const existing = await redis.zcard(key);
    const now = Date.now();
    const windowStart = now - windowSec * 1000;

    const pipe = redis.pipeline();
    pipe.zremrangebyscore(key, 0, windowStart);
    pipe.zadd(key, { score: now, member: String(now) });
    pipe.zcard(key);
    pipe.expire(key, windowSec);

    const results = await pipe.exec();
const count = (Array.isArray(results[2]) ? results[2][1] : results[2]) as number ?? 0;

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

function scoreHuman(signals: any): boolean {
    if (!signals) return false;
    if (signals.timeOnPage < 500) return false;
    if (!signals.mouseMoved && !signals.scrolled) return false;

    let score = 0;
    if (signals.mouseMoved) score += 2;
    if (signals.scrolled) score += 1;
    if (signals.timeOnPage > 2000) score += 2;
    if (signals.mouseEvents > 3) score += 1;

    return score >= 3;
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

        // 5 Enqueue
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