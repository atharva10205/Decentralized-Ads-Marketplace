import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const Advertisers = await prisma.ad.findMany({
            where: { user_email: session.user.email },
            select: {
                id: true,
                destination_url: true,
                business_name: true,
                status: true,
                cost_per_click: true,
                impression: true,
                Cost: true
            }
        });

        if (Advertisers.length === 0) {
            return NextResponse.json([]);
        }

        const AdvertisersIds = Advertisers.map(p => p.id);

        const impressionData = await prisma.impression.findMany({
            where: {
                ad_id: { in: AdvertisersIds }
            }
        });

        const ClickData = await prisma.click.findMany({
            where: {
                ad_id: { in: AdvertisersIds }
            }
        });

        // Sum impressions per ad_id
        const impressionMap: Record<string, number> = {};
        for (const imp of impressionData) {
            impressionMap[imp.ad_id] = (impressionMap[imp.ad_id] ?? 0) + imp.impression;
        }

        // Count clicks per ad_id
        const clickMap: Record<string, number> = {};
        for (const click of ClickData) {
            clickMap[click.ad_id] = (clickMap[click.ad_id] ?? 0) + 1;
        }

        // Merge into advertisers
        const enrichedAdvertisers = Advertisers.map(ad => ({
            ...ad,
            impression: impressionMap[ad.id] ?? 0,
            clicks: clickMap[ad.id] ?? 0,
        }));

        return NextResponse.json(enrichedAdvertisers);

    } catch (error) {
        console.error("Error in GET /api/crud/Advertiser/Campaings:", error);
        return NextResponse.json(
            {
                error: "Internal server error",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}