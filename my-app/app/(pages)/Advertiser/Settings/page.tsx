'use client';

import { User, RefreshCw, Target, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import Sidebar from '../Componants/Sidebar';

const Settings = () => {
  const activeTab = 'Settings';
  const [currentRole, setCurrentRole] = useState<'advertiser' | 'publisher'>('advertiser');
  const [isSwitching, setIsSwitching] = useState(false);

  const handleRoleSwitch = async (newRole: 'advertiser' | 'publisher') => {
    if (newRole === currentRole) return;
    
    setIsSwitching(true);
    
    try {
      const res = await fetch("/api/crud/role_update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        setCurrentRole(newRole);
      }
    } catch (error) {
      console.error('Failed to switch role:', error);
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0b0b0b] to-[#0d0d0d] text-gray-200">
      <Sidebar activeTab={activeTab} />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-1">Settings</h1>
          <p className="text-gray-500">Manage your account and preferences</p>
        </div>

        <div className="grid gap-6">
          <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800/50 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#00FFA3]/10 to-[#DC1FFF]/10">
                <RefreshCw className="w-5 h-5 text-[#00FFA3]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Account Role</h2>
                <p className="text-sm text-gray-500">Switch between Advertiser and Publisher</p>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleRoleSwitch('advertiser')}
                  disabled={isSwitching}
                  className={`group relative p-6 rounded-xl border-2 transition-all duration-300 ${
                    currentRole === 'advertiser'
                      ? 'border-[#00FFA3] bg-gradient-to-br from-[#00FFA3]/10 to-[#DC1FFF]/5'
                      : 'border-gray-800 bg-[#0a0a0a] hover:border-gray-700'
                  } ${isSwitching ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {currentRole === 'advertiser' && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 rounded-full bg-[#00FFA3] flex items-center justify-center">
                        <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl transition-all duration-300 ${
                      currentRole === 'advertiser'
                        ? 'bg-gradient-to-br from-[#00FFA3]/20 to-[#DC1FFF]/20'
                        : 'bg-gradient-to-br from-[#00FFA3]/10 to-[#DC1FFF]/10'
                    }`}>
                      <Target className="w-6 h-6 text-[#00FFA3]" />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <h3 className="text-xl font-semibold mb-2">Advertiser</h3>
                      <p className="text-sm text-gray-400">
                        Create ads, set budgets, and track campaign performance
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSwitch('publisher')}
                  disabled={isSwitching}
                  className={`group relative p-6 rounded-xl border-2 transition-all duration-300 ${
                    currentRole === 'publisher'
                      ? 'border-[#DC1FFF] bg-gradient-to-br from-[#DC1FFF]/10 to-[#00FFA3]/5'
                      : 'border-gray-800 bg-[#0a0a0a] hover:border-gray-700'
                  } ${isSwitching ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {currentRole === 'publisher' && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 rounded-full bg-[#DC1FFF] flex items-center justify-center">
                        <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl transition-all duration-300 ${
                      currentRole === 'publisher'
                        ? 'bg-gradient-to-br from-[#DC1FFF]/20 to-[#00FFA3]/20'
                        : 'bg-gradient-to-br from-[#DC1FFF]/10 to-[#00FFA3]/10'
                    }`}>
                      <TrendingUp className="w-6 h-6 text-[#DC1FFF]" />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <h3 className="text-xl font-semibold mb-2">Publisher</h3>
                      <p className="text-sm text-gray-400">
                        Display ads on your site and earn revenue from clicks
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {isSwitching && (
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400">
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-[#00FFA3] rounded-full animate-spin" />
                  <span>Switching role...</span>
                </div>
              )}

              <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-[#00FFA3]/5 to-[#DC1FFF]/5 border border-gray-800/50">
                <p className="text-sm text-gray-400">
                  💡 <span className="font-semibold text-gray-300">Note:</span> Switching roles will redirect you to the appropriate dashboard. Your data will be preserved.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800/50 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#00FFA3]/10 to-[#DC1FFF]/10">
                <User className="w-5 h-5 text-[#00FFA3]" />
              </div>
              <h2 className="text-lg font-semibold">Profile Settings</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Display Name</label>
                <input
                  type="text"
                  defaultValue="Advertiser Pro"
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 focus:border-[#00FFA3] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Email Address</label>
                <input
                  type="email"
                  defaultValue="advertiser@example.com"
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 focus:border-[#00FFA3] focus:outline-none transition-colors"
                />
              </div>

              <button className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] text-black hover:shadow-xl hover:shadow-[#00FFA3]/20 transition-all duration-300 active:scale-95">
                Save Changes
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-red-900/40 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-red-900/40">
              <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
            </div>

            <div className="p-6">
              <button className="px-6 py-3 rounded-xl font-semibold bg-red-600/90 hover:bg-red-600 text-white transition-all duration-300 active:scale-95">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;