'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, Clock, Key, CheckCircle2, UserCheck, ShieldCheck, FileText, CreditCard } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { OwnlyLogoMark } from '@/components/OwnlyLogo';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-background">
      {/* Background Monad Glow Effects */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-monad-purple/20 rounded-full blur-[120px] opacity-70" />
      <div className="pointer-events-none absolute top-1/3 right-10 w-[300px] h-[300px] bg-monad-darkPurple/30 rounded-full blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border border-border text-xs text-zinc-300">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-semibold text-emerald-400">100% Private AES-256 Encrypted Vault</span>
              <span className="text-zinc-500">•</span>
              <span className="text-monad-purple font-medium">Monad Testnet</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Your Encrypted Web3 Vault for IDs, Bills & Warranties.
            </h1>

            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Store ID cards, driver licenses, store bills, purchase invoices, and warranty claim papers safely on Monad. 100% private AES-256 encrypted vault — accessible anytime with your wallet.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <ConnectButton.Custom>
                {({ account, openConnectModal, mounted }) => {
                  if (!mounted) return null;
                  if (!account) {
                    return (
                      <>
                        <button
                          onClick={openConnectModal}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-monad-purple to-monad-darkPurple hover:from-monad-light hover:to-monad-purple text-white font-semibold shadow-lg shadow-monad-glow transition-all duration-300 text-sm hover:scale-[1.02]"
                        >
                          <Lock className="h-4 w-4" />
                          Connect Wallet to Unlock Vault
                        </button>
                        <button
                          onClick={openConnectModal}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-card border border-border hover:border-zinc-600 text-zinc-200 font-semibold transition-all duration-200 text-sm"
                        >
                          View Stored Documents
                        </button>
                      </>
                    );
                  }
                  return (
                    <button
                      onClick={onExploreClick}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-monad-purple to-monad-darkPurple text-white font-semibold shadow-lg shadow-monad-glow transition-all duration-300 text-sm hover:scale-[1.02]"
                    >
                      Open Encrypted Vault
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  );
                }}
              </ConnectButton.Custom>
            </div>

            {/* Quick Metrics */}
            <div className="pt-8 border-t border-border/60 grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-2xl font-bold text-emerald-400">AES-256</p>
                <p className="text-xs text-zinc-500">Client Encrypted</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">SHA-256</p>
                <p className="text-xs text-zinc-500">Monad On-Chain Proof</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-monad-purple">1-Click</p>
                <p className="text-xs text-zinc-500">Wallet Recovery</p>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Visual: Custom Encrypted ID Card & Document Vault Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Main Mock Encrypted ID & Vault Pass Card */}
            <div className="relative rounded-2xl bg-card/90 border border-border p-6 shadow-2xl backdrop-blur-xl hover:border-monad-purple/50 transition-all duration-500 group">
              {/* Floating Badge 1 */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -left-4 flex items-center gap-2 rounded-xl bg-zinc-900/95 border border-emerald-500/50 px-3.5 py-2 shadow-xl backdrop-blur-md text-xs font-semibold text-white z-20"
              >
                <Key className="h-4 w-4 text-emerald-400" />
                <span>AES-256 Encrypted ID Vault</span>
              </motion.div>

              {/* Floating Badge 2 */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -right-4 flex items-center gap-2 rounded-xl bg-zinc-900/95 border border-monad-purple/50 px-3.5 py-2 shadow-xl backdrop-blur-md text-xs font-semibold text-white z-20"
              >
                <ShieldCheck className="h-4 w-4 text-monad-purple" />
                <span>1-Click Wallet Access Anytime</span>
              </motion.div>

              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center space-x-3">
                  <OwnlyLogoMark size={38} />
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                      Digital ID & Document Passport
                    </h3>
                    <p className="text-xs text-zinc-400">Identity & Government • ID: ID-99201-US</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-medium flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Private Vault
                </span>
              </div>

              {/* Custom Vector Digital ID & Document Graphic (Replaces Laptop Image) */}
              <div className="mt-4 relative h-52 w-full rounded-xl overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border border-border group-hover:border-monad-purple/40 transition-all p-4 flex flex-col justify-between">
                {/* ID Graphic Header Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-7 w-7 rounded-lg bg-monad-purple/20 border border-monad-purple/40 flex items-center justify-center">
                      <UserCheck className="h-4 w-4 text-monad-purple" />
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold text-white block tracking-wider uppercase">
                        State Driver License & National ID
                      </span>
                      <span className="text-[9px] text-zinc-400 font-mono">Issued: Jan 2024 • Valid thru 2029</span>
                    </div>
                  </div>

                  {/* Micro Smart Chip Emblem */}
                  <div className="h-6 w-8 rounded bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
                    <div className="h-3 w-4 border border-amber-400/60 rounded-xs" />
                  </div>
                </div>

                {/* ID Card Graphic Center Grid */}
                <div className="grid grid-cols-12 gap-3 items-center my-2">
                  {/* Photo Avatar Badge */}
                  <div className="col-span-4 h-20 rounded-lg bg-zinc-900 border border-monad-purple/30 flex flex-col items-center justify-center p-2 relative">
                    <UserCheck className="h-8 w-8 text-monad-purple mb-1" />
                    <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-0.5">
                      <CheckCircle2 className="h-2.5 w-2.5" /> VERIFIED
                    </span>
                  </div>

                  {/* Encrypted Field Lines */}
                  <div className="col-span-8 space-y-1.5 text-[10px]">
                    <div className="bg-zinc-950/80 p-1.5 rounded border border-border flex justify-between">
                      <span className="text-zinc-500">FULL NAME:</span>
                      <span className="text-white font-semibold">ALEXANDER R. VANE</span>
                    </div>
                    <div className="bg-zinc-950/80 p-1.5 rounded border border-border flex justify-between">
                      <span className="text-zinc-500">VAULT KEY:</span>
                      <span className="text-monad-purple font-mono">0x836E...6EF9</span>
                    </div>
                    <div className="bg-zinc-950/80 p-1.5 rounded border border-border flex justify-between">
                      <span className="text-zinc-500">DOC STATUS:</span>
                      <span className="text-emerald-400 font-bold">100% PRIVATE AES-256</span>
                    </div>
                  </div>
                </div>

                {/* ID Graphic Footer Overlay */}
                <div className="flex items-center justify-between text-[10px] bg-black/60 backdrop-blur-sm p-2 rounded-lg border border-white/10">
                  <span className="text-zinc-300 flex items-center gap-1">
                    <FileText className="h-3 w-3 text-monad-purple" />
                    Invoices, Bills & ID Attached
                  </span>
                  <span className="text-monad-purple font-mono text-[9px]">
                    SHA-256: 0x9f83...d9069
                  </span>
                </div>
              </div>

              {/* Passport Details */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg bg-zinc-950/60 border border-border p-2.5">
                  <span className="text-zinc-500 block text-[10px]">ATTACHED BILLS & INVOICES</span>
                  <span className="font-semibold text-white">Apple Store & B&H Bills</span>
                </div>
                <div className="rounded-lg bg-zinc-950/60 border border-border p-2.5">
                  <span className="text-zinc-500 block text-[10px]">WARRANTY CLAIM DOCS</span>
                  <span className="font-semibold text-emerald-400">All Papers Backed Up</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
