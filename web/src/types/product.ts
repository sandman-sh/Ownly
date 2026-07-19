export interface ServiceRecord {
  id: string;
  productId: string;
  date: string;
  serviceCenter: string;
  description: string;
  ipfsReceiptCid: string;
  receiptHash: string;
  timestamp: number;
}

export interface OwnershipHistoryItem {
  fromOwner: string;
  toOwner: string;
  timestamp: number;
}

export type DocumentCategory =
  | 'ID & Identity Cards'
  | 'Invoices & Store Bills'
  | 'Warranty & Insurance'
  | 'Electronics'
  | 'Vehicles & Property'
  | 'Other';

export interface Product {
  id: string;
  owner: string;
  name: string;
  brand: string;
  category: DocumentCategory;
  purchaseDate: string;
  warrantyExpiry: string;
  storeName: string;
  serialNumber: string;
  purchasePrice: string;
  notes: string;
  ipfsInvoiceCid: string;
  ipfsImageCid: string;
  ipfsWarrantyCid: string;
  fileHash: string; // 0x prefixed bytes32 SHA-256 string
  createdAt: number;
  isDeleted: boolean;
  serviceRecords: ServiceRecord[];
  ownershipHistory: OwnershipHistoryItem[];
}

export type ProductFilterStatus = 'all' | 'active' | 'expiring' | 'expired';

export type ProductSortOption = 'newest' | 'oldest' | 'warrantySoon';
