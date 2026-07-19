'use client';

import React from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { OwnlyLogoMark } from '@/components/OwnlyLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-card/50 py-12 text-sm text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3">
          <OwnlyLogoMark size={32} />
          <div>
            <span className="font-bold text-white text-base">Ownly</span>
            <span className="text-zinc-500 text-xs ml-2">Own your proof.</span>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-xs text-zinc-400">
          <a
            href="https://github.com/sandman-sh/Ownly.git"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Github className="h-4 w-4" />
            GitHub Repository
          </a>
          <a
            href="https://testnet.monadscan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-monad-purple transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Monad Testnet Explorer
          </a>
        </div>

        <div className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5 bg-monad-purple/10 px-3 py-1.5 rounded-full border border-monad-purple/30">
          <span>Made with</span>
          <span className="text-monad-purple font-bold">Monad</span>
        </div>
      </div>
    </footer>
  );
};
