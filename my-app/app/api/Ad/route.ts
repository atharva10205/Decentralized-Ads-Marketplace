import { selectAdsForPublisher } from "../AD_MATCHING_SYSTEM/route"

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

export async function GET(request: Request) {
    const { searchparams } = new URL(request.url);
    const id = searchparams.get("id");

    const ads = await selectAdsForPublisher(id, true); return new Response(
        JSON.stringify({ success: true, ads }),
        {
            status: 200,
            headers: { ...corsHeaders(), "Content-Type": "application/json" }
        }
    );
}