'use client'

import { useRouter } from 'next/navigation';
import { Target, TrendingUp, MousePointerClick, DollarSign, Plus } from 'lucide-react';
import Sidebar from '../Componants/Sidebar';

const Dashboard = () => {
  const activeTab ='Dashboard';
  const router = useRouter();
  

  const stats = [
    { label: 'Active Campaigns', value: '3', icon: Target, trend: '+12%', trendUp: true },
    { label: 'Weekly Clicks', value: '1,240', icon: MousePointerClick, trend: '+8.2%', trendUp: true },
    { label: 'Weekly Spend', value: '0.42 SOL', icon: DollarSign, trend: '-5%', trendUp: false },
  ];

  const campaigns = [
    { name: 'Book Store Ads', clicks: 420, cpc: '0.00000012 SOL', status: 'Active', performance: 92 },
    { name: 'NFT Collection Launch', clicks: 580, cpc: '0.00000018 SOL', status: 'Active', performance: 87 },
    { name: 'DeFi Protocol Promo', clicks: 240, cpc: '0.00000009 SOL', status: 'Paused', performance: 78 },
  ];



  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0b0b0b] to-[#0d0d0d] text-gray-200">
     <Sidebar activeTab={activeTab} />
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
            <p className="text-gray-500">Welcome back! Here's your campaign overview.</p>
          </div>
          <button
            onClick={() => router.push('/Advertiser-campaign')}
            className="group relative px-6 py-3 rounded-xl font-semibold
              bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF]
              text-black overflow-hidden
              hover:shadow-2xl hover:shadow-[#00FFA3]/20
              active:scale-95
              transition-all duration-300"
          >
            <span className="relative z-10 cursor-pointer flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Campaign
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#DC1FFF] to-[#00FFA3] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group relative bg-gradient-to-br from-[#121212] to-[#0f0f0f] 
                  border border-gray-800/50 p-6 rounded-2xl
                  hover:border-gray-700 hover:shadow-xl hover:shadow-[#00FFA3]/5
                  hover:-translate-y-1
                  transition-all duration-300 cursor-pointer overflow-hidden"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00FFA3]/5 to-[#DC1FFF]/5 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-[#00FFA3]/10 to-[#DC1FFF]/10 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-5 h-5 text-[#00FFA3]" />
                    </div>
                    <span className={`text-sm font-semibold flex items-center gap-1 ${stat.trendUp ? 'text-green-400' : 'text-red-400'}`}>
                      <TrendingUp className={`w-4 h-4 ${!stat.trendUp && 'rotate-180'}`} />
                      {stat.trend}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Campaigns Table */}
        <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-gray-800/50 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-1">Recent Campaigns</h2>
              <p className="text-sm text-gray-500">Track your active advertising campaigns</p>
            </div>
            <button 
              onClick={() => router.push('/campaigns')}
              className="text-sm text-[#00FFA3] hover:text-[#00FFA3]/80 transition-colors"
            >
              View All →
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0a0a0a] text-sm text-gray-500">
                <tr>
                  <th className="text-left p-4 font-medium">Campaign Name</th>
                  <th className="text-left p-4 font-medium">Clicks</th>
                  <th className="text-left p-4 font-medium">CPC</th>
                  <th className="text-left p-4 font-medium">Performance</th>
                  <th className="text-left p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign, idx) => (
                  <tr
                    key={campaign.name}
                    onClick={() => router.push(`/campaigns/${campaign.name.toLowerCase().replace(/\s+/g, '-')}`)}
                    className="border-t border-gray-800/50 hover:bg-[#161616]/50 transition-colors duration-200 cursor-pointer group"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <td className="p-4">
                      <span className="font-medium group-hover:text-[#00FFA3] transition-colors">
                        {campaign.name}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">{campaign.clicks.toLocaleString()}</td>
                    <td className="p-4 text-sm text-gray-400">{campaign.cpc}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] rounded-full transition-all duration-500"
                            style={{ width: `${campaign.performance}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-400 w-10">{campaign.performance}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                        ${campaign.status === 'Active' 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                          : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${campaign.status === 'Active' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                        {campaign.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;