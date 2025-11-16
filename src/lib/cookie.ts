export function getCookieFromRequest(request: Request, name: string) {
  const cookieHeader = request.headers.get('cookie')
  const cookies = cookieHeader
    ? Object.fromEntries(cookieHeader.split('; ').map(c => c.split('=')))
    : {}
  return cookies[name]
}
