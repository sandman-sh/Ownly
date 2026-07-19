'use client';

import React from 'react';
import { useAccount } from 'wagmi';
import { LayoutDashboard, Package, Wrench, ShieldCheck, Settings, Plus, Sparkles } from 'lucide-react';
import { formatAddress } from '@/utils/hash';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onOpenAddModal }) => {
  const { address, isConnected } = useAccount();

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'service', label: 'Service History', icon: Wrench },
    { id: 'verify', label: 'Verify Integrity', icon: ShieldCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-full md:w-64 bg-card border-b md:border-b-0 md:border-r border-border p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* User / Wallet Greeting Card */}
        <div className="rounded-xl bg-zinc-950/80 border border-border p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Connected Wallet
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="flex items-center space-x-2.5">
            <div className="h-7 w-7 rounded-lg bg-monad-purple/20 border border-monad-purple/40 flex items-center justify-center font-bold text-xs text-monad-purple">
              {isConnected && address ? address.substring(2, 4).toUpperCase() : '0x'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-mono font-bold text-white truncate">
                {isConnected && address ? formatAddress(address) : '0x836E...6EF9'}
              </p>
              <p className="text-[10px] text-monad-purple font-medium">Monad Testnet (10143)</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onOpenAddModal}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-monad-purple to-monad-darkPurple hover:from-monad-light hover:to-monad-purple text-white text-xs font-bold shadow-md shadow-monad-glow transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          + Add Document
        </button>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-monad-purple/15 text-white border border-monad-purple/40 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-monad-purple' : 'text-zinc-500'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer info in sidebar */}
      <div className="pt-4 border-t border-border/50 text-[11px] text-zinc-500 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-monad-purple" /> Ownly v1.0
        </span>
        <span className="text-zinc-600">Monad SDK</span>
      </div>
    </aside>
  );
};
