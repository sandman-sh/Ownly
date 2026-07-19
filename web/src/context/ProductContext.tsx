'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ServiceRecord, OwnershipHistoryItem } from '@/types/product';
import { calculateFileSha256 } from '@/utils/hash';

interface ProductContextType {
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'isDeleted' | 'serviceRecords' | 'ownershipHistory'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  transferOwnership: (productId: string, newOwnerAddress: string) => Promise<void>;
  addServiceRecord: (productId: string, record: Omit<ServiceRecord, 'id' | 'productId' | 'timestamp'>) => Promise<void>;
  deleteProduct: (productId: string) => void;
  verifyFileIntegrity: (productId: string, file: File) => Promise<{ matches: boolean; expectedHash: string; calculatedHash: string }>;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
}

const INITIAL_DEMO_PRODUCTS: Product[] = [
  {
    id: '1',
    owner: '0x836EF9A5202610143eDF823565F36a56f0836EF9',
    name: 'Digital ID & Driver License',
    brand: 'State Identity / Gov',
    category: 'ID & Identity Cards',
    purchaseDate: '2024-01-10',
    warrantyExpiry: '2029-01-10',
    storeName: 'Government Registry',
    serialNumber: 'ID-99201-US',
    purchasePrice: 'Vault Backed',
    notes: 'Official Encrypted ID Card & Driving License Copy. AES-256 Protected.',
    ipfsInvoiceCid: 'bafybeigx7q53nvzplq2n4m3p32y5z7w8k9l0m1n2o3p4q5r6s7t',
    ipfsImageCid: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
    ipfsWarrantyCid: 'bafybeih8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r',
    fileHash: '0x9f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 100,
    isDeleted: false,
    serviceRecords: [],
    ownershipHistory: [
      {
        fromOwner: '0x0000000000000000000000000000000000000000',
        toOwner: '0x836EF9A5202610143eDF823565F36a56f0836EF9',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 100,
      },
    ],
  },
  {
    id: '2',
    owner: '0x836EF9A5202610143eDF823565F36a56f0836EF9',
    name: 'MacBook Pro 16" M3 Max Invoice',
    brand: 'Apple',
    category: 'Invoices & Store Bills',
    purchaseDate: '2024-01-15',
    warrantyExpiry: '2027-01-15',
    storeName: 'Apple Store Regent St',
    serialNumber: 'C02FX911MD6R',
    purchasePrice: '$3,499.00',
    notes: 'Store Bill & AppleCare+ Receipt attached.',
    ipfsInvoiceCid: 'bafybeigx7q53nvzplq2n4m3p32y5z7w8k9l0m1n2o3p4q5r6s7t',
    ipfsImageCid: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000',
    ipfsWarrantyCid: 'bafybeih8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r',
    fileHash: '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 180,
    isDeleted: false,
    serviceRecords: [
      {
        id: 's1',
        productId: '2',
        date: '2024-06-10',
        serviceCenter: 'Apple Authorized Service Provider',
        description: 'Screen replacement under AppleCare+ due to subtle anti-reflective coating issue.',
        ipfsReceiptCid: 'bafybeia1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v',
        receiptHash: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 30,
      },
    ],
    ownershipHistory: [
      {
        fromOwner: '0x0000000000000000000000000000000000000000',
        toOwner: '0x836EF9A5202610143eDF823565F36a56f0836EF9',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 180,
      },
    ],
  },
  {
    id: '3',
    owner: '0x836EF9A5202610143eDF823565F36a56f0836EF9',
    name: 'Sony A7 IV Warranty Card',
    brand: 'Sony',
    category: 'Warranty & Insurance',
    purchaseDate: '2023-11-20',
    warrantyExpiry: '2024-11-20',
    storeName: 'B&H Photo Video',
    serialNumber: 'SN-7789012',
    purchasePrice: '$2,498.00',
    notes: 'Official Sony Protection Warranty Card attached.',
    ipfsInvoiceCid: 'bafybeic9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f',
    ipfsImageCid: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000',
    ipfsWarrantyCid: 'bafybeif0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c',
    fileHash: '0xa41b3294cf768b918197aa56b1076f8271ee94582845c9c1050e051a89b88231',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 240,
    isDeleted: false,
    serviceRecords: [],
    ownershipHistory: [
      {
        fromOwner: '0x0000000000000000000000000000000000000000',
        toOwner: '0x836EF9A5202610143eDF823565F36a56f0836EF9',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 240,
      },
    ],
  },
];

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ownly_products_v2');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved products:', e);
        }
      }
    }
    return INITIAL_DEMO_PRODUCTS;
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ownly_products_v2', JSON.stringify(products));
    }
  }, [products]);

  const addProduct = async (
    productData: Omit<Product, 'id' | 'createdAt' | 'isDeleted' | 'serviceRecords' | 'ownershipHistory'>
  ): Promise<Product> => {
    const newId = (Date.now() + Math.floor(Math.random() * 1000)).toString();
    const newProduct: Product = {
      ...productData,
      id: newId,
      createdAt: Date.now(),
      isDeleted: false,
      serviceRecords: [],
      ownershipHistory: [
        {
          fromOwner: '0x0000000000000000000000000000000000000000',
          toOwner: productData.owner || '0x836EF9A5202610143eDF823565F36a56f0836EF9',
          timestamp: Date.now(),
        },
      ],
    };

    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    if (selectedProduct && selectedProduct.id === id) {
      setSelectedProduct((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const transferOwnership = async (productId: string, newOwnerAddress: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedHistory: OwnershipHistoryItem[] = [
            ...p.ownershipHistory,
            {
              fromOwner: p.owner,
              toOwner: newOwnerAddress,
              timestamp: Date.now(),
            },
          ];
          return {
            ...p,
            owner: newOwnerAddress,
            ownershipHistory: updatedHistory,
          };
        }
        return p;
      })
    );

    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          owner: newOwnerAddress,
          ownershipHistory: [
            ...prev.ownershipHistory,
            {
              fromOwner: prev.owner,
              toOwner: newOwnerAddress,
              timestamp: Date.now(),
            },
          ],
        };
      });
    }
  };

  const addServiceRecord = async (
    productId: string,
    record: Omit<ServiceRecord, 'id' | 'productId' | 'timestamp'>
  ) => {
    const serviceId = `s_${Date.now()}`;
    const newRecord: ServiceRecord = {
      ...record,
      id: serviceId,
      productId,
      timestamp: Date.now(),
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            serviceRecords: [newRecord, ...p.serviceRecords],
          };
        }
        return p;
      })
    );

    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct((prev) =>
        prev
          ? {
              ...prev,
              serviceRecords: [newRecord, ...prev.serviceRecords],
            }
          : null
      );
    }
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct(null);
    }
  };

  const verifyFileIntegrity = async (productId: string, file: File) => {
    const calculatedHash = await calculateFileSha256(file);
    const targetProduct = products.find((p) => p.id === productId);
    const expectedHash = targetProduct?.fileHash || '0x';
    const matches = calculatedHash.toLowerCase() === expectedHash.toLowerCase();

    return {
      matches,
      expectedHash,
      calculatedHash,
    };
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        transferOwnership,
        addServiceRecord,
        deleteProduct,
        verifyFileIntegrity,
        selectedProduct,
        setSelectedProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
