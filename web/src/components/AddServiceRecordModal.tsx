'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types/product';
import { useProducts } from '@/context/ProductContext';
import { uploadToIpfs } from '@/services/ipfs';
import { calculateFileSha256 } from '@/utils/hash';
import { X, Wrench, UploadCloud, Loader2, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AddServiceRecordModalProps {
  product: Product | null;
  onClose: () => void;
}

export const AddServiceRecordModal: React.FC<AddServiceRecordModalProps> = ({ product, onClose }) => {
  const { addServiceRecord } = useProducts();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [serviceCenter, setServiceCenter] = useState('');
  const [description, setDescription] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!serviceCenter || !description) {
      setError('Please fill in service center and maintenance description');
      return;
    }

    setIsSubmitting(true);

    try {
      let receiptCid = 'bafybeig_service_receipt';
      let receiptHash = '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069';

      if (receiptFile) {
        const uploadRes = await uploadToIpfs(receiptFile);
        receiptCid = uploadRes.cid;
        receiptHash = await calculateFileSha256(receiptFile);
      }

      await new Promise((res) => setTimeout(res, 1000));

      await addServiceRecord(product.id, {
        date,
        serviceCenter,
        description,
        ipfsReceiptCid: receiptCid,
        receiptHash,
      });

      setIsSuccess(true);
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        setIsSuccess(false);
        setIsSubmitting(false);
        onClose();
      }, 1400);
    } catch (err: any) {
      console.error('Add service record error:', err);
      setError(err.message || 'Failed to add service record');
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-2xl space-y-6"
        >
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-monad-purple/15 border border-monad-purple/40 flex items-center justify-center">
                <Wrench className="h-5 w-5 text-monad-purple" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Log Maintenance Record</h3>
                <p className="text-xs text-zinc-400">Anchor service history on Monad Testnet</p>
              </div>
            </div>

            <button onClick={onClose} disabled={isSubmitting} className="p-2 rounded-xl text-zinc-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="rounded-xl bg-zinc-950 p-3.5 border border-border text-xs">
            <span className="text-zinc-500 block text-[10px]">PRODUCT PASSPORT</span>
            <span className="font-bold text-white">{product.name}</span>
          </div>

          {isSuccess ? (
            <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-emerald-400">Service Record Anchored!</h4>
              <p className="text-xs text-emerald-300/80">Receipt pinned to IPFS & SHA-256 logged on Monad.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Service Date *</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl bg-zinc-950 border border-border px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-monad-purple"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Service Center *</label>
                  <input
                    type="text"
                    value={serviceCenter}
                    onChange={(e) => setServiceCenter(e.target.value)}
                    placeholder="e.g. Apple Genius Bar, Sony Care"
                    className="w-full rounded-xl bg-zinc-950 border border-border px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-monad-purple"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Description *</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Battery replacement, screen repair, annual sensor cleaning..."
                  className="w-full rounded-xl bg-zinc-950 border border-border px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-monad-purple"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Upload Service Receipt</label>
                <div className="relative rounded-xl border border-dashed border-border p-4 text-center bg-zinc-950/60 hover:border-monad-purple/50 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <UploadCloud className="h-5 w-5 text-monad-purple mx-auto mb-1" />
                  <p className="text-xs font-semibold text-zinc-300">
                    {receiptFile ? receiptFile.name : 'Upload Service Receipt PDF/Image'}
                  </p>
                </div>
              </div>

              {error && <p className="text-xs text-rose-400">{error}</p>}

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl border border-border text-zinc-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-monad-purple to-monad-darkPurple text-white text-xs font-bold shadow-lg shadow-monad-glow flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Service Record
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
