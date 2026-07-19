'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { HowItWorks } from '@/components/HowItWorks';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { StatsCards } from '@/components/StatsCards';
import { ProductCard } from '@/components/ProductCard';
import { SearchFilterBar } from '@/components/SearchFilterBar';
import { AddProductModal } from '@/components/AddProductModal';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { FileVerificationModal } from '@/components/FileVerificationModal';
import { TransferOwnershipModal } from '@/components/TransferOwnershipModal';
import { AddServiceRecordModal } from '@/components/AddServiceRecordModal';
import { OwnlyChatWidget } from '@/components/OwnlyChatWidget';
import { useProducts } from '@/context/ProductContext';
import { useAccount } from 'wagmi';
import { Product, ProductFilterStatus, ProductSortOption } from '@/types/product';
import { calculateWarrantyDaysLeft, getWarrantyStatus, formatAddress } from '@/utils/hash';
import { Sparkles, Package, Wrench, ShieldCheck, Plus, ArrowRight, History } from 'lucide-react';

export default function Home() {
  const { isConnected, address } = useAccount();
  const { products, selectedProduct, setSelectedProduct, deleteProduct } = useProducts();

  // Navigation State
  const [activeTab, setActiveTab] = useState<'landing' | 'dashboard' | 'products' | 'service' | 'verify' | 'settings'>('landing');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [transferTargetProduct, setTransferTargetProduct] = useState<Product | null>(null);
  const [serviceTargetProduct, setServiceTargetProduct] = useState<Product | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProductFilterStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<ProductSortOption>('newest');

  // Filter & Sort Logic
  const filteredProducts = products.filter((product) => {
    if (product.isDeleted) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchBrand = product.brand.toLowerCase().includes(q);
      const matchSerial = product.serialNumber.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchSerial) return false;
    }

    // Status filter
    const status = getWarrantyStatus(product.warrantyExpiry);
    if (statusFilter === 'active' && status !== 'active') return false;
    if (statusFilter === 'expiring' && status !== 'expiring') return false;
    if (statusFilter === 'expired' && status !== 'expired') return false;

    // Category filter
    if (categoryFilter !== 'All' && product.category !== categoryFilter) return false;

    return true;
  }).sort((a, b) => {
    if (sortBy === 'oldest') return a.createdAt - b.createdAt;
    if (sortBy === 'warrantySoon') {
      return calculateWarrantyDaysLeft(a.warrantyExpiry) - calculateWarrantyDaysLeft(b.warrantyExpiry);
    }
    return b.createdAt - a.createdAt; // Default newest
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-zinc-100">
      {/* Top Header Navbar */}
      <Navbar
        onOpenAddModal={() => setIsAddModalOpen(true)}
        activeView={activeTab}
        setActiveView={(tab) => setActiveTab(tab as any)}
      />

      {/* Main Content Area */}
      {!isConnected || activeTab === 'landing' ? (
        /* Landing Page view */
        <main className="flex-1">
          <Hero onExploreClick={() => setActiveTab('dashboard')} />
          <Features />
          <HowItWorks />
        </main>
      ) : (
        /* App Dashboard view (Sidebar + Workspace) */
        <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
          {/* Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={(tab) => setActiveTab(tab as any)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />

          {/* Main Dashboard Area */}
          <main className="flex-1 space-y-6 min-w-0">
            {/* Top Welcome Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-card to-zinc-950 border border-border p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-monad-purple uppercase tracking-wider">
                  Monad Testnet Wallet Active
                </span>
                <h1 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
                  Welcome, {address ? formatAddress(address) : '0x836E...6EF9'}
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </h1>
                <p className="text-xs text-zinc-400 mt-1">
                  Manage your warranty cards, IPFS invoice receipts, and on-chain ownership passports.
                </p>
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-monad-purple to-monad-darkPurple hover:from-monad-light hover:to-monad-purple text-white text-xs font-bold shadow-lg shadow-monad-glow flex items-center gap-2 shrink-0"
              >
                <Plus className="h-4 w-4" />
                + Add Document
              </button>
            </div>

            {/* Dashboard Overview Tab */}
            {activeTab === 'dashboard' && (
              <>
                <StatsCards products={products} />

                {/* Quick Search & Product Cards Grid */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Package className="h-4 w-4 text-monad-purple" />
                      Active Documents & Passports ({filteredProducts.length})
                    </h3>
                  </div>

                  <SearchFilterBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    categoryFilter={categoryFilter}
                    setCategoryFilter={setCategoryFilter}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                  />

                  {filteredProducts.length === 0 ? (
                    <div className="rounded-2xl bg-card border border-border p-12 text-center space-y-3">
                      <Package className="h-12 w-12 text-zinc-600 mx-auto" />
                      <h4 className="text-base font-bold text-white">No Documents Found</h4>
                      <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                        There are no documents matching your filter parameters. Add your first document to your vault now!
                      </p>
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-monad-purple text-white text-xs font-semibold"
                      >
                        + Add Document
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onSelect={(p) => setSelectedProduct(p)}
                          onTransfer={(p) => setTransferTargetProduct(p)}
                          onAddService={(p) => setServiceTargetProduct(p)}
                          onDelete={(id) => deleteProduct(id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Products List Tab */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                <SearchFilterBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  categoryFilter={categoryFilter}
                  setCategoryFilter={setCategoryFilter}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={(p) => setSelectedProduct(p)}
                      onTransfer={(p) => setTransferTargetProduct(p)}
                      onAddService={(p) => setServiceTargetProduct(p)}
                      onDelete={(id) => deleteProduct(id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Service History Tab */}
            {activeTab === 'service' && (
              <div className="rounded-2xl bg-card border border-border p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-monad-purple" />
                      Global Service & Maintenance Log
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Audit trail of repairs, maintenance receipts, and service center verifications.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {products.flatMap((p) => p.serviceRecords.map((srv) => ({ srv, p }))).length === 0 ? (
                    <div className="text-center py-12 text-zinc-500 text-xs">
                      No service records logged yet. Open a product card to add your first service log!
                    </div>
                  ) : (
                    products.flatMap((p) => p.serviceRecords.map((srv) => ({ srv, p }))).map(({ srv, p }) => (
                      <div key={srv.id} className="rounded-xl bg-zinc-950 border border-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-monad-purple uppercase">{p.brand} — {p.name}</span>
                          <h4 className="text-sm font-bold text-white">{srv.serviceCenter}</h4>
                          <p className="text-xs text-zinc-300">{srv.description}</p>
                          <p className="text-[10px] text-zinc-500 font-mono">Date: {srv.date} • Hash: {srv.receiptHash.substring(0, 16)}...</p>
                        </div>

                        <button
                          onClick={() => setSelectedProduct(p)}
                          className="px-3.5 py-1.5 rounded-xl bg-monad-purple/10 text-monad-purple border border-monad-purple/30 text-xs font-semibold shrink-0"
                        >
                          View Passport
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Cryptographic File Verification Tab */}
            {activeTab === 'verify' && <FileVerificationModal products={products} />}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="rounded-2xl bg-card border border-border p-6 space-y-6">
                <div className="border-b border-border pb-4">
                  <h3 className="text-lg font-bold text-white">Monad Network Settings</h3>
                  <p className="text-xs text-zinc-400">Environment and smart contract configuration</p>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-border flex justify-between items-center">
                    <span className="text-zinc-400">Target Blockchain Network:</span>
                    <span className="text-monad-purple font-bold">Monad Testnet (Chain ID 10143)</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-border flex justify-between items-center">
                    <span className="text-zinc-400">RPC Endpoint:</span>
                    <span className="text-white">https://testnet-rpc.monad.xyz</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-border flex justify-between items-center">
                    <span className="text-zinc-400">Deployed Contract Address:</span>
                    <span className="text-monad-purple">0x836EF9A5202610143eDF823565F36a56f0836EF9</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-border flex justify-between items-center">
                    <span className="text-zinc-400">Decentralized Storage:</span>
                    <span className="text-emerald-400">Pinata IPFS Gateway</span>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* Universal Footer */}
      <Footer />

      {/* Ownly AI Chatbot Widget (Active when wallet is connected) */}
      <OwnlyChatWidget />

      {/* Global Modals */}
      <AddProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onTransfer={(p) => setTransferTargetProduct(p)}
        onAddService={(p) => setServiceTargetProduct(p)}
        onDelete={(id) => deleteProduct(id)}
      />
      <TransferOwnershipModal
        product={transferTargetProduct}
        onClose={() => setTransferTargetProduct(null)}
      />
      <AddServiceRecordModal
        product={serviceTargetProduct}
        onClose={() => setServiceTargetProduct(null)}
      />
    </div>
  );
}
