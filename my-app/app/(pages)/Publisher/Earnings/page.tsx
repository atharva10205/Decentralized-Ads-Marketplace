'use client'

import { BarChart3, ArrowDownRight, DollarSign, Download, TrendingUp, Pencil, Anchor, Wallet } from 'lucide-react';
import Sidebar from '../sidebar/sidebar';
import { useQuery } from '@tanstack/react-query';
import { useSession } from "next-auth/react";
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import { IDL } from '@/lib/idl';
import { adIdToBytes } from '@/lib/solana';


type Earnings_Data = {
    publisher: { wallet_address: string };
    earningsRecords: { publisher: string; ad: string; claimable_amount: number }[];
}

const fetchEarningData = async (): Promise<Earnings_Data> => {
    const res = await fetch("/api/crud/Publisher/Earning");
    if (!res.ok) throw new Error('Failed to fetch Earnings data');
    return res.json();
}

const Earnings = () => {

    const { status } = useSession();
    const activeTab = 'Earnings';
    const wallet = useWallet();

    const fetchquery = useQuery({
        queryKey: ['earnings'],
        queryFn: fetchEarningData,
        enabled: status === 'authenticated',
    })


    const earningsRecords = fetchquery.data?.earningsRecords ?? [];
    const totalBalanceSOL = earningsRecords.reduce((sum, tx) => sum + tx.claimable_amount, 0) / 1_000_000;

    const Withdraw_BTN = async () => {
        const claimedAdIds: string[] = [];

        if (!wallet.publicKey || !wallet.signTransaction) {
            alert("Please connect your wallet first");
            return;
        }


        try {
            const res = await fetch("/api/crud/Publisher/Earning", { method: "POST" });
            const data = await res.json();


            const connection = new Connection("https://api.devnet.solana.com", "confirmed");
            const balanceBefore = await connection.getBalance(wallet.publicKey);

            const provider = new AnchorProvider(connection, wallet as any, {});
            const program = new Program(IDL as any, provider);

            const uniqueResults = data.results.filter(
                (result: any, index: number, self: any[]) =>
                    result.success && self.findIndex((r: any) => r.ad === result.ad) === index
            );


            for (const result of uniqueResults) {

                const adIdBytes = adIdToBytes(result.ad);
                const advertiserPubkey = new PublicKey(result.advertiser);
                const publisherPubkey = new PublicKey(fetchquery.data?.publisher?.wallet_address!);

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

                const vaultBalance = await connection.getBalance(vaultPda);

                try {
                    const tx = await program.methods
                        .claim()
                        .accounts({
                            vault: vaultPda,
                            earnings: earningsPda,
                            ad: adPda,
                            advertiser: advertiserPubkey,
                            publisher: publisherPubkey,
                            systemProgram: SystemProgram.programId,
                        })
                        .rpc({ skipPreflight: false });

                    const vaultBalanceAfter = await connection.getBalance(vaultPda);

                    claimedAdIds.push(result.ad);

                } catch (claimError) {
                    console.error(" Claim failed for ad:", result.ad, claimError);
                }
            }

            const balanceAfter = await connection.getBalance(wallet.publicKey);
          
        } catch (error) {
            console.error(" Failed:", error);
        }

        if (claimedAdIds.length > 0) {
            const patchRes = await fetch("/api/crud/Publisher/Earning", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ adIds: claimedAdIds })
            });
            const patchData = await patchRes.json();
            fetchquery.refetch();
        }
    }
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0b0b0b] to-[#0d0d0d] text-gray-200">
            <Sidebar activeTab={activeTab} />

            <main className="flex-1 p-8 overflow-auto">
                <div className="max-w-6xl">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h1 className="text-3xl font-bold mb-1 bg-white bg-clip-text text-transparent">Earnings</h1>
                            <p className="text-gray-500">Track your revenue and payments</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 p-8 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#00FFA3]/10 to-[#DC1FFF]/10 rounded-full blur-3xl" />
                            <div className="relative z-10">
                                <p className="text-sm text-gray-500 mb-2">Total Balance</p>
                                <p className="text-5xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                    {totalBalanceSOL.toFixed(4)} SOL
                                </p>
                                <p className="text-sm text-green-400 mb-6">+12.7% from last week</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={Withdraw_BTN}
                                        className="flex-1 px-6 py-3 cursor-pointer rounded-xl font-semibold bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] text-black hover:shadow-xl hover:shadow-[#00FFA3]/20 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2">
                                        <Download className="w-4 h-4" />
                                        Withdraw
                                    </button>
                                </div>
                            </div>

                            <div className="mt-10 flex flex-col items-baseline">
                                <div className='text-gray-500 text-sm mb-1'>
                                    Reciver's address
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div className='text-[#00FFA3]'>
                                        {fetchquery.data?.publisher?.wallet_address}
                                    </div>
                                    <button
                                        className="flex items-center gap-1 text-gray-500 hover:text-gray-300 cursor-pointer ml-2 transition-colors duration-200 group">
                                        <Pencil className="w-3.5 h-3.5" />
                                        <span className="text-xs group-hover:underline">Edit</span>
                                    </button>
                                </div>
                            </div>
                        </div>



                        <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 p-8 rounded-2xl">
                            <p className="text-sm text-gray-500 mb-6">Earnings Overview</p>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-xl">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">This Week</p>
                                        <p className="text-xl font-semibold text-[#00FFA3]">+0.42 SOL</p>
                                    </div>
                                    <TrendingUp className="w-8 h-8 text-green-400" />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-xl">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">This Month</p>
                                        <p className="text-xl font-semibold">1.85 SOL</p>
                                    </div>
                                    <BarChart3 className="w-8 h-8 text-[#DC1FFF]" />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-xl">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">All Time</p>
                                        <p className="text-xl font-semibold">12.47 SOL</p>
                                    </div>
                                    <DollarSign className="w-8 h-8 text-[#00FFA3]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 p-6 rounded-2xl">
                            <p className="text-sm text-gray-500 mb-2">Pending</p>
                            <p className="text-3xl font-bold mb-1">0.18 SOL</p>
                            <p className="text-xs text-gray-500">Pays on Jan 1</p>
                        </div>
                        <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 p-6 rounded-2xl">
                            <p className="text-sm text-gray-500 mb-2">Last Payment</p>
                            <p className="text-3xl font-bold mb-1">2.50 SOL</p>
                            <p className="text-xs text-gray-500">Dec 1, 2025</p>
                        </div>
                        <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 p-6 rounded-2xl">
                            <p className="text-sm text-gray-500 mb-2">Avg. Daily</p>
                            <p className="text-3xl font-bold mb-1">0.06 SOL</p>
                            <p className="text-xs text-green-400">+8% this week</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 rounded-2xl overflow-hidden shadow-xl">
                        <div className="p-6 border-b border-gray-800/50">
                            <h2 className="text-lg font-semibold mb-1">Payment History</h2>
                            <p className="text-sm text-gray-500">All your earnings and withdrawals</p>
                        </div>
                        <div className="divide-y divide-gray-800/50">
                            {earningsRecords.map((tx, idx) => (
                                <div key={idx} className="p-6 hover:bg-[#161616]/50 transition-colors cursor-pointer group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-xl bg-green-500/10">
                                                <ArrowDownRight className="w-5 h-5 text-green-400" />
                                            </div>
                                            <div>
                                                <p className="font-semibold mb-1">Revenue</p>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <span className="font-mono text-xs">{tx.ad}</span>
                                                    <span>•</span>
                                                    <span className="font-mono text-xs truncate max-w-[120px]">{tx.publisher}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold mb-1 text-green-400">
                                                +{(tx.claimable_amount / 1_000_000).toFixed(4)} SOL
                                            </p>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                                                Claimable
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};


export default Earnings;