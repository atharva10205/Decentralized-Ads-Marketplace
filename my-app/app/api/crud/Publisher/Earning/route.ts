import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";
import { IDL } from "@/lib/idl";
import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { NextResponse } from "next/server";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { adIdToBytes } from "@/lib/solana";
import { buffer } from "stream/consumers";


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
        where: { publisher_url: { in: websiteUrlMap }, processed: false },
        select: { ad_id: true, publisher_id: true }
    });

    const adIdMap = data.map(w => w.ad_id);

    const cpcList = await prisma.ad.findMany({
        where: { id: { in: adIdMap } },
        select: { id: true, cost_per_click: true }
    });

    const cpcMap = new Map(cpcList.map(c => [c.id, Number(c.cost_per_click)]));
    const publisherWallets = await prisma.publisher.findMany({
        where: { id: { in: user.map(u => u.id) } },
        select: { id: true, wallet_address: true }
    });
    const walletMap = new Map(publisherWallets.map(p => [p.id, p.wallet_address]));

    const earningsRecords = data.map(click => {
        const cpc = cpcMap.get(click.ad_id) ?? 0;
        const claimable_amount = Math.round(cpc * 1_000_000);

        return {
            publisher: walletMap.get(click.publisher_id) ?? null,
            ad: click.ad_id,
            claimable_amount,
        };
    });

    return NextResponse.json({ publisher, earningsRecords });
}
export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const connection = new Connection(process.env.RPC_URL!);
    const keypair = Keypair.fromSecretKey(bs58.decode(process.env.AUTHORITY_PRIVATE_KEY!));
    const wallet = new NodeWallet(keypair);
    const provider = new AnchorProvider(connection, wallet, {});
    const program = new Program(IDL as any, provider);

    console.log("Authority pubkey:", keypair.publicKey.toString());

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

    console.log("Unprocessed clicks found:", data.length);

    const adIdMap = data.map((w) => w.ad_id);

    const cpcList = await prisma.ad.findMany({
        where: { id: { in: adIdMap } },
        select: { id: true, cost_per_click: true, wallet_address: true },
    });
    const cpcMap = new Map(cpcList.map((c) => [c.id, Number(c.cost_per_click)]));
    const advertiserWalletMap = new Map(cpcList.map((c) => [c.id, c.wallet_address]));

    console.log("CPC list:", cpcList.map(c => ({ id: c.id, cpc: c.cost_per_click, wallet: c.wallet_address })));

    const publisherWallets = await prisma.publisher.findMany({
        where: { id: { in: user.map((u) => u.id) } },
        select: { id: true, wallet_address: true },
    });
    const publisherWalletsMap = new Map(publisherWallets.map((p) => [p.id, p.wallet_address]));

    const results = [];

    for (const click of data) {
        console.log("\n--- Processing click ---");
        console.log("  ad_id:", click.ad_id);
        console.log("  publisher_id:", click.publisher_id);

        const publisher = publisherWalletsMap.get(click.publisher_id) ?? null;
        if (!publisher) {
            console.log("  No publisher wallet found for publisher_id:", click.publisher_id);
            continue;
        }
        console.log("  publisher wallet:", publisher);

        const cpc = cpcMap.get(click.ad_id) ?? 0;
        const claimable_amount = Math.round(cpc * 1_000_000_000);
        console.log("  cpc (SOL):", cpc);
        console.log("  claimable_amount (lamports):", claimable_amount);

        const advertiserWallet = advertiserWalletMap.get(click.ad_id);
        if (!advertiserWallet) {
            console.log("  No advertiser wallet found for ad_id:", click.ad_id);
            results.push({ ad: click.ad_id, success: false, error: "No advertiser wallet found" });
            continue;
        }
        console.log("  advertiser wallet:", advertiserWallet);

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

            console.log("  adPda:", adPda.toString());
            console.log("  vaultPda:", vaultPda.toString());
            console.log("  earningsPda:", earningsPda.toString());
            console.log("  Check adPda on solscan: https://solscan.io/account/" + adPda.toString() + "?cluster=devnet");
            console.log("  Check vaultPda on solscan: https://solscan.io/account/" + vaultPda.toString() + "?cluster=devnet");

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

            console.log("  Transaction successful!");
            console.log("  tx signature:", tx);
            console.log("  Check tx on solscan: https://solscan.io/tx/" + tx + "?cluster=devnet");

            results.push({ ad: click.ad_id, publisher, tx, success: true });

        } catch (error: any) {
            console.log("  Transaction failed!");
            console.log("  error name:", error?.name);
            console.log("  error message:", error?.message);
            // logs the specific anchor error code if present
            console.log("  error logs:", error?.logs);
            results.push({ ad: click.ad_id, publisher, success: false, error: error?.message });
        }
        
    }
      await prisma.click.updateMany({
        where: { publisher_url: { in: websiteUrlMap }, processed: false },
        data: { processed: true }
    });

    console.log("\n📊 Final results:", JSON.stringify(results, null, 2));

    return NextResponse.json({ results });
}