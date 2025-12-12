// scripts/payoutWorker.ts
import { PrismaClient } from "@prisma/client";
import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { getServerProgramFromEnv } from "../src/app/lib/serverProgram";

const prisma = new PrismaClient();

async function main() {
  const { program } = getServerProgramFromEnv();

  // fetch all ads (or filter by active ones)
  const ads = await prisma.aD_1.findMany();

  for (const ad of ads) {
    try {
      const clientPubkey = new PublicKey(ad.client_pubkey || ad.client || ad.clientKey || ad.clientPubkey); // adjust field
      const adIdStr = ad.ad_id || ad.adId || ad.key; // your unique ad string stored in Prisma
      // build id buffer (32 bytes)
      const idBuf = new Uint8Array(32);
      idBuf.set(new TextEncoder().encode(adIdStr).slice(0, 32));

      const [adPda] = await PublicKey.findProgramAddress(
        [Buffer.from("ad"), clientPubkey.toBuffer(), Buffer.from(idBuf)],
        program.programId
      );
      const [vaultPda] = await PublicKey.findProgramAddress(
        [Buffer.from("vault"), clientPubkey.toBuffer(), Buffer.from(idBuf)],
        program.programId
      );

      // current views from DB
      const currentViews = BigInt(ad.views || 0);

      // optional -- skip if views == 0
      if (currentViews === 0n) continue;

      console.log("Calling payout for ad", ad.ad_id, "views:", String(currentViews));

      // call contract. Adjust to your program rpc signature (BN or u64)
      await program.rpc.payout(new anchor.BN(currentViews.toString()), {
        accounts: {
          ad: adPda,
          vault: vaultPda,
          recipient: new PublicKey(ad.recipient_pubkey || ad.publisher_pubkey), // ensure you have recipient stored in DB
          authority: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
      });

      console.log("payout called for ad", ad.ad_id);
      // after success, you might want to mark ad.views_paid = currentViews in DB or let on-chain paid_views be authoritative
    } catch (e) {
      console.error("payout error for ad", ad.ad_id, e);
    }
  }
  await prisma.$disconnect();
}

if (require.main === module) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
