'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, UploadCloud, CheckCircle2, XCircle, FileText, Loader2 } from 'lucide-react';
import { Product } from '@/types/product';
import { calculateFileSha256 } from '@/utils/hash';

interface FileVerificationModalProps {
  products: Product[];
}

export const FileVerificationModal: React.FC<FileVerificationModalProps> = ({ products }) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [fileToVerify, setFileToVerify] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<{
    matches: boolean;
    expectedHash: string;
    calculatedHash: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileToVerify(file);
    setResult(null);
  };

  const handleVerify = async () => {
    if (!fileToVerify || !selectedProductId) return;
    setIsVerifying(true);

    try {
      const calculatedHash = await calculateFileSha256(fileToVerify);
      const target = products.find((p) => p.id === selectedProductId);
      const expectedHash = target?.fileHash || '0x';
      const matches = calculatedHash.toLowerCase() === expectedHash.toLowerCase();

      setResult({
        matches,
        expectedHash,
        calculatedHash,
      });
    } catch (err) {
      console.error('File verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="rounded-2xl bg-card border border-border p-6 shadow-xl space-y-6">
      <div className="flex items-center space-x-3 pb-4 border-b border-border">
        <div className="h-10 w-10 rounded-xl bg-monad-purple/15 border border-monad-purple/40 flex items-center justify-center">
          <ShieldCheck className="h-5 w-5 text-monad-purple" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Cryptographic File Integrity Verifier</h3>
          <p className="text-xs text-zinc-400">
            Upload any physical invoice or warranty document to verify against the on-chain Monad SHA-256 hash.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1: Select Passport & Drop File */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Select Passport to Verify</label>
            <select
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                setResult(null);
              }}
              className="w-full rounded-xl bg-zinc-950 border border-border px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-monad-purple"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.brand} - {p.name} (#{p.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Upload File Document</label>
            <div className="relative rounded-2xl border-2 border-dashed border-border p-8 text-center bg-zinc-950/60 hover:border-monad-purple/50 transition-colors">
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <UploadCloud className="h-8 w-8 text-monad-purple mx-auto mb-2" />
              <p className="text-xs font-semibold text-white">
                {fileToVerify ? fileToVerify.name : 'Drag & drop invoice or warranty PDF/image'}
              </p>
              <p className="text-[10px] text-zinc-500 mt-1">Supports PDF, PNG, JPG</p>
            </div>
          </div>

          <button
            onClick={handleVerify}
            disabled={!fileToVerify || isVerifying}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-monad-purple to-monad-darkPurple hover:from-monad-light hover:to-monad-purple text-white text-xs font-bold shadow-lg shadow-monad-glow disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isVerifying && <Loader2 className="h-4 w-4 animate-spin" />}
            Verify File Authenticity
          </button>
        </div>

        {/* Step 2: Live Verification Result Output */}
        <div className="rounded-xl bg-zinc-950/80 border border-border p-5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-3">
              VERIFICATION STATUS
            </span>

            {result === null ? (
              <div className="text-center py-12 space-y-2">
                <FileText className="h-10 w-10 text-zinc-700 mx-auto" />
                <p className="text-xs text-zinc-500">
                  Select a product passport and upload a document to compute its SHA-256 hash.
                </p>
              </div>
            ) : result.matches ? (
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-400">Authentic & Verified ✅</h4>
                    <p className="text-xs text-emerald-300/80">
                      The document hash matches the exact record anchored on Monad Testnet.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-zinc-900 border border-border">
                    <span className="text-zinc-500 text-[10px] block">ON-CHAIN STORED HASH</span>
                    <span className="text-emerald-400 break-all">{result.expectedHash}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-900 border border-border">
                    <span className="text-zinc-500 text-[10px] block">CALCULATED FILE HASH</span>
                    <span className="text-emerald-400 break-all">{result.calculatedHash}</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="space-y-4">
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-3">
                  <XCircle className="h-6 w-6 text-rose-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-rose-400">Document Modified / Tampered ❌</h4>
                    <p className="text-xs text-rose-300/80">
                      Warning: The uploaded file SHA-256 hash does not match the on-chain passport record!
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-zinc-900 border border-border">
                    <span className="text-zinc-500 text-[10px] block">ON-CHAIN EXPECTED HASH</span>
                    <span className="text-white break-all">{result.expectedHash}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-900 border border-border">
                    <span className="text-zinc-500 text-[10px] block">CALCULATED FILE HASH</span>
                    <span className="text-rose-400 break-all">{result.calculatedHash}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="pt-4 border-t border-border/50 text-[11px] text-zinc-500 flex items-center justify-between">
            <span>Algorithm: SHA-256 WebCrypto</span>
            <span className="text-monad-purple">Monad Verification</span>
          </div>
        </div>
      </div>
    </div>
  );
};
