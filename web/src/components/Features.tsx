'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Clock, Database, Wrench, ArrowLeftRight, CheckCircle2, Key, FolderLock } from 'lucide-react';

const FEATURES = [
  {
    icon: FolderLock,
    title: 'Private Encrypted Vault',
    description: 'All invoices, store bills, and warranty cards are client-side encrypted using AES-256-GCM. Readable ONLY by your wallet.',
    highlight: '100% Private',
  },
  {
    icon: ShieldCheck,
    title: 'Never Lose a Document',
    description: 'Forget searching through emails or physical paper drawers. Log into any device with your Web3 wallet to retrieve your papers instantly.',
    highlight: 'Lifetime Access',
  },
  {
    icon: Lock,
    title: 'Monad Proof of Authenticity',
    description: 'Cryptographic SHA-256 hash commitments registered on Monad Testnet to prove purchase date and warranty validity.',
    highlight: 'SHA-256 Hash',
  },
  {
    icon: Clock,
    title: 'Warranty Expiration Countdown',
    description: 'Automatic countdown tracking for all claim cards with alerts before your warranty or return period expires.',
    highlight: 'Claim Alerts',
  },
  {
    icon: Database,
    title: 'IPFS Redundant Backups',
    description: 'Encrypted document files are pinned on Pinata IPFS nodes, ensuring censorship-resistant, decentralized backup.',
    highlight: 'Pinata IPFS',
  },
  {
    icon: ArrowLeftRight,
    title: 'Transferable Proof on Resale',
    description: 'When selling a device or luxury item, seamlessly transfer the encrypted passport and verified warranty history to the new owner.',
    highlight: 'Transfer Proof',
  },
];

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-background border-t border-border/50 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-monad-purple">
            Encrypted Document Protection
          </h2>
          <p className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Your bills, invoices & warranties — safe forever.
          </p>
          <p className="text-zinc-400 text-base">
            Ownly combines client-side AES-256 privacy with Monad on-chain verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative rounded-2xl bg-card border border-border p-6 hover:border-monad-purple/50 transition-all duration-300 hover:shadow-xl hover:shadow-monad-glow/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-monad-purple/10 border border-monad-purple/30 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6 text-monad-purple" />
                    </div>
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-zinc-900 border border-border text-zinc-400">
                      {feature.highlight}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-monad-purple transition-colors mb-2">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 flex items-center gap-2 text-xs text-zinc-500">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>AES-256 Vault Protected</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
