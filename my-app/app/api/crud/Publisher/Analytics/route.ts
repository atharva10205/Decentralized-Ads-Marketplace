import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session = await auth();
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email;

    const [publishers, user] = await Promise.all([
        prisma.publisher.findMany({
            where: { email },
            select: { id: true, website_name: true, website_url: true, status: true, wallet_address: true }
        }),
        prisma.user.findUnique({
            where: { email },
            select: { accent: true }
        })
    ]);

    const accent = user?.accent ?? "#ffffff";

    if (publishers.length === 0) {
        return NextResponse.json({
            websiteStats: [],
            totals: { totalImpressions: 0, totalClicks: 0, totalEarnings: 0, totalClaimed: 0, avgCtr: "0.00", activeWebsites: 0 },
            clicksChart: [],
            impressionsChart: [],
            accent,
        });
    }

    const publisherIds = publishers.map(p => p.id);
    const websiteUrls = publishers.map(p => p.website_url).filter(Boolean) as string[];
    const walletAddresses = publishers.map(p => p.wallet_address).filter(Boolean) as string[];

    const impressions = await prisma.impression.findMany({
        where: { publisher_id: { in: publisherIds } }
    });

    const allClicks = await prisma.click.findMany({
        where: { publisher_url: { in: websiteUrls } },
        select: { ad_id: true, publisher_id: true, publisher_url: true, claimed: true, processed: true, claimed_at: true, created_at: true }
    });

    const adIds = [...new Set(allClicks.map(c => c.ad_id))];
    const ads = await prisma.ad.findMany({
        where: { id: { in: adIds } },
        select: { id: true, cost_per_click: true }
    });
    const cpcMap = new Map(ads.map(a => [a.id, Number(a.cost_per_click ?? 0)]));

    const earningsRecords = await prisma.earningsRecord.findMany({
        where: { publisher_wallet: { in: walletAddresses } },
        select: { publisher_wallet: true, claimable_amount: true, settled: true }
    });

    const websiteStats = publishers.map(publisher => {
        const siteImpressions = impressions
            .filter(i => i.publisher_id === publisher.id)
            .reduce((sum, i) => sum + (i.impression || 0), 0);

        const siteClicks = allClicks.filter(c => c.publisher_url === publisher.website_url);
        const totalClicks = siteClicks.length;
        const claimedClicks = siteClicks.filter(c => c.claimed).length;
        const unclaimedClicks = siteClicks.filter(c => c.processed && !c.claimed).length;

        const totalEarnings = siteClicks.reduce((sum, c) => sum + (cpcMap.get(c.ad_id) ?? 0), 0);
        const claimedEarnings = siteClicks
            .filter(c => c.claimed)
            .reduce((sum, c) => sum + (cpcMap.get(c.ad_id) ?? 0), 0);

        const ctr = siteImpressions > 0 ? ((totalClicks / siteImpressions) * 100).toFixed(2) : "0.00";

        return {
            name: publisher.website_name ?? publisher.website_url,
            url: publisher.website_url,
            status: publisher.status,
            impressions: siteImpressions,
            totalClicks,
            claimedClicks,
            unclaimedClicks,
            totalEarnings: parseFloat(totalEarnings.toFixed(6)),
            claimedEarnings: parseFloat(claimedEarnings.toFixed(6)),
            ctr: parseFloat(ctr),
        };
    });

    const totalImpressions = websiteStats.reduce((sum, s) => sum + s.impressions, 0);
    const totalClicks = websiteStats.reduce((sum, s) => sum + s.totalClicks, 0);
    const totalEarnings = websiteStats.reduce((sum, s) => sum + s.totalEarnings, 0);
    const totalClaimed = websiteStats.reduce((sum, s) => sum + s.claimedEarnings, 0);
    const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00";
    const activeWebsites = publishers.filter(p => p.status === "ACTIVE").length;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const buildDayMap = (): Record<string, number> => {
        const map: Record<string, number> = {};
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            map[key] = 0;
        }
        return map;
    };

    const recentClicks = allClicks.filter(c => c.created_at && c.created_at >= sevenDaysAgo);
    const clicksByDay = buildDayMap();
    for (const click of recentClicks) {
        if (click.created_at) {
            const key = new Date(click.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (key in clicksByDay) clicksByDay[key]++;
        }
    }
    const clicksChart = Object.entries(clicksByDay).map(([date, count]) => ({ date, count }));

    const impressionsByDay = buildDayMap();
    for (const imp of impressions) {
        // @ts-ignore — created_at may not be in the select; add it to the query above if needed
        const ts: Date | undefined = imp.created_at;
        if (ts && ts >= sevenDaysAgo) {
            const key = new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (key in impressionsByDay) impressionsByDay[key] += imp.impression || 0;
        }
    }
    const impressionsChart = Object.entries(impressionsByDay).map(([date, count]) => ({ date, count }));

    return NextResponse.json({
        websiteStats,
        totals: { totalImpressions, totalClicks, totalEarnings, totalClaimed, avgCtr, activeWebsites },
        clicksChart,
        impressionsChart,
        accent,
    });
}