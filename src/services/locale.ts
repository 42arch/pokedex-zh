'use server'

import type { Locale } from '../i18n/config'
import { cookies } from 'next/headers'
import { defaultLocale, locales } from '../i18n/config'

const COOKIE_NAME = 'NEXT_LOCALE'

export async function getUserLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const val = cookieStore.get(COOKIE_NAME)?.value

  if (!val)
    return defaultLocale

  // Exact match for supported static locales.
  if (locales.includes(val as Locale)) {
    return val as Locale
  }

  return defaultLocale
}

export async function setUserLocale(locale: Locale) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, locale)
}
