import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRating(rating: number | null): string {
  if (!rating) return '-'
  return rating.toFixed(1)
}

export function turkishToLatin(str: string): string {
  const map: Record<string, string> = {
    'ç': 'c', 'Ç': 'C', 'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'İ': 'I', 'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S', 'ü': 'u', 'Ü': 'U',
  }
  return str.replace(/[çÇğĞıİöÖşŞüÜ]/g, (char) => map[char] || char)
}

export function slugify(str: string): string {
  return turkishToLatin(str)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getStrapiImageUrl(url: string | null | undefined): string {
  if (!url) return '/placeholder.jpg'
  if (url.startsWith('http')) return url
  return `https://api.tamirhanem.net${url}`
}
