'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/types/product';
import { calculateWarrantyDaysLeft, getWarrantyStatus, formatAddress } from '@/utils/hash';
import { ShieldCheck, Clock, FileText, Wrench, ArrowLeftRight, Trash2, ExternalLink, CheckCircle } from 'lucide-react';
import { getIpfsUrl } from '@/services/ipfs';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onTransfer: (product: Product) => void;
  onAddService: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onTransfer,
  onAddService,
  onDelete,
}) => {
  const daysLeft = calculateWarrantyDaysLeft(product.warrantyExpiry);
  const status = getWarrantyStatus(product.warrantyExpiry);

  const getStatusBadge = () => {
    if (status === 'active') {
      return (
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Active ({daysLeft} days left)
        </span>
      );
    }
    if (status === 'expiring') {
      return (
        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-semibold flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Expiring Soon ({daysLeft} days)
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-semibold flex items-center gap-1">
        Expired Warranty
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-2xl bg-card border border-border overflow-hidden shadow-lg hover:border-monad-purple/50 transition-all flex flex-col justify-between"
    >
      <div>
        {/* Product Image Banner */}
        <div className="relative h-48 w-full bg-zinc-950 overflow-hidden cursor-pointer" onClick={() => onSelect(product)}>
          <img
            src={getIpfsUrl(product.ipfsImageCid)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
            onError={(e) => {
              // Fallback image if user uploaded custom non-existing path
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

          {/* Top Status & Category */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <span className="px-2.5 py-1 rounded-full bg-zinc-900/90 text-zinc-300 border border-border text-[10px] font-semibold backdrop-blur-md">
              {product.category}
            </span>
            {getStatusBadge()}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3">
          <div className="cursor-pointer" onClick={() => onSelect(product)}>
            <p className="text-[11px] font-semibold text-monad-purple uppercase tracking-wider">{product.brand}</p>
            <h3 className="text-base font-bold text-white group-hover:text-monad-purple transition-colors truncate">
              {product.name}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-border/60">
            <div>
              <span className="text-zinc-500 block">STORE</span>
              <span className="text-zinc-300 font-medium truncate block">{product.storeName}</span>
            </div>
            <div>
              <span className="text-zinc-500 block">SERIAL NO.</span>
              <span className="text-zinc-300 font-mono font-medium truncate block">{product.serialNumber}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400 bg-zinc-950/60 p-2.5 rounded-xl border border-border/80">
            <span>Price: <strong className="text-white">{product.purchasePrice}</strong></span>
            <span className="flex items-center gap-1 text-monad-purple">
              <CheckCircle className="h-3 w-3" />
              {product.serviceRecords.length} Service Logs
            </span>
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-4 bg-zinc-950/40 border-t border-border flex items-center justify-between gap-2 text-xs">
        <button
          onClick={() => onSelect(product)}
          className="flex-1 py-2 px-3 rounded-xl bg-monad-purple/10 hover:bg-monad-purple/20 text-monad-purple border border-monad-purple/30 font-semibold transition-colors flex items-center justify-center gap-1 text-xs"
        >
          View Passport
        </button>

        <button
          onClick={() => onTransfer(product)}
          title="Transfer Ownership"
          className="p-2 rounded-xl bg-zinc-900 border border-border text-zinc-300 hover:text-white hover:border-monad-purple transition-colors"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </button>

        <button
          onClick={() => onAddService(product)}
          title="Add Service Log"
          className="p-2 rounded-xl bg-zinc-900 border border-border text-zinc-300 hover:text-white hover:border-monad-purple transition-colors"
        >
          <Wrench className="h-4 w-4" />
        </button>

        <button
          onClick={() => onDelete(product.id)}
          title="Delete Passport"
          className="p-2 rounded-xl bg-zinc-900 border border-border text-zinc-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};
