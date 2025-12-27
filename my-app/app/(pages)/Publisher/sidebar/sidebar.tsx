'use client'

import { BarChart3, Globe, LayoutDashboard, Settings, Wallet } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface SidebarProps {
  activeTab: string;
}

const Sidebar = ({ activeTab }: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/Publisher/Dashboard' },
    { name: 'Websites', icon: Globe, path: '/Publisher/Websites' },
    { name: 'Earnings', icon: Wallet, path: '/Publisher/Earnings' },
    { name: 'Analytics', icon: BarChart3, path: '/Publisher/Analytics' },
    { name: 'Settings', icon: Settings, path: '/Publisher/Settings' },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <aside className="w-64 bg-[#0f0f0f]/80 backdrop-blur-xl border-r border-gray-800/50 flex flex-col">
      <div className="p-6 border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00FFA3] to-[#DC1FFF] flex items-center justify-center">
            <Globe className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] bg-clip-text text-transparent">
            Publisher
          </span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`w-full cursor-pointer flex items-center gap-4 px-4 py-3 rounded-xl
                transition-all duration-300 group relative overflow-hidden
                ${isActive
                  ? 'bg-gradient-to-r from-[#00FFA3]/20 to-[#DC1FFF]/20 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#00FFA3]/10 to-[#DC1FFF]/10 animate-pulse" />
              )}
              <Icon className={`w-5 h-5 relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="relative z-10 font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>

      
    </aside>
  );
};

export default Sidebar;