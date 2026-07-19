'use client';

import React from 'react';
import { Package, ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';
import { Product } from '@/types/product';
import { getWarrantyStatus } from '@/utils/hash';

interface StatsCardsProps {
  products: Product[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ products }) => {
  const activeProducts = products.filter((p) => !p.isDeleted);
  const totalCount = activeProducts.length;

  let activeWarrantyCount = 0;
  let expiringSoonCount = 0;
  let expiredCount = 0;

  activeProducts.forEach((p) => {
    const status = getWarrantyStatus(p.warrantyExpiry);
    if (status === 'active') activeWarrantyCount++;
    else if (status === 'expiring') expiringSoonCount++;
    else if (status === 'expired') expiredCount++;
  });

  const STATS = [
    {
      title: 'Total Products',
      value: totalCount,
      icon: Package,
      color: 'text-white',
      borderColor: 'border-border',
      bgIcon: 'bg-zinc-900',
    },
    {
      title: 'Active Warranty',
      value: activeWarrantyCount,
      icon: ShieldCheck,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      bgIcon: 'bg-emerald-500/10 text-emerald-400',
    },
    {
      title: 'Expiring Soon (30d)',
      value: expiringSoonCount,
      icon: AlertTriangle,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      bgIcon: 'bg-amber-500/10 text-amber-400',
    },
    {
      title: 'Expired Warranty',
      value: expiredCount,
      icon: AlertCircle,
      color: 'text-rose-400',
      borderColor: 'border-rose-500/30',
      bgIcon: 'bg-rose-500/10 text-rose-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`rounded-2xl bg-card border ${stat.borderColor} p-5 flex items-center justify-between shadow-sm hover:border-monad-purple/40 transition-all`}
          >
            <div>
              <p className="text-xs font-medium text-zinc-400">{stat.title}</p>
              <h4 className={`text-2xl font-extrabold ${stat.color} mt-1`}>{stat.value}</h4>
            </div>

            <div className={`h-11 w-11 rounded-xl flex items-center justify-center border border-border ${stat.bgIcon}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
