import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLocalizedPath(path: string, locale: string): string {
  return locale === 'zh' ? path : `/${locale}${path}`
}
