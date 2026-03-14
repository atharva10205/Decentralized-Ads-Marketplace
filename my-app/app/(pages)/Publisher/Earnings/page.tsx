'use client'

import { BarChart3, ArrowDownRight, DollarSign, Download, TrendingUp, Pencil, Wallet, Clock, Hash } from 'lucide-react';
import Sidebar from '../sidebar/sidebar';
import { useQuery } from '@tanstack/react-query';
import { useSession } from "next-auth/react";
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import { IDL } from '@/lib/idl';
import { adIdToBytes } from '@/lib/solana';
import { useRouter } from 'next/navigation';
const alpha = (op: number) => `rgba(255,255,255,${op})`;
type Transaction = {
    ad_id: string;
    publisher_id: string;
    click_count: number;
    earnings: number;
    timestamp: string | null;
};
type Earnings_Data = {
    publisher: { wallet_address: string };
    earningsRecords: { publisher: string; ad: string; claimable_amount: number }[];
    transactionList: Transaction[];
    accent: string;
}

const fetchEarningData = async (): Promise<Earnings_Data> => {
    const res = await fetch("/api/crud/Publisher/Earning");
    if (!res.ok) throw new Error('Failed to fetch Earnings data');
    return res.json();
}

const formatTimestamp = (ts: string | null) => {
    if (!ts) return 'Pending';
    const d = new Date(ts);
    return d.toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

const Earnings = () => {
    const { status } = useSession();
    const activeTab = 'Earnings';
    const wallet = useWallet();
    const router = useRouter();

    const fetchquery = useQuery({
        queryKey: ['earnings'],
        queryFn: fetchEarningData,
        enabled: status === 'authenticated',
    });
    const earningsRecords = fetchquery.data?.earningsRecords ?? [];
    const transactionList = fetchquery.data?.transactionList ?? [];
    const ACCENT = fetchquery.data?.accent ?? '#0010FF';
    const hAlpha = (op: number) => {
        const r = parseInt(ACCENT.slice(1, 3), 16);
        const g = parseInt(ACCENT.slice(3, 5), 16);
        const b = parseInt(ACCENT.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${op})`;
    };
    const totalBalanceSOL = earningsRecords.reduce((sum, tx) => sum + tx.claimable_amount, 0) / 1_000_000;
    const totalEarned = transactionList.reduce((sum, tx) => sum + tx.earnings, 0);

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
                const [adPda] = PublicKey.findProgramAddressSync([Buffer.from("ad"), advertiserPubkey.toBuffer(), adIdBytes], program.programId);
                const [vaultPda] = PublicKey.findProgramAddressSync([Buffer.from("vault"), advertiserPubkey.toBuffer(), adIdBytes], program.programId);
                const [earningsPda] = PublicKey.findProgramAddressSync([Buffer.from("earnings"), adPda.toBuffer(), publisherPubkey.toBuffer()], program.programId);
                try {
                    await program.methods.claim().accounts({
                        vault: vaultPda,
                        earnings: earningsPda,
                        ad: adPda,
                        advertiser: advertiserPubkey,
                        publisher: publisherPubkey,
                        systemProgram: SystemProgram.programId,
                    }).rpc({ skipPreflight: false });
                    claimedAdIds.push(result.ad);
                } catch (claimError) {
                    console.error("Claim failed for ad:", result.ad, claimError);
                }
            }
        } catch (error) {
            console.error("Failed:", error);
        }
        if (claimedAdIds.length > 0) {
            await fetch("/api/crud/Publisher/Earning", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ adIds: claimedAdIds })
            });
            fetchquery.refetch();
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-[#0a0a0a] text-gray-300">
            <Sidebar activeTab={activeTab} />

            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h1 className="text-3xl font-bold mb-1 text-white tracking-tight font-mono">Earnings</h1>
                            <p className="text-gray-600 text-sm font-mono">Track your revenue and payments</p>
                        </div>
                    </div>

                    {/* Top Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

                        {/* Balance Card */}
                        <div
                            className="bg-[#111111] p-8 rounded-xl transition-all duration-200"
                            style={{ border: `1px solid ${alpha(0.08)}` }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 32px ${hAlpha(0.1)}`;
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.borderColor = alpha(0.08);
                                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                            }}
                        >
                            <p className="text-xs text-gray-600 uppercase tracking-widest mb-3 font-mono">Total Balance</p>
                            <p className="text-5xl font-bold text-white font-mono tabular-nums mb-1">
                                {totalBalanceSOL.toFixed(4)}
                                <span className="text-2xl text-gray-500 ml-2 font-mono">SOL</span>
                            </p>
                            <p className="text-xs text-gray-600 mb-8 font-mono">+12.7% from last week</p>

                            <button
                                onClick={Withdraw_BTN}
                                className="flex cursor-pointer items-center gap-2 px-6 py-3 rounded-xl bg-[#161616] text-gray-200 text-sm font-semibold font-mono hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                                style={{ border: `1px solid ${alpha(0.18)}` }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = ACCENT;
                                    e.currentTarget.style.boxShadow = `0 0 18px ${hAlpha(0.2)}`;
                                    e.currentTarget.style.color = '#ffffff';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = alpha(0.18);
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.color = '';
                                }}
                            >
                                <Download className="w-4 h-4" />
                                Withdraw
                            </button>

                            {/* Receiver Address */}
                            <div className="mt-8">
                                <p className="text-xs text-gray-600 uppercase tracking-widest mb-1.5 font-mono">Receiver's address</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-mono text-xs truncate max-w-[260px]">
                                        {fetchquery.data?.publisher?.wallet_address}
                                    </span>
                                    <button
                                        onClick={() => router.push('/Publisher/Settings')}
                                        className="flex items-center cursor-pointer gap-1 text-gray-600 hover:text-gray-300 transition-colors duration-150 ml-1 group"
                                    >
                                        <Pencil className="w-3 h-3" />
                                        <span className="text-xs group-hover:underline font-mono">Edit</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Overview Card */}
                        <div
                            className="bg-[#111111] p-8 rounded-xl transition-all duration-200"
                            style={{ border: `1px solid ${alpha(0.08)}` }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 32px ${hAlpha(0.1)}`;
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.borderColor = alpha(0.08);
                                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                            }}
                        >
                            <p className="text-xs text-gray-600 uppercase tracking-widest mb-6 font-mono">Earnings Overview</p>
                            <div className="space-y-3">

                                {/* Claimable */}
                                <div className="flex items-center justify-between p-4 bg-[#0d0d0d] border border-gray-800/50 rounded-lg">
                                    <div>
                                        <p className="text-xs text-gray-600 uppercase tracking-widest mb-1.5 text-mono">Claimable Now</p>
                                        <p className="text-xl font-bold text-white font-mono tabular-nums">
                                            +{totalBalanceSOL.toFixed(4)} SOL
                                        </p>
                                    </div>
                                    <TrendingUp className="w-6 h-6 text-gray-500" />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-[#0d0d0d] border border-gray-800/50 rounded-lg">
                                    <div>
                                        <p className="text-xs text-gray-600 uppercase tracking-widest mb-1.5 text-mono">Total Claimed</p>
                                        <p className="text-xl font-bold text-white font-mono tabular-nums">
                                            {totalEarned.toFixed(4)} SOL
                                        </p>
                                    </div>
                                    <BarChart3 className="w-6 h-6 text-gray-500" />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-[#0d0d0d] border border-gray-800/50 rounded-lg">
                                    <div>
                                        <p className="text-xs text-gray-600 uppercase tracking-widest mb-1.5 text-mono">Total Transactions</p>
                                        <p className="text-xl font-bold text-white font-mono tabular-nums">
                                            {transactionList.length}
                                        </p>
                                    </div>
                                    <DollarSign className="w-6 h-6 text-gray-500" />
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="bg-[#111111] border border-gray-800/70 rounded-xl overflow-hidden">

                        <div className="px-6 py-5 border-b border-gray-800/60 flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-widest font-mono">Transaction History</h2>
                                <p className="text-xs text-gray-600 mt-0.5 font-mono">All claimed earnings grouped by session</p>
                            </div>
                            <span className="text-xs text-gray-600 font-mono bg-[#161616] border border-gray-800/60 px-3 py-1 rounded-lg">
                                {transactionList.length} transactions
                            </span>
                        </div>

                        {transactionList.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-700">
                                <Wallet className="w-8 h-8 mb-3 opacity-40" />
                                <p className="text-sm font-mono">No transactions yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-800/50 max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                                {transactionList.map((tx, idx) => (
                                    <div
                                        key={idx}
                                        className="px-6 py-5 hover:bg-[#161616]/60 transition-colors duration-150 cursor-pointer group"
                                    >
                                        <div className="flex items-center justify-between">

                                            <div className="flex items-center gap-4">
                                                <div className="p-2.5 rounded-lg bg-[#161616] border border-gray-800/60 group-hover:border-gray-700 transition-colors">
                                                    <ArrowDownRight className="w-4 h-4 text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-200 mb-1 font-mono">Revenue</p>
                                                    <div className="flex items-center gap-2 text-xs text-gray-600 font-mono">
                                                        <span className="flex items-center gap-1">
                                                            <Hash className="w-3 h-3" />
                                                            {tx.ad_id.slice(0, 8)}…
                                                        </span>
                                                        <span className="text-gray-800">•</span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {formatTimestamp(tx.timestamp)}
                                                        </span>
                                                        <span className="text-gray-800">•</span>
                                                        <span>{tx.click_count} click{tx.click_count !== 1 ? 's' : ''}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-base font-bold text-white font-mono tabular-nums mb-1">
                                                    +{tx.earnings.toFixed(6)} SOL
                                                </p>
                                                <span
                                                    className="text-xs font-mono px-2 py-0.5 rounded tracking-wide border text-black border-black"
                                                    style={{ background: ACCENT.toLowerCase() === '#ffffff' ? '#4ADE80' : ACCENT }}
                                                >
                                                    Claimed
                                                </span>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Earnings;