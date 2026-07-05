export const locales = ['zh', 'zh-Hant'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'zh'
