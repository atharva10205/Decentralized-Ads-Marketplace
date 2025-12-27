'use client'

import { Download, TrendingUp } from 'lucide-react';
import Sidebar from '../sidebar/sidebar';

const Analytics = () => {
    const activeTab = 'Analytics';

    const websites = [
        { name: 'TechBlog.io', url: 'techblog.io', impressions: 45200, clicks: 1240, ctr: 2.74, earnings: '1.2 SOL', status: 'Active', revenue: 85 },
        { name: 'CryptoNews Daily', url: 'cryptonews.daily', impressions: 38500, clicks: 980, ctr: 2.54, earnings: '0.95 SOL', status: 'Active', revenue: 78 },
        { name: 'DevTutorials', url: 'devtutorials.com', impressions: 28300, clicks: 720, ctr: 2.54, earnings: '0.68 SOL', status: 'Active', revenue: 72 },
        { name: 'StartupHub', url: 'startuphub.io', impressions: 15500, clicks: 410, ctr: 2.65, earnings: '0.41 SOL', status: 'Review', revenue: 45 },
    ];

    const analyticsData = [
        { metric: 'Avg. CTR', value: '2.64%', change: '+0.3%', up: true },
        { metric: 'Revenue per 1K', value: '0.025 SOL', change: '+5.2%', up: true },
        { metric: 'Active Ad Units', value: '18', change: '+3', up: true },
        { metric: 'Fill Rate', value: '94.2%', change: '+2.1%', up: true },
    ];

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0b0b0b] to-[#0d0d0d] text-gray-200">
            <Sidebar activeTab={activeTab} />

            <main className="flex-1 p-8 overflow-auto">
                <div className="max-w-6xl">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h1 className="text-3xl font-bold mb-1 bg-white bg-clip-text text-transparent">Analytics</h1>
                            <p className="text-gray-500">Detailed performance insights</p>
                        </div>
                        <button className="px-6 py-3 rounded-xl font-semibold bg-gray-800/50 hover:bg-gray-800 transition-colors flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export Report
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {analyticsData.map((item, idx) => (
                            <div key={item.metric} className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 p-6 rounded-2xl hover:border-gray-700 hover:shadow-xl hover:shadow-[#00FFA3]/5 hover:-translate-y-1 transition-all duration-300">
                                <p className="text-sm text-gray-500 mb-2">{item.metric}</p>
                                <p className="text-3xl font-bold mb-2">{item.value}</p>
                                <span className={`text-sm font-semibold flex items-center gap-1 ${item.up ? 'text-green-400' : 'text-red-400'}`}>
                                    <TrendingUp className={`w-4 h-4 ${!item.up && 'rotate-180'}`} />
                                    {item.change}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 p-6 rounded-2xl">
                            <h2 className="text-lg font-semibold mb-4">Revenue by Website</h2>
                            <div className="space-y-4">
                                {websites.map((site) => (
                                    <div key={site.name}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-400">{site.name}</span>
                                            <span className="text-sm font-semibold text-[#00FFA3]">{site.earnings}</span>
                                        </div>
                                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] rounded-full" style={{ width: `${site.revenue}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 p-6 rounded-2xl">
                            <h2 className="text-lg font-semibold mb-4">Traffic Sources</h2>
                            <div className="space-y-3">
                                {[
                                    { source: 'Direct', percentage: 45, value: '57.3K' },
                                    { source: 'Search Engines', percentage: 32, value: '40.8K' },
                                    { source: 'Social Media', percentage: 15, value: '19.1K' },
                                    { source: 'Referrals', percentage: 8, value: '10.2K' },
                                ].map((item) => (
                                    <div key={item.source} className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-xl">
                                        <div className="flex items-center gap-3 flex-1">
                                            <span className="text-sm">{item.source}</span>
                                            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] rounded-full" style={{ width: `${item.percentage}%` }} />
                                            </div>
                                        </div>
                                        <span className="text-sm font-semibold text-[#00FFA3] ml-3">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analytics;