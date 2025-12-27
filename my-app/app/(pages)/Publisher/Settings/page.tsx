'use client'

import { Plus, BarChart3, Code, Copy, Edit, LinkIcon, Trash2, Bell, Shield, User, Wallet } from 'lucide-react';
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
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold mb-1 bg-white bg-clip-text text-transparent">Settings</h1>
                        <p className="text-gray-500">Manage your publisher account</p>
                    </div>

                    <div className="grid gap-6">
                        <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-gray-800/50 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-[#00FFA3]/10 to-[#DC1FFF]/10">
                                    <User className="w-5 h-5 text-[#00FFA3]" />
                                </div>
                                <h2 className="text-lg font-semibold">Profile Settings</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Publisher Name</label>
                                    <input type="text" defaultValue="Publisher Pro" className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 focus:border-[#00FFA3] focus:outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Email Address</label>
                                    <input type="email" defaultValue="publisher@example.com" className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 focus:border-[#00FFA3] focus:outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Company/Organization</label>
                                    <input type="text" defaultValue="Digital Media Co." className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 focus:border-[#00FFA3] focus:outline-none transition-colors" />
                                </div>
                                <button className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] text-black hover:shadow-xl hover:shadow-[#00FFA3]/20 active:scale-95 transition-all duration-300">
                                    Save Changes
                                </button>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-gray-800/50 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-[#00FFA3]/10 to-[#DC1FFF]/10">
                                    <Wallet className="w-5 h-5 text-[#00FFA3]" />
                                </div>
                                <h2 className="text-lg font-semibold">Payment Settings</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Payout Wallet Address</label>
                                    <div className="flex gap-3">
                                        <input type="text" defaultValue="7xKj9mN3pL5vR8qT2wE4nM6kP9sL3vR8qT2" className="flex-1 bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 font-mono text-sm focus:border-[#00FFA3] focus:outline-none transition-colors" />
                                        <button className="px-4 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors">
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Minimum Payout</label>
                                    <select className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 focus:border-[#00FFA3] focus:outline-none transition-colors">
                                        <option>1 SOL</option>
                                        <option>2 SOL</option>
                                        <option>5 SOL</option>
                                        <option>10 SOL</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Payout Frequency</label>
                                    <select className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 focus:border-[#00FFA3] focus:outline-none transition-colors">
                                        <option>Weekly</option>
                                        <option>Bi-weekly</option>
                                        <option>Monthly</option>
                                    </select>
                                </div>
                                <button className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] text-black hover:shadow-xl hover:shadow-[#00FFA3]/20 active:scale-95 transition-all duration-300">
                                    Update Payment Info
                                </button>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-gray-800/50 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-[#00FFA3]/10 to-[#DC1FFF]/10">
                                    <Bell className="w-5 h-5 text-[#00FFA3]" />
                                </div>
                                <h2 className="text-lg font-semibold">Notifications</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                {[
                                    { label: 'Weekly performance reports', checked: true },
                                    { label: 'Payment confirmations', checked: true },
                                    { label: 'Website approval updates', checked: true },
                                    { label: 'Revenue milestones', checked: false },
                                    { label: 'Platform announcements', checked: true },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-xl">
                                        <span>{item.label}</span>
                                        <button className={`w-12 h-6 rounded-full transition-colors ${item.checked ? 'bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF]' : 'bg-gray-700'} relative`}>
                                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${item.checked ? 'right-0.5' : 'left-0.5'}`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-gray-800/50 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-[#00FFA3]/10 to-[#DC1FFF]/10">
                                    <Shield className="w-5 h-5 text-[#00FFA3]" />
                                </div>
                                <h2 className="text-lg font-semibold">Security</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-xl">
                                    <div>
                                        <p className="font-medium mb-1">Two-Factor Authentication</p>
                                        <p className="text-sm text-gray-500">Add an extra layer of security</p>
                                    </div>
                                    <button className="w-12 h-6 rounded-full bg-gray-700 relative">
                                        <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-xl">
                                    <div>
                                        <p className="font-medium mb-1">Login Alerts</p>
                                        <p className="text-sm text-gray-500">Get notified of new logins</p>
                                    </div>
                                    <button className="w-12 h-6 rounded-full bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] relative">
                                        <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5" />
                                    </button>
                                </div>
                                <button className="w-full px-6 py-3 rounded-xl font-semibold bg-gray-800/50 hover:bg-gray-800 transition-colors">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;