'use client';

import React from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { ProductFilterStatus, ProductSortOption } from '@/types/product';

interface SearchFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: ProductFilterStatus;
  setStatusFilter: (status: ProductFilterStatus) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  sortBy: ProductSortOption;
  setSortBy: (sort: ProductSortOption) => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  sortBy,
  setSortBy,
}) => {
  return (
    <div className="rounded-2xl bg-card border border-border p-4 space-y-4 shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ID, document name, store, or serial..."
            className="w-full rounded-xl bg-zinc-950 border border-border pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-monad-purple"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1 rounded-xl bg-zinc-950 p-1 border border-border w-full md:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Vault Items' },
            { id: 'active', label: 'Active Warranty / Valid' },
            { id: 'expiring', label: 'Expiring Soon' },
            { id: 'expired', label: 'Expired' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as ProductFilterStatus)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-monad-purple text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="flex items-center space-x-1.5 text-xs text-zinc-400 shrink-0">
            <ArrowUpDown className="h-3.5 w-3.5 text-monad-purple" />
            <span>Sort:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as ProductSortOption)}
            className="rounded-xl bg-zinc-950 border border-border px-3 py-2 text-xs text-white focus:outline-none focus:border-monad-purple"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="warrantySoon">Ending Soon</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pt-2 border-t border-border/40">
        <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider shrink-0">
          Document Type:
        </span>
        {[
          'All',
          'ID & Identity Cards',
          'Invoices & Store Bills',
          'Warranty & Insurance',
          'Electronics',
          'Vehicles & Property',
          'Other',
        ].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all shrink-0 ${
              categoryFilter === cat
                ? 'bg-monad-purple/20 text-monad-purple border border-monad-purple/50'
                : 'bg-zinc-950 text-zinc-400 border border-border hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
