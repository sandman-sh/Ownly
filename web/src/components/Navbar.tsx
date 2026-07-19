'use client';

import React from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Sparkles, Github } from 'lucide-react';
import { OwnlyLogoMark } from '@/components/OwnlyLogo';
import { useAccount } from 'wagmi';

interface NavbarProps {
  onOpenAddModal?: () => void;
  activeView?: string;
  setActiveView?: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddModal, activeView, setActiveView }) => {
  const { isConnected } = useAccount();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <Link href="/" onClick={() => setActiveView && setActiveView('landing')} className="flex items-center space-x-3 group">
            <OwnlyLogoMark size={38} className="transition-transform duration-300 group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                Ownly
                <span className="rounded-full bg-monad-purple/10 px-2 py-0.5 text-[10px] font-semibold text-monad-purple border border-monad-purple/30">
                  Monad Testnet
                </span>
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-zinc-400">
          {!isConnected ? (
            <>
              <a href="#features" className="hover:text-white transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="hover:text-white transition-colors">
                How it Works
              </a>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveView && setActiveView('dashboard')}
                className={`hover:text-white transition-colors ${activeView === 'dashboard' ? 'text-white font-semibold' : ''}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveView && setActiveView('products')}
                className={`hover:text-white transition-colors ${activeView === 'products' ? 'text-white font-semibold' : ''}`}
              >
                Vault Documents
              </button>
              <button
                onClick={() => setActiveView && setActiveView('verify')}
                className={`hover:text-white transition-colors ${activeView === 'verify' ? 'text-white font-semibold' : ''}`}
              >
                Verify Integrity
              </button>
            </>
          )}

          <a
            href="https://github.com/sandman-sh/Ownly.git"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors border-l border-border pl-4"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </nav>

        {/* Actions & Connect Wallet */}
        <div className="flex items-center space-x-3">
          {isConnected && onOpenAddModal && (
            <button
              onClick={onOpenAddModal}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-monad-purple/10 hover:bg-monad-purple/20 text-monad-purple border border-monad-purple/40 text-xs font-semibold transition-all duration-200"
            >
              <Sparkles className="h-3.5 w-3.5" />
              + Add Document
            </button>
          )}

          <ConnectButton
            accountStatus="avatar"
            chainStatus="icon"
            showBalance={false}
          />
        </div>
      </div>
    </header>
  );
};
