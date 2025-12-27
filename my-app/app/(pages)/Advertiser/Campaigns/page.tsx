'use client'

import { Plus, Edit, Copy, Pause, Play, Trash2 } from 'lucide-react';
import Sidebar from '../Componants/Sidebar';

const Campaigns = () => {
  const campaigns = [
    {
      name: 'Book Store Ads',
      clicks: 420,
      cpc: '0.00000012 SOL',
      status: 'Active',
      performance: 92,
      budget: 1.2,
      spent: 0.74,
    },
    {
      name: 'NFT Collection Launch',
      clicks: 580,
      cpc: '0.00000018 SOL',
      status: 'Active',
      performance: 87,
      budget: 2.0,
      spent: 1.31,
    },
    {
      name: 'DeFi Protocol Promo',
      clicks: 240,
      cpc: '0.00000009 SOL',
      status: 'Paused',
      performance: 78,
      budget: 0.8,
      spent: 0.29,
    },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0b0b0b] to-[#0d0d0d] text-gray-200">
      <Sidebar activeTab="Campaigns" />

      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-1">Campaigns</h1>
            <p className="text-gray-500">Manage all your advertising campaigns</p>
          </div>

          <button className="group relative px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] text-black overflow-hidden hover:shadow-2xl hover:shadow-[#00FFA3]/20 active:scale-95 transition-all duration-300">
            <span className="relative z-10 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Campaign
            </span>
          </button>
        </div>

        {/* Campaign list */}
        <div className="grid gap-6">
          {campaigns.map((campaign) => {
            const percentUsed = Math.min(
              Math.round((campaign.spent / campaign.budget) * 100),
              100
            );

            return (
              <div
                key={campaign.name}
                className="group bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 rounded-2xl overflow-hidden hover:border-gray-700 hover:shadow-xl hover:shadow-[#00FFA3]/5 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold group-hover:text-[#00FFA3] transition-colors">
                          {campaign.name}
                        </h3>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            campaign.status === 'Active'
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                              : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-2 ${
                              campaign.status === 'Active'
                                ? 'bg-green-400 animate-pulse'
                                : 'bg-gray-400'
                            }`}
                          />
                          {campaign.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Campaign ID: #
                        {Math.random().toString(36).slice(2, 11).toUpperCase()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800">
                        {campaign.status === 'Active' ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                      <button className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-[#0a0a0a] p-4 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">Budget</p>
                      <p className="text-lg font-semibold">{campaign.budget} SOL</p>
                    </div>
                    <div className="bg-[#0a0a0a] p-4 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">Spent</p>
                      <p className="text-lg font-semibold text-[#DC1FFF]">
                        {campaign.spent} SOL
                      </p>
                    </div>
                    <div className="bg-[#0a0a0a] p-4 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">Clicks</p>
                      <p className="text-lg font-semibold">
                        {campaign.clicks.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-[#0a0a0a] p-4 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">CPC</p>
                      <p className="text-lg font-semibold">{campaign.cpc}</p>
                    </div>
                    <div className="bg-[#0a0a0a] p-4 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">Performance</p>
                      <p className="text-lg font-semibold text-[#00FFA3]">
                        {campaign.performance}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF]"
                        style={{ width: `${percentUsed}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400">
                      {percentUsed}% used
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Campaigns;
