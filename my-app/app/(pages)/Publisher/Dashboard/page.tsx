'use client'

import { Globe, TrendingUp, Eye, DollarSign, Plus } from 'lucide-react';
import Sidebar from '../sidebar/sidebar';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
    const activeTab = 'Dashboard';
    const router = useRouter();

    const stats = [
        { label: 'Active Websites', value: '5', icon: Globe, trend: '+2', trendUp: true },
        { label: 'Total Impressions', value: '127.5K', icon: Eye, trend: '+18.3%', trendUp: true },
        { label: 'Total Earnings', value: '3.24 SOL', icon: DollarSign, trend: '+12.7%', trendUp: true },
    ];

    const websites = [
        { name: 'TechBlog.io', url: 'techblog.io', impressions: 45200, clicks: 1240, ctr: 2.74, earnings: '1.2 SOL', status: 'Active', revenue: 85 },
        { name: 'CryptoNews Daily', url: 'cryptonews.daily', impressions: 38500, clicks: 980, ctr: 2.54, earnings: '0.95 SOL', status: 'Active', revenue: 78 },
        { name: 'DevTutorials', url: 'devtutorials.com', impressions: 28300, clicks: 720, ctr: 2.54, earnings: '0.68 SOL', status: 'Active', revenue: 72 },
        { name: 'StartupHub', url: 'startuphub.io', impressions: 15500, clicks: 410, ctr: 2.65, earnings: '0.41 SOL', status: 'Review', revenue: 45 },
    ];

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0b0b0b] to-[#0d0d0d] text-gray-200">
            <Sidebar activeTab={activeTab} />

            <main className="flex-1 p-8 overflow-auto">
                <div className="max-w-6xl">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h1 className="text-3xl font-bold mb-1 bg-white bg-clip-text text-transparent">Dashboard</h1>
                            <p className="text-gray-500">Track your publishing performance and earnings</p>
                        </div>
                        <button 
                        onClick={()=>{router.push("/Publisher-campaign")}}
                        className="group cursor-pointer relative px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] text-black overflow-hidden hover:shadow-2xl hover:shadow-[#00FFA3]/20 active:scale-95 transition-all duration-1000">
                            <span className="relative z-10 flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                Add Website
                            </span>
                            <div className="" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {stats.map((stat, idx) => {
                            const Icon = stat.icon;
                            return (
                                <div key={stat.label} className="group relative bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 p-6 rounded-2xl hover:border-gray-700 hover:shadow-xl hover:shadow-[#00FFA3]/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
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
                                        <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{stat.value}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 p-6 rounded-2xl">
                            <h2 className="text-lg font-semibold mb-1">Quick Stats</h2>
                            <p className="text-sm text-gray-500 mb-6">Last 7 days performance</p>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Page Views</span>
                                    <span className="text-xl font-semibold">127,543</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Unique Visitors</span>
                                    <span className="text-xl font-semibold">45,230</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Ad Clicks</span>
                                    <span className="text-xl font-semibold">3,350</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Avg. Session</span>
                                    <span className="text-xl font-semibold">3m 42s</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 p-6 rounded-2xl">
                            <h2 className="text-lg font-semibold mb-1">Earnings Breakdown</h2>
                            <p className="text-sm text-gray-500 mb-6">Revenue by website</p>
                            <div className="space-y-4">
                                {websites.slice(0, 4).map((site) => (
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
                    </div>

                    <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 rounded-2xl overflow-hidden shadow-xl">
                        <div className="p-6 border-b border-gray-800/50 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold mb-1">Top Performing Websites</h2>
                                <p className="text-sm text-gray-500">Your best earning properties</p>
                            </div>
                            <button className="text-sm text-[#00FFA3] hover:text-[#00FFA3]/80 transition-colors">View All →</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#0a0a0a] text-sm text-gray-500">
                                    <tr>
                                        <th className="text-left p-4 font-medium">Website</th>
                                        <th className="text-left p-4 font-medium">Impressions</th>
                                        <th className="text-left p-4 font-medium">Clicks</th>
                                        <th className="text-left p-4 font-medium">CTR</th>
                                        <th className="text-left p-4 font-medium">Earnings</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {websites.slice(0, 3).map((site) => (
                                        <tr key={site.name} className="border-t border-gray-800/50 hover:bg-[#161616]/50 transition-colors duration-200 cursor-pointer group">
                                            <td className="p-4">
                                                <div>
                                                    <p className="font-medium group-hover:text-[#00FFA3] transition-colors">{site.name}</p>
                                                    <p className="text-sm text-gray-500">{site.url}</p>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-400">{site.impressions.toLocaleString()}</td>
                                            <td className="p-4 text-gray-400">{site.clicks.toLocaleString()}</td>
                                            <td className="p-4 text-gray-400">{site.ctr}%</td>
                                            <td className="p-4 font-semibold text-[#00FFA3]">{site.earnings}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;