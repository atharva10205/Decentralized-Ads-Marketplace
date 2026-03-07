import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ActiveCampign = await prisma.ad.count({
        where: {
            user_email: session.user.email
        }
    })

    const Campign = await prisma.ad.groupBy({
        by: ['id'],
        where: {
            user_email: session.user.email
        }
    })
    const campaignIds = Campign.map(c => c.id);


    const TotalClicks = await prisma.click.count({
        where: {
            ad_id: { in: campaignIds }
        }
    })

    const ad_clicks = await prisma.click.groupBy({
        by: ['ad_id'],
        where: {
            ad_id: { in: campaignIds }

        },
        _count: {
            _all: true
        }
    })

    const click_ad_ids = await ad_clicks.map(c => c.ad_id)

    const cpc  = await prisma.ad.findMany({
        where: {
            user_email: session.user.email,
            id :  {in :click_ad_ids }
        },
        select:{
            id:true,
            cost_per_click:true
        }
    })

     const TotalSpend = ad_clicks.reduce((total, adClick) => {
        // Find the matching ad's CPC
        const ad = cpc.find(a => a.id === adClick.ad_id);
        
        if (ad && ad.cost_per_click) {
            // Multiply clicks by cost per click and add to total
            const adSpend = adClick._count._all * Number(ad.cost_per_click);
            return total + adSpend;
        }
        
        return total;
    }, 0);

    console.log("TotalSpend", TotalSpend)

     return NextResponse.json({
        activeCampaigns: ActiveCampign,
        totalClicks: TotalClicks,
        totalSpend: TotalSpend
    });



}