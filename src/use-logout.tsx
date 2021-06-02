import { useCallback } from 'react'
import type { HookFetcher } from './commerce/utils/types'
import useCommerceLogout from './commerce/use-logout'
import useCustomer from './use-customer'

const defaultOpts = {
  url: '/api/bigcommerce/customers/logout',
  method: 'POST',
  base: window.location.host,
}

export const fetcher: HookFetcher<null> = (options, _, fetch) => {
  const url = new URL(options?.url ?? defaultOpts.url, options?.base ?? defaultOpts.base)

  return fetch({
    ...defaultOpts,
    ...options,
    url: url.href,
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
