export default function getLoginCookie(
  setCookieHeader: string | null,
  host: string | undefined,
  cookieKey = 'SHOP_TOKEN'
): string | null {
  if (!setCookieHeader) return null
  const cookies: string[] = setCookieHeader.split(/, (?=[^;]+=[^;]+;)/)
  let cookie =
    cookies.find((cookie) => cookie.startsWith(`${cookieKey}=`)) || null

  if (!cookie) return null
  // Set the cookie at TLD to make it accessible on subdomains (embedded checkout)
  cookie =
    cookie +
    `; Domain=${host?.includes(':') ? host?.slice(0, host.indexOf(':')) : host}`

  // In development, don't set a secure cookie or the browser will ignore it
  if (process.env.NODE_ENV !== 'production') {
    cookie = cookie.replace(/; Secure/gi, '')
    // SameSite=none can't be set unless the cookie is Secure
    // bc seems to sometimes send back SameSite=None rather than none so make
    // this case insensitive
    cookie = cookie.replace(/; SameSite=none/gi, '; SameSite=lax')
  }
  return cookie
}
