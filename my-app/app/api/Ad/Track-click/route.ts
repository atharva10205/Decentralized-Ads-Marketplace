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

export async function POST(request: Request) {
    try {
        const { adId, publisher_url } = await request.json();

        const publisher = await prisma.publisher.findUnique({
            where: {
                website_url: publisher_url
            }
        })

        if (!publisher) {
            console.error(`Publisher not found for URL: ${publisher_url}`);
            return;
        }

        const update_clicks = await prisma.click.create({
            data:
            {
                ad_id: adId,
                publisher_id: publisher.id,
                publisher_url:publisher_url
            }
        })

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