'use client';

import React from 'react';

interface OwnlyLogoProps {
  className?: string;
  size?: number;
}

export const OwnlyLogoMark: React.FC<OwnlyLogoProps> = ({ className = '', size = 36 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="ownlyGradPrimary" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#836EF9" />
          <stop offset="0.5" stopColor="#A000FF" />
          <stop offset="1" stopColor="#7000FF" />
        </linearGradient>
        <linearGradient id="ownlyGradAccent" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#C4B5FD" />
        </linearGradient>
        <filter id="ownlyGlow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Rounded Outer Container Frame */}
      <rect x="2" y="2" width="44" height="44" rx="14" fill="#111113" stroke="#27272A" strokeWidth="1.5" />

      {/* Inner Monad Gradient Hex-Shield Base */}
      <path
        d="M24 6L39.5885 15V33L24 42L8.41154 33V15L24 6Z"
        fill="url(#ownlyGradPrimary)"
        fillOpacity="0.15"
        stroke="url(#ownlyGradPrimary)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Interlocking 'O' Cryptographic Ownership Seal */}
      <circle cx="24" cy="24" r="10" stroke="url(#ownlyGradPrimary)" strokeWidth="3" strokeDasharray="54 10" />

      {/* Center Proof Check Mark */}
      <path
        d="M19.5 24L22.5 27L28.5 20.5"
        stroke="url(#ownlyGradAccent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#ownlyGlow)"
      />

      {/* Four Monad Corner Nodes */}
      <circle cx="24" cy="10" r="1.5" fill="#836EF9" />
      <circle cx="36" cy="17" r="1.5" fill="#836EF9" />
      <circle cx="36" cy="31" r="1.5" fill="#836EF9" />
      <circle cx="24" cy="38" r="1.5" fill="#836EF9" />
    </svg>
  );
};
