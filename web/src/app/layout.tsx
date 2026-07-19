import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Ownly — Own your proof.',
  description: 'Decentralized Digital Product Passport & Document Vault to permanently store all types of documents: invoices, store bills, warranties, receipts, and ownership records on Monad Testnet.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="bg-background text-zinc-100 antialiased selection:bg-monad-purple/30 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
