'use client'

import { Globe, Eye, DollarSign, Plus } from 'lucide-react';
import Sidebar from '../sidebar/sidebar';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";



const Dashboard = () => {
    const activeTab = 'Dashboard';

    const router = useRouter();

    const { data: session, status } = useSession();

    if (session) {
        console.log("sesessionssion", session)
    }
    if (status) {
        console.log("status", status)
    }



    type DashboardData = {
        active_websites: number;
        totalImpressions: number;
        totalEarnings: number;
    }; 

    const [Data, setData] = useState<DashboardData | null>(null);

    type Website = {
        name: string;
        website_name: string;
        publisher_url: string;
        impressions: number;
        clicks: number;
        ctr: number;
        earnings: number;
        revenue: number;
    };

    const [websites, setWebsites] = useState<Website[]>([])


    useEffect(() => {

        // if (status === "authenticated" && session?.user?.role === "publisher") {
        const fetchData = async () => {
            const res = await fetch("/api/crud/Publisher/Dashboard");
            setData(await res.json());
        }

        const fetch_websites = async () => {
            const res = await fetch("/api/crud/Publisher/Websites");
            setWebsites(await res.json());
        }
        fetchData();
        fetch_websites();

        // }else{
        //     router.push("/Advertiser/Dashboard")
        // }

    }, [])



    if (!Data) {
        return (
            <div className="flex h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0b0b0b] to-[#0d0d0d] text-gray-200">
                <Sidebar activeTab={activeTab} />
                <main className="flex-1 p-8 overflow-auto">
                    <div className="max-w-6xl">
                        <div className="animate-pulse space-y-8">
                            <div className="h-8 bg-gray-800 rounded w-48"></div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-32 bg-gray-800 rounded-2xl"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const stats = [
        { label: 'Active Websites', value: Data.active_websites, icon: Globe },
        { label: 'Total Impressions', value: Data.totalImpressions, icon: Eye, },
        { label: 'Total Earnings', value: `${Data.totalEarnings} SOL`, icon: DollarSign },
    ];



    return (
        <div className="flex h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0b0b0b] to-[#0d0d0d] text-gray-200">
            <Sidebar activeTab={activeTab} />

            <main className="flex-1 p-8 overflow-auto">
                <div className="max-w-6xl">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h1 className="text-3xl font-bold mb-1 bg-white bg-clip-text text-transparent">Dashboard</h1>
                            <p className="text-gray-500">Track your publishing performance and earnings</p>
                        </div>
                        <button
                            onClick={() => { router.push("/Publisher-campaign") }}
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

                                        </div>
                                        <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                                        <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{stat.value} </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className=" mb-6">


                        <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 p-6 rounded-2xl">
                            <h2 className="text-lg font-semibold mb-1">Earnings Breakdown</h2>
                            <p className="text-sm text-gray-500 mb-6">Revenue by website</p>
                            <div className="space-y-4">
                                {websites.map((site, index) => (
                                    <div key={`earnings-${site.name}-${index}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-400">{site.website_name}</span>
                                            <span className="text-sm font-semibold text-[#00FFA3]">
                                                {site.earnings.toFixed(4)} SOL
                                            </span>
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
                                    {websites.map((site, index) => (
                                        <tr key={`website-${site.name}-${index}`} className="border-t border-gray-800/50 hover:bg-[#161616]/50 transition-colors duration-200 cursor-pointer group">
                                            <td className="p-4">
                                                <div>
                                                    <p className="font-medium group-hover:text-[#00FFA3] transition-colors">{site.website_name}</p>
                                                    <p className="text-sm text-gray-500">{site.publisher_url}</p>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-400">{site.impressions.toLocaleString()}</td>
                                            <td className="p-4 text-gray-400">{site.clicks.toLocaleString()}</td>
                                            <td className="p-4 text-gray-400">
                                                {site.impressions > 0
                                                    ? ((site.clicks / site.impressions) * 100).toFixed(2)
                                                    : '0.00'}%
                                            </td>
                                            <td className="p-4 font-semibold text-[#00FFA3]">
                                                {site.earnings.toFixed(4)} SOL
                                            </td>
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


