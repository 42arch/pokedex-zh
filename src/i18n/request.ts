import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
  return {
    locale: 'zh',
    messages: (await import('../../messages/zh.json')).default,
  }
})
