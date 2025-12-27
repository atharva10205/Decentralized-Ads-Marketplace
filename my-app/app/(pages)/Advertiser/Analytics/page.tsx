'use client';

import { Download, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Sidebar from '../Componants/Sidebar';

const Analytics = () => {
  const activeTab = 'Analytics';

  const analyticsData = [
    { metric: 'Total Impressions', value: '45,230', change: '+15.3%', up: true },
    { metric: 'Click-Through Rate', value: '2.74%', change: '+0.4%', up: true },
    { metric: 'Conversion Rate', value: '1.82%', change: '-0.2%', up: false },
    { metric: 'Avg. Cost Per Click', value: '0.00000015 SOL', change: '-8.1%', up: true },
  ];

  const campaigns = [
    { name: 'Book Store Ads', clicks: 420, performance: 92 },
    { name: 'NFT Collection Launch', clicks: 580, performance: 87 },
    { name: 'DeFi Protocol Promo', clicks: 240, performance: 78 },
  ];

  const chartData = [
    { date: 'Jan 1', impressions: 2400, clicks: 65, conversions: 12 },
    { date: 'Jan 5', impressions: 3200, clicks: 88, conversions: 18 },
    { date: 'Jan 10', impressions: 2800, clicks: 72, conversions: 14 },
    { date: 'Jan 15', impressions: 4100, clicks: 112, conversions: 24 },
    { date: 'Jan 20', impressions: 3600, clicks: 95, conversions: 19 },
    { date: 'Jan 25', impressions: 4800, clicks: 128, conversions: 28 },
    { date: 'Today', impressions: 5200, clicks: 142, conversions: 32 },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0b0b0b] to-[#0d0d0d] text-gray-200">
      
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-1">Analytics</h1>
            <p className="text-gray-500">Detailed insights into your campaign performance</p>
          </div>
          <button className="px-6 py-3 rounded-xl font-semibold bg-gray-800/50 hover:bg-gray-800 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {analyticsData.map((item) => (
            <div
              key={item.metric}
              className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 p-6 rounded-2xl hover:border-gray-700 hover:shadow-xl hover:shadow-[#00FFA3]/5 hover:-translate-y-1 transition-all"
            >
              <p className="text-sm text-gray-500 mb-2">{item.metric}</p>
              <p className="text-3xl font-bold mb-2">{item.value}</p>
              <span className={`text-sm font-semibold flex items-center gap-1 ${item.up ? 'text-green-400' : 'text-red-400'}`}>
                <TrendingUp className={`w-4 h-4 ${!item.up && 'rotate-180'}`} />
                {item.change}
              </span>
            </div>
          ))}
        </div>

        {/* Performance + Hours */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 p-6 rounded-2xl">
            <h2 className="text-lg font-semibold mb-4">Campaign Performance</h2>
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">{campaign.name}</span>
                    <span className="text-sm font-semibold">{campaign.clicks} clicks</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF]"
                      style={{ width: `${campaign.performance}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 p-6 rounded-2xl">
            <h2 className="text-lg font-semibold mb-4">Top Performing Hours</h2>
            <div className="space-y-3">
              {['12:00 PM - 1:00 PM', '6:00 PM - 7:00 PM', '8:00 AM - 9:00 AM', '9:00 PM - 10:00 PM'].map((time, idx) => (
                <div key={time} className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-xl">
                  <span className="text-sm">{time}</span>
                  <span className="text-sm font-semibold text-[#00FFA3]">
                    {(100 - idx * 15).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Trends Chart */}
        <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 p-6 rounded-2xl mb-6">
          <h2 className="text-lg font-semibold mb-6">Performance Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid #2a2a2a',
                  borderRadius: '8px',
                  color: '#e5e7eb'
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                iconType="line"
              />
              <Line 
                type="monotone" 
                dataKey="impressions" 
                stroke="#00FFA3" 
                strokeWidth={2}
                dot={{ fill: '#00FFA3', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="clicks" 
                stroke="#DC1FFF" 
                strokeWidth={2}
                dot={{ fill: '#DC1FFF', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="conversions" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
};

export default Analytics;