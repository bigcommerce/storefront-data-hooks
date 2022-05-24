import { serialize } from 'cookie'
import { LogoutHandlers } from '../logout'
import { getIronSession } from 'iron-session';
import { sessionOptions } from '../../../lib/session';

const logoutHandler: LogoutHandlers['logout'] = async ({
  req: request,
  res,
  body: { redirectTo },
  config,
}) => {
  const { host } = request.headers
  // Remove the cookie
  res.setHeader(
    'Set-Cookie',
    serialize(config.customerCookie, '', { maxAge: -1, path: '/', domain: host?.includes(':') ? host?.slice(0, host.indexOf(':')) : host })
  )

  // kill the session
  const session = await getIronSession(request, res, sessionOptions)
  await session.destroy()

  // Only allow redirects to a relative URL
  if (redirectTo?.startsWith('/')) {
    res.redirect(redirectTo)
  } else {
    res.status(200).json({ data: null })
  }
}

export default logoutHandler
