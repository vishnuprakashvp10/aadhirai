import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ADR-${timestamp}-${random}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + '…' : str;
}

export function getDiscountPercent(price: number, comparePrice: number): number {
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

export function shimmerDataURL(w: number, h: number) {
  const shimmer = `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#f0ece3" offset="20%" />
          <stop stop-color="#e8e0d0" offset="50%" />
          <stop stop-color="#f0ece3" offset="70%" />
        </linearGradient>
        <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
          <animateTransform attributeName="gradientTransform" type="translate" from="-2 0" to="2 0" dur="1.5s" repeatCount="indefinite" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#g)" />
    </svg>`;
  const toBase64 = (str: string) =>
    typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);
  return `data:image/svg+xml;base64,${toBase64(shimmer)}`;
}
