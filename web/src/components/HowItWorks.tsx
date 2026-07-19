'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, UploadCloud, Database, Sparkles, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    step: 'Step 1',
    title: 'Connect Wallet',
    description: 'Connect your Monad Testnet wallet (MetaMask, Rabby, Rainbow, or WalletConnect).',
    icon: Wallet,
  },
  {
    step: 'Step 2',
    title: 'Upload Product',
    description: 'Add product serial number, purchase details, and attach invoice PDFs or warranty cards.',
    icon: UploadCloud,
  },
  {
    step: 'Step 3',
    title: 'Save on Monad',
    description: 'Files are pinned on IPFS while smart contracts log cryptographic SHA-256 hashes on Monad.',
    icon: Database,
  },
  {
    step: 'Step 4',
    title: 'Access Anytime',
    description: 'View warranty status, verify file authenticity, or transfer ownership seamlessly.',
    icon: Sparkles,
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-background relative border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-monad-purple">
            Simple Workflow
          </h2>
          <p className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            How Ownly Works
          </p>
          <p className="text-zinc-400 text-base">
            From purchase receipt to permanent blockchain proof in four effortless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {STEPS.map((stepItem, idx) => {
            const Icon = stepItem.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                viewport={{ once: true }}
                className="relative rounded-2xl bg-card border border-border p-6 flex flex-col justify-between hover:border-monad-purple/40 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-monad-purple uppercase tracking-wider">
                      {stepItem.step}
                    </span>
                    <div className="h-10 w-10 rounded-xl bg-monad-purple/10 flex items-center justify-center border border-monad-purple/30 group-hover:scale-110 transition-transform">
                      <Icon className="h-5 w-5 text-monad-purple" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">
                    {stepItem.title}
                  </h3>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {stepItem.description}
                  </p>
                </div>

                {idx < STEPS.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-zinc-600">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
