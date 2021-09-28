import type { ServerResponse } from 'http'
import type { NextApiRequest } from 'next'

import type { LoginMutation, LoginMutationVariables } from '../../schema'
import type { RecursivePartial } from '../utils/types'
import getLoginCookie from '../utils/get-login-cookie'
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

  const cookies = [
    getLoginCookie(res.headers.get('Set-Cookie'), request.headers.host),
    getLoginCookie(
      res.headers.get('Set-Cookie'),
      request.headers.host,
      'SHOP_SESSION_TOKEN'
    ),
    getLoginCookie(
      res.headers.get('Set-Cookie'),
      request.headers.host,
      'Shopper-perf'
    ),
  ].filter((cookie): cookie is string => typeof cookie === 'string')

  response.setHeader('Set-Cookie', cookies)

  return {
    result: data.login?.result,
  }
}

export default login
