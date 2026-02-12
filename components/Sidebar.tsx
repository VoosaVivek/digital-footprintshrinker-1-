
import React from 'react';
import { 
  ShieldCheckIcon, 
  TrashIcon, 
  DocumentChartBarIcon, 
  BeakerIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Scan Dashboard', icon: ShieldCheckIcon },
    { id: 'cleanup', label: 'Privacy Cleanup', icon: TrashIcon },
    { id: 'reports', label: 'Audit Reports', icon: DocumentChartBarIcon },
    { id: 'ethics', label: 'Ethics & Safety', icon: ExclamationTriangleIcon },
  ];

  return (
    <div className="w-64 border-r border-zinc-800 flex flex-col h-full bg-zinc-950">
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <ShieldCheckIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight text-white">FOOTPRINT</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Shrinker v1.0</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
              activeTab === item.id 
                ? 'bg-zinc-800 text-white shadow-lg border border-zinc-700' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-indigo-400' : ''}`} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900/20 to-purple-900/10 border border-indigo-500/20">
          <p className="text-xs text-indigo-300 font-semibold mb-1">Local Only Engine</p>
          <p className="text-[10px] text-zinc-500 leading-relaxed">
            All operations are executed on your local machine. No data ever leaves this system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
