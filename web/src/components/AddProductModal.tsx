'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Image as ImageIcon, ShieldCheck, Loader2, CheckCircle2, AlertCircle, Lock, Plus, UploadCloud } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useProducts } from '@/context/ProductContext';
import { uploadToIpfs } from '@/services/ipfs';
import { calculateFileSha256 } from '@/utils/hash';
import { useAccount } from 'wagmi';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const { addProduct } = useProducts();
  const { address } = useAccount();

  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [warrantyFile, setWarrantyFile] = useState<File | null>(null);

  const [stepStatus, setStepStatus] = useState<'idle' | 'ipfs' | 'hashing' | 'contract' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      category: 'ID & Identity Cards',
      name: '',
      brand: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      warrantyExpiry: '',
      storeName: '',
      serialNumber: '',
      purchasePrice: '',
      notes: '',
    },
  });

  const selectedCategory = watch('category');
  const isIdCard = selectedCategory === 'ID & Identity Cards';
  const isInvoice = selectedCategory === 'Invoices & Store Bills';
  const isWarranty = selectedCategory === 'Warranty & Insurance';

  if (!isOpen) return null;

  const onSubmit = async (data: any) => {
    try {
      setErrorMessage('');

      // Field Validation based on Category
      if (!data.name.trim()) {
        setErrorMessage('Document or Name is required');
        return;
      }

      if (isInvoice && !data.purchasePrice.trim()) {
        setErrorMessage('Purchase Price or Total Amount is required for invoices');
        return;
      }

      if (isWarranty && !data.warrantyExpiry) {
        setErrorMessage('Warranty Expiry Date is required for warranty tracking');
        return;
      }

      setStepStatus('ipfs');

      // 1. Upload files to IPFS (Invoice, Image, Warranty Card)
      let invoiceCid = 'bafybeig_sample_invoice';
      let imageCid = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000';
      let warrantyCid = 'bafybeig_sample_warranty';

      if (invoiceFile) {
        const res = await uploadToIpfs(invoiceFile);
        invoiceCid = res.cid;
      }

      if (imageFile) {
        const res = await uploadToIpfs(imageFile);
        imageCid = res.cid.startsWith('http') ? res.cid : res.url;
      }

      if (warrantyFile) {
        const res = await uploadToIpfs(warrantyFile);
        warrantyCid = res.cid;
      }

      // 2. Compute SHA-256 hash of primary document
      setStepStatus('hashing');
      let primaryFile = invoiceFile || warrantyFile || imageFile;
      let fileHash = '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

      if (primaryFile) {
        fileHash = await calculateFileSha256(primaryFile);
      }

      // 3. Write metadata to Smart Contract / Web3 State
      setStepStatus('contract');
      await new Promise((res) => setTimeout(res, 1000));

      const todayStr = new Date().toISOString().split('T')[0];

      await addProduct({
        owner: address || '0x836EF9A5202610143eDF823565F36a56f0836EF9',
        name: data.name,
        brand: data.brand || (isIdCard ? 'Government / Official Registry' : isInvoice ? 'Store / Merchant' : 'General'),
        category: data.category,
        purchaseDate: data.purchaseDate || todayStr,
        warrantyExpiry: data.warrantyExpiry || (isWarranty ? todayStr : '2035-12-31'),
        storeName: data.storeName || (isInvoice ? 'Store' : 'Official Issuer'),
        serialNumber: data.serialNumber || 'N/A',
        purchasePrice: data.purchasePrice || 'N/A',
        notes: data.notes || '',
        ipfsInvoiceCid: invoiceCid,
        ipfsImageCid: imageCid,
        ipfsWarrantyCid: warrantyCid,
        fileHash,
      });

      setStepStatus('success');

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#836EF9', '#A78BFA', '#10B981'],
      });

      setTimeout(() => {
        reset();
        setInvoiceFile(null);
        setImageFile(null);
        setWarrantyFile(null);
        setStepStatus('idle');
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Add document error:', err);
      setStepStatus('error');
      setErrorMessage(err.message || 'Failed to mint document passport');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl rounded-2xl bg-card border border-border p-6 sm:p-8 shadow-2xl my-8 overflow-hidden"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-monad-purple/15 border border-monad-purple/40 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-monad-purple" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Add Document to Vault</h3>
                <p className="text-xs text-zinc-400">Mint IPFS proof & SHA-256 hash on Monad Testnet</p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={stepStatus !== 'idle' && stepStatus !== 'error'}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {/* Category Selector First */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Select Document Category *</label>
              <select
                {...register('category')}
                className="w-full rounded-xl bg-zinc-950 border border-border px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-monad-purple"
              >
                <option value="ID & Identity Cards">ID & Identity Cards (National ID, Driver License)</option>
                <option value="Invoices & Store Bills">Invoices & Store Bills (Purchase Receipts)</option>
                <option value="Warranty & Insurance">Warranty & Insurance (Guarantee Papers)</option>
                <option value="Electronics">Electronics & Hardware</option>
                <option value="Vehicles & Property">Vehicles & Property</option>
                <option value="Other">Other Documents</option>
              </select>
            </div>

            {/* Dynamic Inputs Based on Category */}

            {/* CASE 1: ID & Identity Cards */}
            {isIdCard && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Document Label / Title *</label>
                    <input
                      {...register('name')}
                      placeholder="e.g. National Driver License or Passport ID"
                      className="w-full rounded-xl bg-zinc-950 border border-border px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-monad-purple"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Issuer / Govt Registry</label>
                    <input
                      {...register('brand')}
                      placeholder="e.g. State Dept / Govt Registry"
                      className="w-full rounded-xl bg-zinc-950 border border-border px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-monad-purple"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">ID Number / License No. (Optional)</label>
                    <input
                      {...register('serialNumber')}
                      placeholder="e.g. ID-99201-US"
                      className="w-full rounded-xl bg-zinc-950 border border-border px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-monad-purple"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Expiry Date (Optional)</label>
                    <input
                      type="date"
                      {...register('warrantyExpiry')}
                      className="w-full rounded-xl bg-zinc-950 border border-border px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-monad-purple"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CASE 2: Invoices & Store Bills */}
            {isInvoice && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Bill / Invoice Name *</label>
                    <input
                      {...register('name')}
                      placeholder="e.g. MacBook Pro Store Receipt"
                      className="w-full rounded-xl bg-zinc-950 border border-border px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-monad-purple"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Store / Merchant Name *</label>
                    <input
                      {...register('storeName')}
                      placeholder="e.g. Apple Store Regent St"
                      className="w-full rounded-xl bg-zinc-950 border border-border px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-monad-purple"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Purchase / Bill Date *</label>
                    <input
                      type="date"
                      {...register('purchaseDate')}
                      className="w-full rounded-xl bg-zinc-950 border border-border px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-monad-purple"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Total Amount / Price *</label>
                    <input
                      {...register('purchasePrice')}
                      placeholder="e.g. $3,499.00"
                      className="w-full rounded-xl bg-zinc-950 border border-border px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-monad-purple"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CASE 3: Warranty & Insurance */}
            {isWarranty && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Warranty Name *</label>
                    <input
                      {...register('name')}
                      placeholder="e.g. Sony Camera Extended Warranty"
                      className="w-full rounded-xl bg-zinc-950 border border-border px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-monad-purple"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Brand / Provider *</label>
                    <input
                      {...register('brand')}
                      placeholder="e.g. Sony / Protection Plan"
                      className="w-full rounded-xl bg-zinc-950 border border-border px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-monad-purple"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Purchase / Issue Date *</label>
                    <input
                      type="date"
                      {...register('purchaseDate')}
                      className="w-full rounded-xl bg-zinc-950 border border-border px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-monad-purple"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Warranty Expiry Date *</label>
                    <input
                      type="date"
                      {...register('warrantyExpiry')}
                      className="w-full rounded-xl bg-zinc-950 border border-border px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-monad-purple"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CASE 4: Electronics / Vehicles / Property / Other */}
            {!isIdCard && !isInvoice && !isWarranty && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Item / Product Name *</label>
                    <input
                      {...register('name')}
                      placeholder="e.g. Sony A7 IV Camera"
                      className="w-full rounded-xl bg-zinc-950 border border-border px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-monad-purple"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Brand / Maker *</label>
                    <input
                      {...register('brand')}
                      placeholder="e.g. Sony, Apple"
                      className="w-full rounded-xl bg-zinc-950 border border-border px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-monad-purple"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Purchase Date *</label>
                    <input
                      type="date"
                      {...register('purchaseDate')}
                      className="w-full rounded-xl bg-zinc-950 border border-border px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-monad-purple"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Warranty Expiry</label>
                    <input
                      type="date"
                      {...register('warrantyExpiry')}
                      className="w-full rounded-xl bg-zinc-950 border border-border px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-monad-purple"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Purchase Price</label>
                    <input
                      {...register('purchasePrice')}
                      placeholder="e.g. $2,498.00"
                      className="w-full rounded-xl bg-zinc-950 border border-border px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-monad-purple"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notes Field */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Notes / Description (Optional)</label>
              <textarea
                {...register('notes')}
                rows={2}
                placeholder="Additional notes, policy info, condition..."
                className="w-full rounded-xl bg-zinc-950 border border-border px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-monad-purple"
              />
            </div>

            {/* IPFS Document File Upload Dropzones */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-zinc-300">
                  Upload Document File / Proof
                </label>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Lock className="h-3 w-3" /> AES-256 Encrypted Vault
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Upload Primary Document PDF */}
                <div className="relative rounded-xl border border-dashed border-border p-3 text-center bg-zinc-950/60 hover:border-monad-purple/50 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => setInvoiceFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <FileText className="h-5 w-5 text-monad-purple mx-auto mb-1" />
                  <p className="text-[11px] font-semibold text-zinc-300 truncate">
                    {invoiceFile ? invoiceFile.name : isIdCard ? 'Upload ID PDF/Image' : 'Upload Main Document'}
                  </p>
                  <p className="text-[9px] text-zinc-500">PDF / Image</p>
                </div>

                {/* Upload Photo */}
                <div className="relative rounded-xl border border-dashed border-border p-3 text-center bg-zinc-950/60 hover:border-monad-purple/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <ImageIcon className="h-5 w-5 text-monad-purple mx-auto mb-1" />
                  <p className="text-[11px] font-semibold text-zinc-300 truncate">
                    {imageFile ? imageFile.name : 'Upload Photo'}
                  </p>
                  <p className="text-[9px] text-zinc-500">High-res Photo</p>
                </div>

                {/* Upload Supporting Paper */}
                <div className="relative rounded-xl border border-dashed border-border p-3 text-center bg-zinc-950/60 hover:border-monad-purple/50 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => setWarrantyFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <ShieldCheck className="h-5 w-5 text-monad-purple mx-auto mb-1" />
                  <p className="text-[11px] font-semibold text-zinc-300 truncate">
                    {warrantyFile ? warrantyFile.name : 'Supporting Doc'}
                  </p>
                  <p className="text-[9px] text-zinc-500">Additional Doc</p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {stepStatus === 'error' && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 flex items-center space-x-2 text-rose-400 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Live Progress Feedback */}
            {stepStatus !== 'idle' && stepStatus !== 'error' && (
              <div className="rounded-xl bg-zinc-950 border border-monad-purple/40 p-4 space-y-2">
                <div className="flex items-center space-x-3 text-xs text-white font-medium">
                  {stepStatus === 'success' ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <Loader2 className="h-5 w-5 text-monad-purple animate-spin" />
                  )}
                  <span>
                    {stepStatus === 'ipfs' && 'Uploading document & pinning to Pinata IPFS...'}
                    {stepStatus === 'hashing' && 'Calculating Web Crypto SHA-256 document hash...'}
                    {stepStatus === 'contract' && 'Signing & broadcasting transaction to Monad Testnet...'}
                    {stepStatus === 'success' && 'Document successfully anchored on Monad!'}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                disabled={stepStatus !== 'idle' && stepStatus !== 'error'}
                className="px-4 py-2.5 rounded-xl border border-border text-zinc-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={stepStatus !== 'idle' && stepStatus !== 'error'}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-monad-purple to-monad-darkPurple hover:from-monad-light hover:to-monad-purple text-white text-xs font-bold shadow-lg shadow-monad-glow flex items-center gap-2"
              >
                {stepStatus !== 'idle' && stepStatus !== 'error' && <Loader2 className="h-4 w-4 animate-spin" />}
                Mint Document on Monad
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
