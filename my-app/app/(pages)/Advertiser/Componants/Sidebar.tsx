'use client'

import { useRouter } from 'next/navigation';
import { LayoutDashboard, Target, Wallet, BarChart3, Settings, TrendingUp } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
}

const Sidebar = ({ activeTab }: SidebarProps) => {
  const router = useRouter();
  
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, route: '/' },
    { name: 'Campaigns', icon: Target, route: '/campaigns' },
    { name: 'Wallet', icon: Wallet, route: '/wallet' },
    { name: 'Analytics', icon: BarChart3, route: '/analytics' },
    { name: 'Settings', icon: Settings, route: '/settings' },
  ];

  const handleNavigation = ( route: string) => {
    router.push(route);
  };

  return (
    <aside className="w-64 bg-[#0f0f0f]/80 backdrop-blur-xl   border-r border-gray-800/50 flex flex-col">
      <div className="p-6 border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00FFA3] to-[#DC1FFF] flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] bg-clip-text text-transparent">
            Advertiser
          </span>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;
          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.name, item.route)}
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

      <div className="p-4 m-4 rounded-xl bg-gradient-to-br from-[#00FFA3]/10 to-[#DC1FFF]/10 border border-gray-800/50">
        <p className="text-xs text-gray-400 mb-2">Need help?</p>
        <button 
          onClick={() => router.push('/documentation')}
          className="text-sm text-[#00FFA3] hover:text-[#00FFA3]/80 transition-colors"
        >
          View Documentation →
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;