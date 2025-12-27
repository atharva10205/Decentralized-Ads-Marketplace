'use client'

import { BarChart3, ArrowDownRight, ArrowUpRight, DollarSign, Download, ExternalLink, TrendingUp } from 'lucide-react';
import Sidebar from '../sidebar/sidebar';

const Earnings = () => {
    const activeTab = 'Earnings';

    const transactions = [
        { type: 'earning', amount: '0.42 SOL', date: '2 hours ago', status: 'Completed', source: 'TechBlog.io' },
        { type: 'withdraw', amount: '2.5 SOL', date: '1 day ago', status: 'Completed', txHash: '5x7k...3mP9' },
        { type: 'earning', amount: '0.35 SOL', date: '2 days ago', status: 'Completed', source: 'CryptoNews Daily' },
        { type: 'earning', amount: '0.28 SOL', date: '3 days ago', status: 'Completed', source: 'DevTutorials' },
    ];

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
                                <p className="text-5xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">3.24 SOL</p>
                                <p className="text-sm text-green-400 mb-6">+12.7% from last week</p>
                                <div className="flex gap-3">
                                    <button className="flex-1 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] text-black hover:shadow-xl hover:shadow-[#00FFA3]/20 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2">
                                        <Download className="w-4 h-4" />
                                        Withdraw
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
                            {transactions.map((tx, idx) => (
                                <div key={idx} className="p-6 hover:bg-[#161616]/50 transition-colors cursor-pointer group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl ${tx.type === 'earning' ? 'bg-green-500/10' : 'bg-blue-500/10'}`}>
                                                {tx.type === 'earning' ? <ArrowDownRight className="w-5 h-5 text-green-400" /> : <ArrowUpRight className="w-5 h-5 text-blue-400" />}
                                            </div>
                                            <div>
                                                <p className="font-semibold capitalize mb-1">{tx.type === 'earning' ? 'Revenue' : 'Withdrawal'}</p>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <span>{tx.date}</span>
                                                    {tx.source && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{tx.source}</span>
                                                        </>
                                                    )}
                                                    {tx.txHash && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="font-mono">{tx.txHash}</span>
                                                            <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <ExternalLink className="w-3 h-3" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-xl font-bold mb-1 ${tx.type === 'earning' ? 'text-green-400' : 'text-gray-200'}`}>
                                                {tx.type === 'earning' ? '+' : '-'}{tx.amount}
                                            </p>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                                                {tx.status}
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