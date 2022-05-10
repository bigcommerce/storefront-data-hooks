// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import type { IronSessionOptions } from 'iron-session'

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'iron-session/storefront-data-hooks',
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    // domain, if you want the cookie to be valid for the whole domain and subdomains, use domain: example.com
  },
}

declare module "iron-session" {
  interface IronSessionData {
    // the customer entity id fron login graphql query
    customerId: number
    // a customer impoersonation token, to be used in concert with the customerId
    token: string
  }
}
