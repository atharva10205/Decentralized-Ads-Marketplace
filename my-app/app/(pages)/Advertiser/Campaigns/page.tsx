'use client'

import { Plus, Edit, Copy, Pause, Play, Trash2 } from 'lucide-react';
import Sidebar from '../Componants/Sidebar';
import { useEffect, useState } from 'react';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("/api/crud/Advertiser/Campaings");
        const data = await res.json();
        setCampaigns(data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0b0b0b] to-[#0d0d0d] text-gray-200">
      <Sidebar activeTab="Campaigns" />

      <main className="flex-1 p-8 overflow-auto">
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

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#00FFA3] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && campaigns.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <p className="text-lg mb-2">No campaigns found</p>
            <p className="text-sm">Create your first campaign to get started</p>
          </div>
        )}

        <div className="grid gap-6">
          {campaigns.map((campaign) => {
            const budget = campaign.Cost ?? 0;
            const spent = (campaign.clicks ?? 0) * (campaign.cost_per_click ?? 0);
            const percentUsed = budget > 0
              ? Math.min(Math.round((spent / budget) * 100), 100)
              : 0;

            const isActive = campaign.status === true || campaign.status === 'Active';

            return (
              <div
                key={campaign.id}
                className="group bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 rounded-2xl overflow-hidden hover:border-gray-700 hover:shadow-xl hover:shadow-[#00FFA3]/5 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold group-hover:text-[#00FFA3] transition-colors">
                          {campaign.business_name}
                        </h3>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${isActive
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                              : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                            }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-2 ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                              }`}
                          />
                          {isActive ? 'Active' : 'Paused'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        url : {campaign.destination_url}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
                        {isActive ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                      <button className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-[#0a0a0a] p-4 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">Budget</p>
                      <p className="text-lg font-semibold">{budget} SOL</p>
                    </div>
                    <div className="bg-[#0a0a0a] p-4 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">Spent</p>
                      <p className="text-lg font-semibold text-[#DC1FFF]">
                        {spent} SOL
                      </p>
                    </div>
                    <div className="bg-[#0a0a0a] p-4 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">Clicks</p>
                      <p className="text-lg font-semibold">{campaign.clicks ?? 0}</p>
                    </div>
                    <div className="bg-[#0a0a0a] p-4 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">CPC</p>
                      <p className="text-lg font-semibold">
                        {campaign.cost_per_click ?? '—'} SOL
                      </p>
                    </div>
                    <div className="bg-[#0a0a0a] p-4 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">Impressions</p>
                      <p className="text-lg font-semibold text-[#00FFA3]">
                        {campaign.impression ?? 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] transition-all duration-500"
                        style={{ width: `${percentUsed}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400 w-16 text-right">
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