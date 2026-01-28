import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();

    console.log("sessionn",session)

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [publisherData, active_websites] = await Promise.all([
        prisma.publisher.findMany({
            where: { email: session.user.email },
            select: { id: true }
        }),
        prisma.publisher.count({
            where: { email: session.user.email }
        })
    ]);

    const publisher_ids = publisherData.map(p => p.id);

    if (publisher_ids.length === 0) {
        return NextResponse.json({
            active_websites: 0,
            totalImpressions: 0,
            totalEarnings: 0
        });
    }

    const [totalImpressions, clicks] = await Promise.all([
        prisma.impression.aggregate({
            where: { publisher_id: { in: publisher_ids } },
            _sum: { impression: true }
        }),
        prisma.click.findMany({
            where: { publisher_id: { in: publisher_ids } },
            select: { ad_id: true }
        })
    ]);

    const unique_ad_ids = [...new Set(clicks.map(c => c.ad_id))];

    const ads = await prisma.ad.findMany({
        where: { id: { in: unique_ad_ids } },
        select: { id: true, cost_per_click: true }
    });

    const adCostMap = new Map(ads.map(ad => [ad.id, ad.cost_per_click]));

    const totalEarnings = clicks.reduce((total, click) => {
        const adCost = adCostMap.get(click.ad_id) || 0;
        return Number(total) + Number(adCost);
    }, 0);

    console.log("Total Earnings:", totalEarnings);
    console.log("Total Impressions:", totalImpressions._sum.impression);
    console.log("activewebsites:", active_websites);


    return NextResponse.json({
        active_websites,
        totalImpressions: totalImpressions._sum.impression || 0,
        totalEarnings: Number(totalEarnings.toFixed(4)) 
    });
}