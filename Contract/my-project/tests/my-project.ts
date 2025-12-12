import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import { assert, expect } from "chai";
import BN from "bn.js";

describe("my_project", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.MyProject as Program;
  
  let client: Keypair;
  let authority: Keypair;
  let recipient: Keypair;
  let adId: Buffer;
  let adPda: PublicKey;
  let vaultPda: PublicKey;

  const ratePerView = new BN(1000000); // 0.001 SOL per view
  const intervalSeconds = new BN(60); // 60 seconds between payouts

  beforeEach(async () => {
    // Generate new keypairs for each test
    client = Keypair.generate();
    authority = Keypair.generate();
    recipient = Keypair.generate();

    // Generate a unique ad_id for each test
    adId = Buffer.from(Keypair.generate().publicKey.toBytes());

    // Airdrop SOL to client (more than enough for rent + deposits)
    const airdropSig = await provider.connection.requestAirdrop(
      client.publicKey,
      20 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSig);

    // Derive PDAs
    [adPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("ad"), client.publicKey.toBuffer(), adId],
      program.programId
    );

    [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), client.publicKey.toBuffer(), adId],
      program.programId
    );
  });

  describe("initialize_ad", () => {
    it("should initialize an ad successfully", async () => {
      await program.methods
        .initializeAd(Array.from(adId), ratePerView, intervalSeconds)
        .accounts({
          ad: adPda,
          vault: vaultPda,
          client: client.publicKey,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([client])
        .rpc();

      // Fetch and verify the ad account
      const adAccount = await program.account.ad.fetch(adPda);
      
      assert.deepEqual(adAccount.adId, Array.from(adId));
      assert.ok(adAccount.client.equals(client.publicKey));
      assert.ok(adAccount.authority.equals(authority.publicKey));
      assert.ok(adAccount.ratePerView.eq(ratePerView));
      assert.ok(adAccount.paidViews.eq(new BN(0)));
      assert.ok(adAccount.intervalSeconds.eq(intervalSeconds));
      assert.ok(adAccount.lastPayoutTs.eq(new BN(0)));

      // Verify vault account exists
      const vaultAccount = await program.account.vaultAccount.fetch(vaultPda);
      assert.exists(vaultAccount.bump);
    });

    it("should fail to initialize the same ad twice", async () => {
      // First initialization
      await program.methods
        .initializeAd(Array.from(adId), ratePerView, intervalSeconds)
        .accounts({
          ad: adPda,
          vault: vaultPda,
          client: client.publicKey,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([client])
        .rpc();

      // Second initialization should fail
      try {
        await program.methods
          .initializeAd(Array.from(adId), ratePerView, intervalSeconds)
          .accounts({
            ad: adPda,
            vault: vaultPda,
            client: client.publicKey,
            authority: authority.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([client])
          .rpc();
        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.ok(err.toString().includes("already in use"));
      }
    });
  });

  describe("deposit", () => {
    beforeEach(async () => {
      // Initialize ad before testing deposits
      await program.methods
        .initializeAd(Array.from(adId), ratePerView, intervalSeconds)
        .accounts({
          ad: adPda,
          vault: vaultPda,
          client: client.publicKey,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([client])
        .rpc();
    });

    it("should deposit funds to vault successfully", async () => {
      const depositAmount = new BN(5 * anchor.web3.LAMPORTS_PER_SOL);
      
      const vaultBalanceBefore = await provider.connection.getBalance(vaultPda);
      
      await program.methods
        .deposit(depositAmount)
        .accounts({
          ad: adPda,
          vault: vaultPda,
          client: client.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([client])
        .rpc();

      const vaultBalanceAfter = await provider.connection.getBalance(vaultPda);
      
      assert.equal(
        vaultBalanceAfter - vaultBalanceBefore,
        depositAmount.toNumber()
      );
    });

    it("should allow multiple deposits", async () => {
      const depositAmount1 = new BN(2 * anchor.web3.LAMPORTS_PER_SOL);
      const depositAmount2 = new BN(3 * anchor.web3.LAMPORTS_PER_SOL);
      
      await program.methods
        .deposit(depositAmount1)
        .accounts({
          ad: adPda,
          vault: vaultPda,
          client: client.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([client])
        .rpc();

      const vaultBalanceAfterFirst = await provider.connection.getBalance(vaultPda);

      await program.methods
        .deposit(depositAmount2)
        .accounts({
          ad: adPda,
          vault: vaultPda,
          client: client.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([client])
        .rpc();

      const vaultBalanceAfterSecond = await provider.connection.getBalance(vaultPda);
      
      assert.equal(
        vaultBalanceAfterSecond - vaultBalanceAfterFirst,
        depositAmount2.toNumber()
      );
    });

    it("should fail if client doesn't have enough balance", async () => {
      const depositAmount = new BN(100 * anchor.web3.LAMPORTS_PER_SOL);
      
      try {
        await program.methods
          .deposit(depositAmount)
          .accounts({
            ad: adPda,
            vault: vaultPda,
            client: client.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([client])
          .rpc();
        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.ok(err);
      }
    });
  });

  describe("payout", () => {
    const depositAmount = new BN(5 * anchor.web3.LAMPORTS_PER_SOL);

    beforeEach(async () => {
      // Initialize ad
      await program.methods
        .initializeAd(Array.from(adId), ratePerView, intervalSeconds)
        .accounts({
          ad: adPda,
          vault: vaultPda,
          client: client.publicKey,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([client])
        .rpc();

      // Deposit funds
      await program.methods
        .deposit(depositAmount)
        .accounts({
          ad: adPda,
          vault: vaultPda,
          client: client.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([client])
        .rpc();
    });

    it("should payout successfully for new views", async () => {
      const currentViews = new BN(1000);
      const expectedPayout = currentViews.mul(ratePerView);

      const recipientBalanceBefore = await provider.connection.getBalance(
        recipient.publicKey
      );
      const vaultBalanceBefore = await provider.connection.getBalance(vaultPda);

      await program.methods
        .payout(currentViews)
        .accounts({
          ad: adPda,
          vault: vaultPda,
          recipient: recipient.publicKey,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([authority])
        .rpc();

      const recipientBalanceAfter = await provider.connection.getBalance(
        recipient.publicKey
      );
      const vaultBalanceAfter = await provider.connection.getBalance(vaultPda);
      const adAccount = await program.account.ad.fetch(adPda);

      assert.equal(
        recipientBalanceAfter - recipientBalanceBefore,
        expectedPayout.toNumber()
      );
      assert.equal(
        vaultBalanceBefore - vaultBalanceAfter,
        expectedPayout.toNumber()
      );
      assert.ok(adAccount.paidViews.eq(currentViews));
      assert.ok(adAccount.lastPayoutTs.gt(new BN(0)));
    });

    it("should fail if unauthorized caller tries to payout", async () => {
      const currentViews = new BN(100);
      const unauthorizedCaller = Keypair.generate();

      // Airdrop to pay for transaction
      const airdropSig = await provider.connection.requestAirdrop(
        unauthorizedCaller.publicKey,
        anchor.web3.LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(airdropSig);

      try {
        await program.methods
          .payout(currentViews)
          .accounts({
            ad: adPda,
            vault: vaultPda,
            recipient: recipient.publicKey,
            authority: unauthorizedCaller.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([unauthorizedCaller])
          .rpc();
        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.ok(err.toString().includes("Unauthorized"));
      }
    });

    it("should fail if payout happens too soon", async () => {
      const currentViews = new BN(100);

      // First payout
      await program.methods
        .payout(currentViews)
        .accounts({
          ad: adPda,
          vault: vaultPda,
          recipient: recipient.publicKey,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([authority])
        .rpc();

      // Try immediate second payout
      try {
        await program.methods
          .payout(new BN(200))
          .accounts({
            ad: adPda,
            vault: vaultPda,
            recipient: recipient.publicKey,
            authority: authority.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([authority])
          .rpc();
        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.ok(err.toString().includes("PayoutTooSoon"));
      }
    });

    it("should succeed with no payout if views haven't increased", async () => {
      const currentViews = new BN(100);

      // First payout
      await program.methods
        .payout(currentViews)
        .accounts({
          ad: adPda,
          vault: vaultPda,
          recipient: recipient.publicKey,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([authority])
        .rpc();

      // Wait for interval
      await new Promise((resolve) => setTimeout(resolve, 61000));

      const recipientBalanceBefore = await provider.connection.getBalance(
        recipient.publicKey
      );

      // Payout with same views
      await program.methods
        .payout(currentViews)
        .accounts({
          ad: adPda,
          vault: vaultPda,
          recipient: recipient.publicKey,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([authority])
        .rpc();

      const recipientBalanceAfter = await provider.connection.getBalance(
        recipient.publicKey
      );

      // No payout should occur
      assert.equal(recipientBalanceAfter, recipientBalanceBefore);
    });

    it("should fail if vault has insufficient funds", async () => {
      // Calculate views that would drain the vault
      const vaultBalance = await provider.connection.getBalance(vaultPda);
      const viewsThatExceedBalance = new BN(vaultBalance)
        .div(ratePerView)
        .add(new BN(1000));

      try {
        await program.methods
          .payout(viewsThatExceedBalance)
          .accounts({
            ad: adPda,
            vault: vaultPda,
            recipient: recipient.publicKey,
            authority: authority.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([authority])
          .rpc();
        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.ok(err.toString().includes("InsufficientVault"));
      }
    });

    it("should handle incremental payouts correctly", async () => {
      const firstViews = new BN(100);
      const secondViews = new BN(250);

      // First payout
      await program.methods
        .payout(firstViews)
        .accounts({
          ad: adPda,
          vault: vaultPda,
          recipient: recipient.publicKey,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([authority])
        .rpc();

      let adAccount = await program.account.ad.fetch(adPda);
      assert.ok(adAccount.paidViews.eq(firstViews));

      // Wait for interval
      await new Promise((resolve) => setTimeout(resolve, 61000));

      const recipientBalanceBefore = await provider.connection.getBalance(
        recipient.publicKey
      );

      // Second payout with more views
      await program.methods
        .payout(secondViews)
        .accounts({
          ad: adPda,
          vault: vaultPda,
          recipient: recipient.publicKey,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([authority])
        .rpc();

      const recipientBalanceAfter = await provider.connection.getBalance(
        recipient.publicKey
      );
      adAccount = await program.account.ad.fetch(adPda);

      const delta = secondViews.sub(firstViews);
      const expectedPayout = delta.mul(ratePerView);

      assert.equal(
        recipientBalanceAfter - recipientBalanceBefore,
        expectedPayout.toNumber()
      );
      assert.ok(adAccount.paidViews.eq(secondViews));
    });
  });
});