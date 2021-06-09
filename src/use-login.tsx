import { useCallback } from 'react'
import type { FetcherOptions, HookFetcher } from './commerce/utils/types'
import { CommerceError } from './commerce/utils/errors'
import useCommerceLogin from './commerce/use-login'
import type { LoginBody } from './api/customers/login'
import useCustomer from './use-customer'

const defaultOpts = {
  url: '/api/bigcommerce/customers/login',
  method: 'POST',
}

export type LoginInput = LoginBody

export const fetcher: HookFetcher<null, LoginBody> = (
  options,
  { email, password },
  fetch
) => {
  if (!(email && password)) {
    throw new CommerceError({
      message:
        'A first name, last name, email and password are required to login',
    })
  }

  // Use a dummy base as we only care about the relative path
  const url = new URL(options?.url ?? defaultOpts.url, 'http://a')

  return fetch({
    ...defaultOpts,
    ...options,
    url: (options?.base || '') + url.pathname,
    body: { email, password },
  })
}

export function extendHook(customFetcher: typeof fetcher) {

  function useLogin(): (input: LoginInput) => Promise<null>;
  function useLogin<T extends FetcherOptions>({ options }: { options: FetcherOptions } ): T extends FetcherOptions ?
    (input: unknown) => Promise<null> :
    (input: LoginInput) => Promise<null>;

  function useLogin(params?: { options: FetcherOptions }) {
    const options = params?.options || {}
    const { revalidate } = useCustomer()

    const fn = useCommerceLogin<null, LoginInput>(options, customFetcher)

    return useCallback(
      async function login(input: LoginInput) {
        const data = await fn(input)
        await revalidate()
        return data
      },
      [fn]
    )
  }

  useLogin.extend = extendHook

  return useLogin
}

export default extendHook(fetcher)
