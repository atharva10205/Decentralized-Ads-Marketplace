'use client'

import { Plus, BarChart3, Code, Copy, Edit, LinkIcon, Trash2 } from 'lucide-react';
import Sidebar from '../sidebar/sidebar';

const Settings = () => {
    const activeTab = 'Settings';

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
                            <h1 className="text-3xl font-bold mb-1 bg-white bg-clip-text text-transparent">Websites</h1>
                            <p className="text-gray-500">Manage your publishing properties</p>
                        </div>
                        <button className="group relative px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] text-black overflow-hidden hover:shadow-2xl hover:shadow-[#00FFA3]/20 active:scale-95 transition-all duration-300">
                            <span className="relative z-10 flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                Add Website
                            </span>
                        </button>
                    </div>

                    <div className="grid gap-6">
                        {websites.map((site, idx) => (
                            <div key={site.name} className="group bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 rounded-2xl overflow-hidden hover:border-gray-700 hover:shadow-xl hover:shadow-[#00FFA3]/5 transition-all duration-300">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-semibold group-hover:text-[#00FFA3] transition-colors">{site.name}</h3>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${site.status === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${site.status === 'Active' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
                                                    {site.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                                <LinkIcon className="w-4 h-4" />
                                                {site.url}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors" title="Get Code">
                                                <Code className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors" title="Edit">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors" title="View Stats">
                                                <BarChart3 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors" title="Remove">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                                        <div className="bg-[#0a0a0a] p-4 rounded-xl">
                                            <p className="text-xs text-gray-500 mb-1">Impressions</p>
                                            <p className="text-lg font-semibold">{site.impressions.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-[#0a0a0a] p-4 rounded-xl">
                                            <p className="text-xs text-gray-500 mb-1">Clicks</p>
                                            <p className="text-lg font-semibold">{site.clicks.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-[#0a0a0a] p-4 rounded-xl">
                                            <p className="text-xs text-gray-500 mb-1">CTR</p>
                                            <p className="text-lg font-semibold">{site.ctr}%</p>
                                        </div>
                                        <div className="bg-[#0a0a0a] p-4 rounded-xl">
                                            <p className="text-xs text-gray-500 mb-1">Earnings</p>
                                            <p className="text-lg font-semibold text-[#00FFA3]">{site.earnings}</p>
                                        </div>
                                        <div className="bg-[#0a0a0a] p-4 rounded-xl">
                                            <p className="text-xs text-gray-500 mb-1">RPM</p>
                                            <p className="text-lg font-semibold">0.026 SOL</p>
                                        </div>
                                    </div>

                                    <div className="bg-[#0a0a0a] p-4 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-500">Ad Code Integration</span>
                                            <button className="text-xs text-[#00FFA3] hover:text-[#00FFA3]/80 transition-colors flex items-center gap-1">
                                                <Copy className="w-3 h-3" />
                                                Copy Code
                                            </button>
                                        </div>
                                        <code className="text-xs text-gray-400 font-mono">
                                            &lt;script src="https://ads.network/pub/{Math.random().toString(36).substr(2, 9)}"&gt;&lt;/script&gt;
                                        </code>
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

export default Settings;