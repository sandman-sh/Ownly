'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types/product';
import { useProducts } from '@/context/ProductContext';
import { X, ArrowLeftRight, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TransferOwnershipModalProps {
  product: Product | null;
  onClose: () => void;
}

export const TransferOwnershipModal: React.FC<TransferOwnershipModalProps> = ({ product, onClose }) => {
  const { transferOwnership } = useProducts();
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!product) return null;

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!recipientAddress || !recipientAddress.startsWith('0x') || recipientAddress.length !== 42) {
      setError('Please enter a valid Ethereum / Monad wallet address (0x...)');
      return;
    }

    if (recipientAddress.toLowerCase() === product.owner.toLowerCase()) {
      setError('Recipient cannot be the current owner address');
      return;
    }

    setIsTransferring(true);

    try {
      // Execute Web3 transfer
      await new Promise((res) => setTimeout(res, 1200));
      await transferOwnership(product.id, recipientAddress);

      setIsSuccess(true);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        setIsSuccess(false);
        setIsTransferring(false);
        setRecipientAddress('');
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Transfer failed:', err);
      setError(err.message || 'Failed to transfer ownership');
      setIsTransferring(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl space-y-6"
        >
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-monad-purple/15 border border-monad-purple/40 flex items-center justify-center">
                <ArrowLeftRight className="h-5 w-5 text-monad-purple" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Transfer Ownership</h3>
                <p className="text-xs text-zinc-400">Mint transfer record on Monad Testnet</p>
              </div>
            </div>

            <button onClick={onClose} disabled={isTransferring} className="p-2 rounded-xl text-zinc-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="rounded-xl bg-zinc-950 p-4 border border-border space-y-1 text-xs">
            <span className="text-zinc-500">TRANSFERRING PASSPORT</span>
            <p className="font-bold text-white text-sm">{product.name}</p>
            <p className="text-zinc-400">Serial: {product.serialNumber}</p>
          </div>

          {isSuccess ? (
            <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-emerald-400">Ownership Transferred!</h4>
              <p className="text-xs text-emerald-300/80">New wallet instantly owns the product passport.</p>
            </div>
          ) : (
            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Recipient Monad Wallet Address *
                </label>
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="0x1234...5678"
                  className="w-full rounded-xl bg-zinc-950 border border-border px-3.5 py-2.5 text-xs text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-monad-purple"
                />
              </div>

              {error && <p className="text-xs text-rose-400">{error}</p>}

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isTransferring}
                  className="px-4 py-2.5 rounded-xl border border-border text-zinc-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isTransferring}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-monad-purple to-monad-darkPurple text-white text-xs font-bold shadow-lg shadow-monad-glow flex items-center gap-2"
                >
                  {isTransferring && <Loader2 className="h-4 w-4 animate-spin" />}
                  Confirm On-Chain Transfer
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
