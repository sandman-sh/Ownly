'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types/product';
import { calculateWarrantyDaysLeft, getWarrantyStatus, formatAddress } from '@/utils/hash';
import { getIpfsUrl } from '@/services/ipfs';
import {
  X,
  FileText,
  ShieldCheck,
  Download,
  ExternalLink,
  ArrowLeftRight,
  Wrench,
  Trash2,
  QrCode,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  History,
  Copy,
  Check,
} from 'lucide-react';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onTransfer: (product: Product) => void;
  onAddService: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onTransfer,
  onAddService,
  onDelete,
}) => {
  const [showQr, setShowQr] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const daysLeft = calculateWarrantyDaysLeft(product.warrantyExpiry);
  const status = getWarrantyStatus(product.warrantyExpiry);

  const handleGenerateQr = async () => {
    try {
      const passportUrl = `${window.location.origin}/#passport-${product.id}`;
      const url = await QRCode.toDataURL(passportUrl, { width: 300, margin: 2, color: { dark: '#836EF9', light: '#09090B' } });
      setQrDataUrl(url);
      setShowQr(true);
    } catch (err) {
      console.error('QR code error:', err);
    }
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(`Digital Product Passport: ${product.name}`, 14, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Brand: ${product.brand}`, 14, 32);
    doc.text(`Serial Number: ${product.serialNumber}`, 14, 38);
    doc.text(`Store: ${product.storeName}`, 14, 44);
    doc.text(`Purchase Date: ${product.purchaseDate}`, 14, 50);
    doc.text(`Warranty Expiry: ${product.warrantyExpiry}`, 14, 56);
    doc.text(`Price: ${product.purchasePrice}`, 14, 62);
    doc.text(`SHA-256 Hash: ${product.fileHash}`, 14, 68);
    doc.text(`Monad Testnet Owner: ${product.owner}`, 14, 74);

    doc.save(`${product.name.replace(/\s+/g, '_')}_Ownly_Passport.pdf`);
  };

  const copyHash = () => {
    navigator.clipboard.writeText(product.fileHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl rounded-2xl bg-card border border-border p-6 sm:p-8 shadow-2xl my-8 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-border pb-4">
            <div>
              <span className="text-xs font-bold text-monad-purple uppercase tracking-wider">{product.brand}</span>
              <h2 className="text-2xl font-extrabold text-white">{product.name}</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Passport ID: #{product.id} • Monad Testnet Registered</p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportPdf}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-border text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <FileSpreadsheet className="h-4 w-4 text-monad-purple" />
                Export PDF
              </button>
              <button
                onClick={handleGenerateQr}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-border text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <QrCode className="h-4 w-4 text-monad-purple" />
                QR Code
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Image & Details */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-zinc-950 border border-border">
                <img
                  src={getIpfsUrl(product.ipfsImageCid)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000';
                  }}
                />
              </div>

              {/* Document CIDs */}
              <div className="rounded-xl bg-zinc-950/80 border border-border p-4 space-y-2 text-xs">
                <span className="font-semibold text-zinc-300 block">IPFS Proof References</span>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Invoice PDF:</span>
                  <a
                    href={getIpfsUrl(product.ipfsInvoiceCid)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-monad-purple hover:underline flex items-center gap-1 font-mono text-[11px]"
                  >
                    View Invoice <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Warranty Card:</span>
                  <a
                    href={getIpfsUrl(product.ipfsWarrantyCid)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-monad-purple hover:underline flex items-center gap-1 font-mono text-[11px]"
                  >
                    View Card <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="flex items-center justify-between text-zinc-400 pt-1 border-t border-border/50">
                  <span>SHA-256 Hash:</span>
                  <button onClick={copyHash} className="flex items-center gap-1 text-zinc-300 font-mono text-[10px] hover:text-white">
                    {product.fileHash.substring(0, 10)}...{product.fileHash.substring(product.fileHash.length - 6)}
                    {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Specs & Timelines */}
            <div className="lg:col-span-6 space-y-6">
              {/* Warranty Status Banner */}
              <div className="rounded-xl bg-zinc-950 border border-monad-purple/30 p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase text-zinc-500">WARRANTY COUNTDOWN</span>
                  <h4 className="text-lg font-bold text-white mt-0.5">
                    {daysLeft > 0 ? `${daysLeft} Days Remaining` : 'Warranty Expired'}
                  </h4>
                </div>
                <span className="px-3 py-1 rounded-full bg-monad-purple/15 text-monad-purple border border-monad-purple/30 text-xs font-bold">
                  {status.toUpperCase()}
                </span>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-zinc-950/60 border border-border p-3">
                  <span className="text-zinc-500 block text-[10px]">STORE NAME</span>
                  <span className="font-semibold text-zinc-200">{product.storeName}</span>
                </div>
                <div className="rounded-xl bg-zinc-950/60 border border-border p-3">
                  <span className="text-zinc-500 block text-[10px]">SERIAL NUMBER</span>
                  <span className="font-semibold text-zinc-200 font-mono">{product.serialNumber}</span>
                </div>
                <div className="rounded-xl bg-zinc-950/60 border border-border p-3">
                  <span className="text-zinc-500 block text-[10px]">PURCHASE DATE</span>
                  <span className="font-semibold text-zinc-200">{product.purchaseDate}</span>
                </div>
                <div className="rounded-xl bg-zinc-950/60 border border-border p-3">
                  <span className="text-zinc-500 block text-[10px]">EXPIRY DATE</span>
                  <span className="font-semibold text-zinc-200">{product.warrantyExpiry}</span>
                </div>
              </div>

              {/* Ownership & Service Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <History className="h-4 w-4 text-monad-purple" />
                  Passport History & Service Records
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {/* Creation event */}
                  <div className="rounded-xl bg-zinc-950/60 border border-border p-3 text-xs flex items-center space-x-3">
                    <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Digital Passport Created</p>
                      <p className="text-[10px] text-zinc-500">Original Owner: {formatAddress(product.owner)}</p>
                    </div>
                  </div>

                  {/* Ownership transfers */}
                  {product.ownershipHistory.map((item, idx) => {
                    if (item.fromOwner === '0x0000000000000000000000000000000000000000') return null;
                    return (
                      <div key={idx} className="rounded-xl bg-zinc-950/60 border border-border p-3 text-xs flex items-center space-x-3">
                        <div className="h-7 w-7 rounded-lg bg-monad-purple/15 text-monad-purple border border-monad-purple/30 flex items-center justify-center shrink-0">
                          <ArrowLeftRight className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">Ownership Transferred</p>
                          <p className="text-[10px] text-zinc-500">
                            {formatAddress(item.fromOwner)} → {formatAddress(item.toOwner)}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {/* Service Records */}
                  {product.serviceRecords.map((srv, idx) => (
                    <div key={idx} className="rounded-xl bg-zinc-950/60 border border-border p-3 text-xs flex items-center space-x-3">
                      <div className="h-7 w-7 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                        <Wrench className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{srv.serviceCenter}</p>
                        <p className="text-[11px] text-zinc-300">{srv.description}</p>
                        <p className="text-[10px] text-zinc-500">Date: {srv.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  onClose();
                  onTransfer(product);
                }}
                className="px-4 py-2.5 rounded-xl bg-monad-purple/10 hover:bg-monad-purple/20 text-monad-purple border border-monad-purple/30 font-semibold flex items-center gap-1.5"
              >
                <ArrowLeftRight className="h-4 w-4" />
                Transfer Ownership
              </button>
              <button
                onClick={() => {
                  onClose();
                  onAddService(product);
                }}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-border text-zinc-200 hover:text-white font-semibold flex items-center gap-1.5"
              >
                <Wrench className="h-4 w-4 text-monad-purple" />
                Add Service Log
              </button>
            </div>

            <button
              onClick={() => {
                onClose();
                onDelete(product.id);
              }}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-border text-rose-400 hover:bg-rose-500/10 font-semibold flex items-center gap-1.5"
            >
              <Trash2 className="h-4 w-4" />
              Delete Passport
            </button>
          </div>

          {/* QR Code Modal Drawer */}
          {showQr && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90">
              <div className="rounded-2xl bg-card border border-border p-6 text-center max-w-sm w-full space-y-4">
                <h3 className="text-base font-bold text-white">Product Passport QR</h3>
                {qrDataUrl && <img src={qrDataUrl} alt="Passport QR" className="mx-auto rounded-xl border border-border" />}
                <p className="text-xs text-zinc-400">Scan QR to verify proof on Monad Testnet</p>
                <button
                  onClick={() => setShowQr(false)}
                  className="w-full py-2 rounded-xl bg-monad-purple text-white text-xs font-bold"
                >
                  Close QR
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
