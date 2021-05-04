import type { ServerResponse } from 'http'
import type { NextApiRequest } from 'next'

import type { LoginMutation, LoginMutationVariables } from '../../schema'
import type { RecursivePartial } from '../utils/types'
import concatHeader from '../utils/concat-cookie'
import { BigcommerceConfig, getConfig } from '..'

export const loginMutation = /* GraphQL */ `
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      result
    }
  }
`

export type LoginResult<T extends { result?: any } = { result?: string }> = T

export type LoginVariables = LoginMutationVariables

async function login(opts: {
  variables: LoginVariables
  config?: BigcommerceConfig
  req: NextApiRequest
  res: ServerResponse
}): Promise<LoginResult>

async function login<T extends { result?: any }, V = any>(opts: {
  query: string
  variables: V
  req: NextApiRequest
  res: ServerResponse
  config?: BigcommerceConfig
}): Promise<LoginResult<T>>

async function login({
  query = loginMutation,
  variables,
  req: request,
  res: response,
  config,
}: {
  query?: string
  variables: LoginVariables
  req: NextApiRequest
  res: ServerResponse
  config?: BigcommerceConfig
}): Promise<LoginResult> {
  config = getConfig(config)

  const { data, res } = await config.fetch<RecursivePartial<LoginMutation>>(
    query,
    { variables }
  )
  function getCookie(header: string | null, cookieKey: string) {
  if (!header) return null
    const cookies : string[] = header.split(/, (?=[^;]+=[^;]+;)/)
  return cookies.find(cookie => cookie.startsWith(`${cookieKey}=`))
}
  // Set-Cookie returns several cookies, we only want SHOP_TOKEN
    let shopToken = getCookie(res.headers.get('Set-Cookie'), 'SHOP_TOKEN')

    if (shopToken && typeof shopToken === 'string') {
      const { host } = request.headers
      // OPTIONAL: Set the cookie at TLD to make it accessible on subdomains (embedded checkout)
      shopToken = shopToken + `; Domain=${host?.includes(':') ? host?.slice(0, host.indexOf(':')) : host}`

      if (process.env.NODE_ENV !== 'production') {
        shopToken = shopToken.replace(/; Secure/gi, '')
        shopToken = shopToken.replace(/; SameSite=none/gi, '; SameSite=lax')
      }
      response.setHeader(
        'Set-Cookie',
        concatHeader(response.getHeader('Set-Cookie'), shopToken)!
      )
    }

  return {
    result: data.login?.result,
  }
}

export default login
