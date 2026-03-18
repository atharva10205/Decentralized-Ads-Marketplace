'use client'

import { BarChart3, Globe, LayoutDashboard, Settings, HelpCircle, Wallet, X } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SidebarProps {
  activeTab: string;
}
interface PublisherData {
  email: string;
  image: string | null;
  name: string;
  accent: string | null;
}

const Sidebar = ({ activeTab }: SidebarProps) => {
  const [publisherData, setPublisherData] = useState<PublisherData | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const [showBanner, setShowBanner] = useState(true);
  const ACCENT = publisherData?.accent ?? '#FFFFFF';
  const hAlpha = (op: number) => {
    const r = parseInt(ACCENT.slice(1, 3), 16);
    const g = parseInt(ACCENT.slice(3, 5), 16);
    const b = parseInt(ACCENT.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${op})`;
  };
  useEffect(() => {
    const data = async () => {
      const res = await fetch("/api/crud/Publisher/Sidebar");
      const result = await res.json();
      setPublisherData(result.data);
    };
    data();
  }, []);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/Publisher/Dashboard' },
    { name: 'Analytics', icon: BarChart3, path: '/Publisher/Analytics' },
    { name: 'Websites', icon: Globe, path: '/Publisher/Websites' },
    { name: 'Earnings', icon: Wallet, path: '/Publisher/Earnings' },
  ];

  const bottomNavItems = [
    { name: 'Settings', icon: Settings, path: '/Publisher/Settings' },
    { name: 'Help Center', icon: HelpCircle, path: '/Publisher/Help' },
  ];

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const NavBtn = ({ item }: { item: typeof navItems[0] }) => {
    const Icon = item.icon;
    const isActive = pathname === item.path || activeTab === item.name;

    return (
      <button
        key={item.name}
        onClick={() => router.push(item.path)}
        className="w-full cursor-pointer flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-150 text-sm font-medium"
        style={{
          background: isActive ? '#1c1c1c' : 'transparent',
          color: isActive ? '#ffffff' : '',
          border: '1px solid transparent',
          boxShadow: 'none',
        }}
        onMouseEnter={e => {
          if (!isActive) {
            e.currentTarget.style.border = `1px solid ${ACCENT}`;
            e.currentTarget.style.boxShadow = `0 0 10px ${hAlpha(0.12)}`;
            e.currentTarget.style.background = '#161616';
            e.currentTarget.style.color = '#e5e7eb';
          }
        }}
        onMouseLeave={e => {
          if (!isActive) {
            e.currentTarget.style.border = '1px solid transparent';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '';
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

      <div className="px-4 py-4 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center overflow-hidden flex-shrink-0">
            {publisherData?.image ? (
              <img src={publisherData.image} alt={publisherData.name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-sm font-semibold text-white leading-tight overflow-x-auto scrollbar-none whitespace-nowrap">
                {publisherData?.name ?? '—'}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <span className="text-sm font-semibold text-white block leading-tight truncate">
              {publisherData?.name ?? '—'}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full inline-block flex-shrink-0" style={{ background: ACCENT }} />
              <span className="text-[10px] text-gray-500 truncate">
                {publisherData?.email ?? '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-2 overflow-y-auto">
        {navItems.map((item) => <NavBtn key={item.name} item={item} />)}
      </nav>

      {showBanner && (
        <div className="mx-2 mb-2 p-3 bg-[#111] border border-[#1f1f1f] rounded-xl relative">
          <button
            onClick={() => setShowBanner(false)}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-400 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
          <span className="text-[10px] px-1.5 py-0.5 bg-[#162316] text-green-400 border border-green-900/40 rounded-md font-medium">New</span>
          <p className="text-xs font-semibold text-white mt-2 leading-snug">Partners affiliate program</p>
          <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">Run your own affiliate program with zero overhead</p>
          <button className="mt-2.5 text-[10px] text-gray-300 border border-[#252525] rounded-md px-2.5 py-1 hover:bg-[#1a1a1a] transition-colors flex items-center gap-1">
            Try it out
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </button>
        </div>
      )}

      {/* Bottom nav */}
      <div className="px-2 py-3 border-t border-[#1a1a1a] space-y-2">
        {bottomNavItems.map((item) => <NavBtn key={item.name} item={item} />)}
      </div>

    </aside>
  );
};

export default Sidebar;