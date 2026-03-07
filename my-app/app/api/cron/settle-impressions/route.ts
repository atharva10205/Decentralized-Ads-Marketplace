import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "../../auth/[...nextauth]/route";

async function settleImpressions() {
    const clicks = await prisma.click.findMany({
        where: { processed: false }
    });

    if (clicks.length === 0) return;

    const publisherIds = [...new Set(clicks.map(c => c.publisher_id))];

    const publishers = await prisma.publisher.findMany({
        where: { id: { in: publisherIds } },
        select: { id: true, wallet_address: true }
    });
    const walletMap = new Map(publishers.map(p => [p.id, p.wallet_address]));

    const adIds = [...new Set(clicks.map(c => c.ad_id))];
    const ads = await prisma.ad.findMany({
        where: { id: { in: adIds } },
        select: { id: true, cost_per_click: true, wallet_address: true }
    });
    const cpcMap = new Map(ads.map(a => [a.id, Number(a.cost_per_click)]));

    const groups = new Map<string, { ad_id: string, publisher_wallet: string, amount: number, clickIds: string[] }>();



    for (const click of clicks) {
        const wallet = walletMap.get(click.publisher_id);
        if (!wallet) continue;

        const key = `${click.ad_id}_${wallet}`;
        const cpc = cpcMap.get(click.ad_id) ?? 0;
        const lamports = Math.round(cpc * 1_000_000);

        if (!groups.has(key)) {
            groups.set(key, { ad_id: click.ad_id, publisher_wallet: wallet, amount: 0, clickIds: [] });
        }
        const group = groups.get(key)!;
        group.amount += lamports;
        group.clickIds.push(click.id);
    }

    for (const group of groups.values()) {
        try {
            const tx = await callRecordImpression(group);

            await prisma.earningsRecord.upsert({
                where: { publisher_wallet_ad_id: { publisher_wallet: group.publisher_wallet, ad_id: group.ad_id } },
                update: { claimable_amount: { increment: group.amount }, settled: true, tx_signature: tx },
                create: { publisher_wallet: group.publisher_wallet, ad_id: group.ad_id, claimable_amount: group.amount, settled: true, tx_signature: tx }
            });

            await prisma.click.updateMany({
                where: { id: { in: group.clickIds } },
                data: { processed: true }
            });

        } catch (e) {
            console.error('Failed for group', group, e);
        }
    }
}

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await settleImpressions();

    return NextResponse.json({ ok: true });
}