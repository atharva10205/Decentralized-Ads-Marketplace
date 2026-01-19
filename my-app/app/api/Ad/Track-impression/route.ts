import { prisma } from "@/app/lib/prisma";

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

const impression_queue: Map<string, number> = new Map();
let isFlushScheduled = false;

async function flushImpressions() {
    if (impression_queue.size === 0) {
        isFlushScheduled = false;
        return;
    }

    const to_flush = new Map(impression_queue);
    impression_queue.clear();
    isFlushScheduled = false;

    try {
        await Promise.all(
            Array.from(to_flush.entries()).map(async ([key, count]) => {
                const [adId, publisher_url] = key.split('|');

                const publisher = await prisma.publisher.findUnique({
                    where: {
                        website_url: publisher_url
                    }
                });

                if (!publisher) {
                    console.error(`Publisher not found for URL: ${publisher_url}`);
                    return;
                }

                await prisma.impression.upsert({
                    where: {
                        ad_id_publisher_id_publisher_url: {
                            ad_id: adId,
                            publisher_id: publisher.id ,
                            publisher_url:publisher_url
                        }
                    },
                    update: {
                        impression: { increment: count },
                    },
                    create: {
                        ad_id: adId,
                        publisher_id: publisher.id, 
                        publisher_url:publisher_url,
                        impression: count,
                    },
                });
            })
        );
    } catch (error) {
        console.error('Error flushing', error);
    }
}

function FlushSchedule(delay = 1000) {
    if (!isFlushScheduled) {
        isFlushScheduled = true;
        setTimeout(() => flushImpressions(), delay);
    }
}

export async function POST(request: Request) {
    try {
        const { adId, publisher_url } = await request.json();

        const key = `${adId}|${publisher_url}`;
        impression_queue.set(key, (impression_queue.get(key) || 0) + 1);
        FlushSchedule();

      
        return new Response(
            JSON.stringify({ success: true }),
            {
                status: 200,
                headers: { ...corsHeaders(), "Content-Type": "application/json" }
            }
        );
    } catch (error) {
        console.log(error);
        return new Response(
            JSON.stringify({ success: false, error: String(error) }),
            {
                status: 500,
                headers: { ...corsHeaders(), "Content-Type": "application/json" }
            }
        );
    }
}