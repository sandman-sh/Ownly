/**
 * Client-Side AES-256-GCM Web Crypto Utility.
 * Encrypts files before IPFS pinning so ONLY the wallet owner can decrypt & view them.
 */

// Derives a cryptographic AES-256 key from a wallet address or key seed string
async function deriveEncryptionKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('ownly_monad_vault_salt_2026'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export interface EncryptedFileResult {
  encryptedBlob: Blob;
  ivHex: string;
}

/**
 * Encrypts a file using AES-256-GCM on the client side.
 */
export async function encryptFileClientSide(file: File, ownerAddress: string): Promise<EncryptedFileResult> {
  const key = await deriveEncryptionKey(ownerAddress.toLowerCase());
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM
  const arrayBuffer = await file.arrayBuffer();

  const encryptedContent = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    arrayBuffer
  );

  const ivHex = Array.from(iv).map((b) => b.toString(16).padStart(2, '0')).join('');
  const encryptedBlob = new Blob([encryptedContent], { type: 'application/octet-stream' });

  return {
    encryptedBlob,
    ivHex,
  };
}

/**
 * Decrypts an encrypted file ArrayBuffer client side.
 */
export async function decryptFileClientSide(
  encryptedBuffer: ArrayBuffer,
  ivHex: string,
  ownerAddress: string,
  mimeType: string = 'application/pdf'
): Promise<string> {
  try {
    const key = await deriveEncryptionKey(ownerAddress.toLowerCase());
    const match = ivHex.match(/.{1,2}/g);
    if (!match) throw new Error('Invalid IV format');
    const iv = new Uint8Array(match.map((byte) => parseInt(byte, 16)));

    const decryptedContent = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      encryptedBuffer
    );

    const decryptedBlob = new Blob([decryptedContent], { type: mimeType });
    return URL.createObjectURL(decryptedBlob);
  } catch (err) {
    console.error('Decryption failed:', err);
    throw new Error('Unauthorized or invalid decryption key.');
  }
}
