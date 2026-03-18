'use client'

import { useRouter } from 'next/navigation';
import { LayoutDashboard, Target, Wallet, BarChart3, Settings, HelpCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SidebarProps {
  activeTab: string;
}

interface SidebarData {
  email: string;
  image: string | null;
  name: string;
  accent: string;
}

const Sidebar = ({ activeTab }: SidebarProps) => {
  const router = useRouter();
  const [sidebarData, setSidebarData] = useState<SidebarData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res    = await fetch('/api/crud/Advertiser/Sidebar');
        const result = await res.json();
        setSidebarData(result.data);
      } catch (err) {
        console.error('Sidebar fetch error:', err);
      }
    };
    fetchData();
  }, []);

  const accent = sidebarData?.accent ?? '#ffffff';
  const hR     = parseInt(accent.slice(1, 3), 16);
  const hG     = parseInt(accent.slice(3, 5), 16);
  const hB     = parseInt(accent.slice(5, 7), 16);
  const hAlpha = (op: number) => `rgba(${hR},${hG},${hB},${op})`;

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, route: '/Advertiser/Dashboard' },
    { name: 'Campaigns', icon: Target,          route: '/Advertiser/Campaigns' },
    { name: 'Wallet',    icon: Wallet,           route: '/Advertiser/Wallet'    },
    { name: 'Analytics', icon: BarChart3,        route: '/Advertiser/Analytics' },
  ];

  const bottomNavItems = [
    { name: 'Settings',    icon: Settings,    route: '/Advertiser/Settings' },
    { name: 'Help Center', icon: HelpCircle,  route: '/Advertiser/Help'     },
  ];

  const NavBtn = ({ item }: { item: { name: string; icon: any; route: string } }) => {
    const Icon     = item.icon;
    const isActive = activeTab === item.name;

    return (
      <button
        onClick={() => router.push(item.route)}
        className="w-full cursor-pointer flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-150 text-sm font-medium"
        style={{
          background: isActive ? '#1c1c1c' : 'transparent',
          color:      isActive ? '#ffffff'  : '',
          border:     '1px solid transparent',
        }}
        onMouseEnter={e => {
          if (!isActive) {
            e.currentTarget.style.border     = `1px solid ${accent}`;
            e.currentTarget.style.boxShadow  = `0 0 10px ${hAlpha(0.12)}`;
            e.currentTarget.style.background = '#161616';
            e.currentTarget.style.color      = '#e5e7eb';
          }
        }}
        onMouseLeave={e => {
          if (!isActive) {
            e.currentTarget.style.border     = '1px solid transparent';
            e.currentTarget.style.boxShadow  = 'none';
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color      = '';
          }
        }}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span>{item.name}</span>
      </button>
    );
  };

  return (
    <aside className="w-56 bg-[#0c0c0c] border-r border-[#1f1f1f] flex flex-col flex-shrink-0">

      {/* Header */}
      <div className="px-4 py-4 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center overflow-hidden flex-shrink-0">
            {sidebarData?.image ? (
              <img src={sidebarData.image} alt={sidebarData.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-gray-300">
                {sidebarData?.name ? getInitials(sidebarData.name) : '#'}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <span className="text-sm font-semibold text-white block leading-tight truncate">
              {sidebarData?.name ?? '—'}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full inline-block flex-shrink-0" style={{ background: accent }} />
              <span className="text-[10px] text-gray-500 truncate">
                {sidebarData?.email ?? '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-2 py-3 space-y-2 overflow-y-auto">
        {navItems.map(item => <NavBtn key={item.name} item={item} />)}
      </nav>

      {/* Bottom nav */}
      <div className="px-2 py-3 border-t border-[#1a1a1a] space-y-1">
        {bottomNavItems.map(item => <NavBtn key={item.name} item={item} />)}
      </div>

    </aside>
  );
};

export default Sidebar;