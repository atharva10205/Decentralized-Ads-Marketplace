import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email;

    const publishers = await prisma.publisher.findMany({
        where: { email },
        select: { id: true, website_name: true, website_url: true }
    });

    if (publishers.length === 0) {
        return NextResponse.json({
            summary: { totalImpressions: 0, totalClicks: 0, ctr: 0, totalEarnings: 0 },
            chartData: [],
            topSites: [],
            accent: '#FFFFFF'
        });
    }

    const publisher_ids = publishers.map(p => p.id);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [impressionRecords, clickRecords, user] = await Promise.all([
        prisma.impression.findMany({
            where: {
                publisher_id: { in: publisher_ids },
                created_at: { gte: sevenDaysAgo }
            },
            select: { impression: true, created_at: true, publisher_id: true }
        }),
        prisma.click.findMany({
            where: {
                publisher_id: { in: publisher_ids },
                created_at: { gte: sevenDaysAgo }
            },
            select: { ad_id: true, created_at: true, publisher_id: true }
        }),
        prisma.user.findUnique({
            where: { email },
            select: { accent: true }
        })
    ]);

    const totalImpressions = impressionRecords.reduce((a, r) => a + r.impression, 0);
    const totalClicks = clickRecords.length;
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    const unique_ad_ids = [...new Set(clickRecords.map(c => c.ad_id))];
    const ads = await prisma.ad.findMany({
        where: { id: { in: unique_ad_ids } },
        select: { id: true, cost_per_click: true }
    });
    const adCostMap = new Map(ads.map(a => [a.id, a.cost_per_click]));
    const totalEarnings = clickRecords.reduce((total, click) => {
        return total + Number(adCostMap.get(click.ad_id) ?? 0);
    }, 0);

    const impressionsByDayMap = new Map<string, number>();
    for (const r of impressionRecords) {
        const day = r.created_at.toISOString().slice(0, 10);
        impressionsByDayMap.set(day, (impressionsByDayMap.get(day) ?? 0) + r.impression);
    }

    const clicksByDayMap = new Map<string, number>();
    for (const c of clickRecords) {
        const day = c.created_at.toISOString().slice(0, 10);
        clicksByDayMap.set(day, (clicksByDayMap.get(day) ?? 0) + 1);
    }

    const chartData = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const day = d.toISOString().slice(0, 10);
        return {
            date: day,
            impressions: impressionsByDayMap.get(day) ?? 0,
            clicks: clicksByDayMap.get(day) ?? 0,
        };
    });

    const siteImpressionsMap = new Map<string, number>();
    for (const r of impressionRecords) {
        siteImpressionsMap.set(r.publisher_id, (siteImpressionsMap.get(r.publisher_id) ?? 0) + r.impression);
    }

    const siteClicksMap = new Map<string, number>();
    for (const c of clickRecords) {
        siteClicksMap.set(c.publisher_id, (siteClicksMap.get(c.publisher_id) ?? 0) + 1);
    }

    const topSites = publishers.map(p => {
        const impr = siteImpressionsMap.get(p.id) ?? 0;
        const clicks = siteClicksMap.get(p.id) ?? 0;
        const siteCtr = impr > 0 ? (clicks / impr) * 100 : 0;
        return {
            name: p.website_name ?? p.website_url ?? p.id,
            impressions: impr,
            clicks,
            ctr: Number(siteCtr.toFixed(2)),
        };
    }).sort((a, b) => b.clicks - a.clicks);

    return NextResponse.json({
        summary: {
            totalImpressions,
            totalClicks,
            ctr: Number(ctr.toFixed(2)),
            totalEarnings: Number(totalEarnings.toFixed(4)),
        },
        chartData,
        topSites,
        accent: user?.accent ?? '#FFFFFF'
    });
}