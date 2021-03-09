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
  // Bigcommerce returns a Set-Cookie header with the auth cookie
  let cookie = res.headers.get('Set-Cookie')

  if (cookie && typeof cookie === 'string') {
    const { host } = request.headers
    // Set the a TLD cookie to make it accessible on subdomains
    cookie = cookie + `; Domain=${host?.includes(':') ? host?.slice(0, host.indexOf(':')) : host}`

    // In development, don't set a secure cookie or the browser will ignore it
    if (process.env.NODE_ENV !== 'production') {
      cookie = cookie.replace('; Secure', '')
      // SameSite=none can't be set unless the cookie is Secure
      // bc seems to sometimes send back SameSite=None rather than none so make
      // this case insensitive
      cookie = cookie.replace(/; SameSite=none/gi, '; SameSite=lax')
    }

    response.setHeader(
      'Set-Cookie',
      concatHeader(response.getHeader('Set-Cookie'), cookie)!
    )
  }

  return {
    result: data.login?.result,
  }
}

export default login
