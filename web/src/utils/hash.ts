/**
 * Computes SHA-256 hash of a file or text using standard Web Crypto API.
 * Returns bytes32 formatted hex string (0x...).
 */
export async function calculateFileSha256(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hexString = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return `0x${hexString}`;
}

export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

export function calculateWarrantyDaysLeft(expiryDateStr: string): number {
  if (!expiryDateStr) return 0;
  const expiry = new Date(expiryDateStr).getTime();
  const now = new Date().getTime();
  const diffTime = expiry - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getWarrantyStatus(expiryDateStr: string): 'active' | 'expiring' | 'expired' {
  const daysLeft = calculateWarrantyDaysLeft(expiryDateStr);
  if (daysLeft <= 0) return 'expired';
  if (daysLeft <= 30) return 'expiring';
  return 'active';
}
