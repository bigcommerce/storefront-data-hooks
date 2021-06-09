import { useCallback } from 'react'
import type { HookFetcher } from './commerce/utils/types'
import useCommerceLogout from './commerce/use-logout'
import useCustomer from './use-customer'

const defaultOpts = {
  url: '/api/bigcommerce/customers/logout',
  method: 'POST',
}

export const fetcher: HookFetcher<null> = (options, _, fetch) => {
  // Use a dummy base as we only care about the relative path
  const url = new URL(options?.url ?? defaultOpts.url, 'http://a')

  return fetch({
    ...defaultOpts,
    ...options,
    url: (options?.base || '') + url.pathname,
  })
}

export function extendHook(customFetcher: typeof fetcher) {
  const useLogout = () => {
    const { mutate } = useCustomer()
    const fn = useCommerceLogout<null>(defaultOpts, customFetcher)

    return useCallback(
      async function login() {
        const data = await fn(null)
        await mutate(null, false)
        return data
      },
      [fn]
    )
  }

  useLogout.extend = extendHook

  return useLogout
}

export default extendHook(fetcher)
