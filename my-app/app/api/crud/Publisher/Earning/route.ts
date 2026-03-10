import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";
import { IDL } from "@/lib/idl";
import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { NextResponse } from "next/server";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { adIdToBytes } from "@/lib/solana";


export async function GET(req: Request) {
    const session = await auth();

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const publisher = await prisma.publisher.findFirst({
        where: { email: session.user.email },
        select: { wallet_address: true }
    });

    const user = await prisma.publisher.findMany({
        where: { email: session.user.email },
        select: { id: true, website_url: true }
    });

    const websiteUrlMap = user
        .map(w => w.website_url)
        .filter((url): url is string => url !== null);

    if (websiteUrlMap.length === 0) {
        return NextResponse.json({ error: "No websites found" }, { status: 404 });
    }
    const data = await prisma.click.findMany({
        where: {
            publisher_url: { in: websiteUrlMap },
            processed: false,
            claimed: false
        },
        select: { ad_id: true, publisher_id: true }
    });

    const adIdMap = data.map(w => w.ad_id);

    const cpcList = await prisma.ad.findMany({
        where: { id: { in: adIdMap } },
        select: { id: true, cost_per_click: true }
    });


    const cpcMap1 = new Map(cpcList.map(c => [c.id, Number(c.cost_per_click)]));
    const publisherWallets = await prisma.publisher.findMany({
        where: { id: { in: user.map(u => u.id) } },
        select: { id: true, wallet_address: true }
    });
    const walletMap = new Map(publisherWallets.map(p => [p.id, p.wallet_address]));

    const earningsRecords = data.map(click => {
        const cpc = cpcMap1.get(click.ad_id) ?? 0;
        const claimable_amount = Math.round(cpc * 1_000_000);

        return {
            publisher: walletMap.get(click.publisher_id) ?? null,
            ad: click.ad_id,
            claimable_amount,
        };
    });

    const history = await prisma.click.findMany({
        where: {
            publisher_url: { in: websiteUrlMap },
            claimed: true
        },
        select: { ad_id: true, publisher_id: true, claimed_at: true },
        orderBy: { claimed_at: 'desc' }
    });

    const adIdList = history.map(i => i.ad_id);

    const cpc = await prisma.ad.findMany({
        where: { id: { in: adIdList } },
        select: { id: true, cost_per_click: true }
    });

    const cpcMap = Object.fromEntries(cpc.map(a => [a.id, Number(a.cost_per_click)]));


    const sorted = [...history].sort((a, b) => {
        if (!a.claimed_at && !b.claimed_at) return 0;
        if (!a.claimed_at) return 1;
        if (!b.claimed_at) return -1;
        return a.claimed_at.getTime() - b.claimed_at.getTime();
    });

    const groupMap = new Map<string, {
        ad_id: string;
        publisher_id: string;
        click_count: number;
        earnings: number;
        timestamp: Date | null;
        lastTimestamp: number | null;
    }>();
    for (const click of sorted) {
        const clickTime = click.claimed_at?.getTime() ?? null;

        let matchedKey: string | null = null;

        for (const [key, group] of groupMap.entries()) {
            if (group.ad_id !== click.ad_id || group.publisher_id !== click.publisher_id) continue;

            if (clickTime === null && group.timestamp === null) {
                matchedKey = key;
                break;
            }

            if (clickTime !== null && group.lastTimestamp !== null) {
                const diff = Math.abs(clickTime - group.lastTimestamp);
                if (diff <= 120_000) {
                    matchedKey = key;
                    break;
                }
            }
        }

        if (!matchedKey) {
            matchedKey = `${click.ad_id}__${click.publisher_id}__${clickTime ?? 'null'}`;
            groupMap.set(matchedKey, {
                ad_id: click.ad_id,
                publisher_id: click.publisher_id,
                click_count: 0,
                earnings: 0,
                timestamp: click.claimed_at ?? null,
                lastTimestamp: clickTime,  
            });
        }

        const group = groupMap.get(matchedKey)!;
        group.click_count += 1;
        group.earnings += cpcMap[click.ad_id] ?? 0;
        if (clickTime !== null) group.lastTimestamp = clickTime;
    }

    const transactionList = Array.from(groupMap.values())
        .sort((a, b) => {
            if (!a.timestamp && !b.timestamp) return 0;
            if (!a.timestamp) return 1;
            if (!b.timestamp) return -1;
            return b.timestamp.getTime() - a.timestamp.getTime();
        })
        .map(({ lastTimestamp, ...rest }) => rest);

    console.log("transactions", transactionList)

    return NextResponse.json({ publisher, earningsRecords, transactionList });
}
export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const connection = new Connection(process.env.RPC_URL!);
    const keypair = Keypair.fromSecretKey(bs58.decode(process.env.AUTHORITY_PRIVATE_KEY!));
    const wallet = new NodeWallet(keypair);
    const provider = new AnchorProvider(connection, wallet, {});
    const program = new Program(IDL as any, provider);


    const user = await prisma.publisher.findMany({
        where: { email: session.user.email },
        select: { id: true, website_url: true },
    });

    const websiteUrlMap = user
        .map((w) => w.website_url)
        .filter((url): url is string => url !== null);

    if (websiteUrlMap.length === 0) return NextResponse.json({ error: "No websites found" }, { status: 404 });

    const data = await prisma.click.findMany({
        where: { publisher_url: { in: websiteUrlMap }, processed: false },
        select: { ad_id: true, publisher_id: true },
    });

    const adIdMap = data.map((w) => w.ad_id);

    const cpcList = await prisma.ad.findMany({
        where: { id: { in: adIdMap } },
        select: { id: true, cost_per_click: true, wallet_address: true },
    });
    const cpcMap = new Map(cpcList.map((c) => [c.id, Number(c.cost_per_click)]));
    const advertiserWalletMap = new Map(cpcList.map((c) => [c.id, c.wallet_address]));


    const publisherWallets = await prisma.publisher.findMany({
        where: { id: { in: user.map((u) => u.id) } },
        select: { id: true, wallet_address: true },
    });
    const publisherWalletsMap = new Map(publisherWallets.map((p) => [p.id, p.wallet_address]));

    const results = [];

    for (const click of data) {

        const publisher = publisherWalletsMap.get(click.publisher_id) ?? null;
        if (!publisher) {
            continue;
        }

        const cpc = cpcMap.get(click.ad_id) ?? 0;
        const claimable_amount = Math.round(cpc * 1_000_000_000);

        const advertiserWallet = advertiserWalletMap.get(click.ad_id);
        if (!advertiserWallet) {
            results.push({ ad: click.ad_id, success: false, error: "No advertiser wallet found" });
            continue;
        }

        try {
            const adIdBytes = adIdToBytes(click.ad_id);
            const authorityPubkey = keypair.publicKey;
            const publisherPubkey = new PublicKey(publisher);
            const advertiserPubkey = new PublicKey(advertiserWallet);

            const [adPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("ad"), advertiserPubkey.toBuffer(), adIdBytes],
                program.programId
            );

            const [vaultPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault"), advertiserPubkey.toBuffer(), adIdBytes],
                program.programId
            );

            const [earningsPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("earnings"), adPda.toBuffer(), publisherPubkey.toBuffer()],
                program.programId
            );

            const tx = await program.methods
                .recordImpression(new BN(claimable_amount))
                .accounts({
                    ad: adPda,
                    vault: vaultPda,
                    earnings: earningsPda,
                    signer: authorityPubkey,
                    advertiser: advertiserPubkey,
                    publisher: publisherPubkey,
                    systemProgram: SystemProgram.programId
                }).rpc();

            results.push({ ad: click.ad_id, publisher, advertiser: advertiserWallet, tx, success: true });


        } catch (error: any) {
            console.log("  error logs:", error?.logs);
            results.push({ ad: click.ad_id, publisher, success: false, error: error?.message });
        }
    }

    const successfulAdIds = results
        .filter(r => r.success)
        .map(r => r.ad);

    if (successfulAdIds.length > 0) {
        await prisma.click.updateMany({
            where: {
                publisher_url: { in: websiteUrlMap },
                ad_id: { in: successfulAdIds },
                processed: false
            },
            data: { processed: true }
        });
    }


    return NextResponse.json({ results });
}

export async function PATCH(req: Request) {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { adIds } = await req.json();

    await prisma.click.updateMany({
        where: {
            ad_id: { in: adIds },
            processed: true,
            claimed: false,
        },
        data: { claimed: true, claimed_at: new Date() }
    });

    return NextResponse.json({ success: true });
}