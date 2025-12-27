'use client';

import { Upload, Download, Copy, ArrowDownRight, ArrowUpRight, Send, ExternalLink } from 'lucide-react';
import Sidebar from '../Componants/Sidebar';

const Wallet = () => {
  const activeTab = 'Wallet';

  const transactions = [
    { type: 'deposit', amount: '2.5 SOL', date: '2 hours ago', status: 'Completed', txHash: '5x7k...3mP9' },
    { type: 'withdraw', amount: '0.8 SOL', date: '1 day ago', status: 'Completed', txHash: '9mK2...8nQ1' },
    { type: 'spend', amount: '0.42 SOL', date: '2 days ago', status: 'Completed', txHash: '3pL5...7vR4' },
    { type: 'deposit', amount: '1.0 SOL', date: '5 days ago', status: 'Completed', txHash: '8nM3...2kT6' },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0b0b0b] to-[#0d0d0d] text-gray-200">
      
      <Sidebar activeTab={activeTab} />

      <main className="flex-1  p-8 overflow-y-auto">
        
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-1">Wallet</h1>
            <p className="text-gray-500">Manage your funds and transactions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#00FFA3]/10 to-[#DC1FFF]/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <p className="text-sm text-gray-500 mb-2">Available Balance</p>
              <p className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                3.82 SOL
              </p>
              <div className="flex gap-3">
                <button className="flex-1 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] text-black flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" />
                  Deposit
                </button>
                <button className="flex-1 px-6 py-3 rounded-xl font-semibold bg-gray-800/50 hover:bg-gray-800 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Withdraw
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 p-8 rounded-2xl">
            <p className="text-sm text-gray-500 mb-6">Wallet Address</p>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 bg-[#0a0a0a] p-4 rounded-xl font-mono text-sm break-all">
                7xKj9mN3pL5vR8qT2wE4nM6kP9sL3vR8qT2
              </div>
              <button className="p-4 rounded-xl bg-gray-800/50 hover:bg-gray-800">
                <Copy className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Deposited</p>
                <p className="text-xl font-semibold text-green-400">+6.5 SOL</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Spent</p>
                <p className="text-xl font-semibold text-red-400">-2.68 SOL</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-800/50">
            <h2 className="text-lg font-semibold mb-1">Transaction History</h2>
            <p className="text-sm text-gray-500">View all your wallet transactions</p>
          </div>

          <div className="divide-y divide-gray-800/50">
            {transactions.map((tx, idx) => (
              <div key={idx} className="p-6 hover:bg-[#161616]/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                      tx.type === 'deposit' ? 'bg-green-500/10' :
                      tx.type === 'withdraw' ? 'bg-red-500/10' :
                      'bg-blue-500/10'
                    }`}>
                      {tx.type === 'deposit' && <ArrowDownRight className="w-5 h-5 text-green-400" />}
                      {tx.type === 'withdraw' && <ArrowUpRight className="w-5 h-5 text-red-400" />}
                      {tx.type === 'spend' && <Send className="w-5 h-5 text-blue-400" />}
                    </div>

                    <div>
                      <p className="font-semibold capitalize">{tx.type}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{tx.date}</span>
                        <span>•</span>
                        <span className="font-mono">{tx.txHash}</span>
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-xl font-bold ${
                      tx.type === 'deposit' ? 'text-green-400' : 'text-gray-200'
                    }`}>
                      {tx.type === 'deposit' ? '+' : '-'}{tx.amount}
                    </p>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                      {tx.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};

export default Wallet;
