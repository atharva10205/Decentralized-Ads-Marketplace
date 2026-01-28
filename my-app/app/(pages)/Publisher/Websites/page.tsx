'use client'

import { Plus, BarChart3, Code, Copy, Edit, Link, Trash2, RefreshCw } from 'lucide-react';
import Sidebar from '../sidebar/sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


const Websites = () => {
    const activeTab = 'Websites';
    const router = useRouter();
    const [websites, setWebsites] = useState([]);

    useEffect(() => {
        const Get_websites = async () => {
            try {
                const res = await fetch("/api/crud/Publisher/Websites");
                const data = await res.json();

                const websitesWithMetrics = data.map(site => ({
                    ...site,
                    ctr: site.impressions > 0
                        ? ((site.clicks / site.impressions) * 100).toFixed(2)
                        : '0.00',
                    formattedEarnings: site.earnings 
                        ? `${Number(site.earnings).toFixed(4)} SOL`
                        : '$0.0000',
                    rpm: site.impressions > 0
                        ? ((site.earnings / site.impressions) * 1000).toFixed(4)
                        : '0.0000'
                }));

                setWebsites(websitesWithMetrics);
                console.log("mergedData", websitesWithMetrics);
            } catch (error) {
                console.error("Error fetching websites:", error);
            }
        };

        Get_websites();
    }, []);

    return (
        <div className="flex h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0b0b0b] to-[#0d0d0d] text-gray-200">
            <Sidebar activeTab={activeTab} />

            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h1 className="text-3xl font-bold mb-1 bg-white bg-clip-text text-transparent">Websites</h1>
                            <p className="text-gray-500">Manage your publishing properties</p>
                        </div>
                        <button className="group relative px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] text-black overflow-hidden hover:shadow-2xl hover:shadow-[#00FFA3]/20 active:scale-95 transition-all duration-300">
                            <span
                                onClick={() => { router.push("/Publisher-campaign") }}
                                className="relative cursor-pointer z-10 flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                Add Website
                            </span>
                        </button>
                    </div>

                    <div className="grid gap-6">
                        {websites.length === 0 ? (
                            <div className="text-center text-gray-500 py-10">No websites Found</div>
                        ) : (
                            websites.map((site, idx) => (
                                <div key={site.website_name} className="group bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 rounded-2xl overflow-hidden hover:border-gray-700 hover:shadow-xl hover:shadow-[#00FFA3]/5 transition-all duration-300">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-semibold group-hover:text-[#00FFA3] transition-colors">{site.website_name}</h3>
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${site.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${site.status === 'ACTIVE' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
                                                        {site.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                                    <Link className="w-4 h-4" />
                                                    {site.publisher_url}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                {site.status !== 'REVIEW' && (
                                                    <>
                                                        <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors" title="Get Code">
                                                            <Code className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors" title="Edit">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors" title="View Stats">
                                                            <BarChart3 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                {site.status === 'REVIEW' && (
                                                    <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors" title="Refresh">
                                                        <RefreshCw className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors" title="Remove">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                                            <div className="bg-[#0a0a0a] p-4 rounded-xl">
                                                <p className="text-xs text-gray-500 mb-1">Impressions</p>
                                                <p className="text-lg font-semibold">{site.status === 'REVIEW' ? 0 : site.impressions.toLocaleString()}</p>
                                            </div>
                                            <div className="bg-[#0a0a0a] p-4 rounded-xl">
                                                <p className="text-xs text-gray-500 mb-1">Clicks</p>
                                                <p className="text-lg font-semibold">{site.status === 'REVIEW' ? 0 : site.clicks.toLocaleString()}</p>
                                            </div>
                                            <div className="bg-[#0a0a0a] p-4 rounded-xl">
                                                <p className="text-xs text-gray-500 mb-1">CTR</p>
                                                <p className="text-lg font-semibold">{site.status === 'REVIEW' ? '0%' : `${site.ctr}%`}</p>
                                            </div>
                                            <div className="bg-[#0a0a0a] p-4 rounded-xl">
                                                <p className="text-xs text-gray-500 mb-1">Earnings</p>
                                                <p className="text-lg font-semibold text-[#00FFA3]">
                                                    {site.status === 'REVIEW' ? '0.0000 SOL' : site.formattedEarnings }
                                                </p>
                                            </div>
                                            <div className="bg-[#0a0a0a] p-4 rounded-xl">
                                                <p className="text-xs text-gray-500 mb-1">RPM</p>
                                                <p className="text-lg font-semibold">
                                                    {site.status === 'REVIEW' ? '0.0000 SOL' : `${site.rpm} SOL`}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm mb-4 text-gray-500">Ad Code Integration</span>
                                            <button
                                                onClick={() => {
                                                    const code = `<div id="my-widget"></div>\n<script src="http://localhost:3000/my-widget.js" data-id="${site.publisher_url}"></script>`;
                                                    navigator.clipboard.writeText(code);
                                                }}
                                                className="text-xs cursor-pointer text-[#00FFA3] hover:text-[#00FFA3]/80 transition-colors flex items-center gap-1"
                                            >
                                                <Copy className="w-3 h-3 cursor-pointer" />
                                                Copy Code
                                            </button>
                                        </div>
                                        <div className='flex rounded-xl p-5 border border-gray-800 flex-col gap-1'>
                                            <code className="text-xs text-gray-400 font-mono">
                                                &lt;div id="my-widget"&gt;&lt;/div&gt;&#10;
                                            </code>
                                            <code className="text-xs text-gray-400 font-mono">
                                                &lt;script src="http://localhost:3000/my-widget.js" data-id="{site.publisher_url}"&gt;&lt;/script&gt;
                                            </code>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Websites;