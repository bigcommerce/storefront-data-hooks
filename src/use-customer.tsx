import type { HookFetcher } from './commerce/utils/types'
import type { SwrOptions } from './commerce/utils/use-data'
import useCommerceCustomer from './commerce/use-customer'
import type { Customer, CustomerData } from './api/customers'

const defaultOpts = {
  url: '/api/bigcommerce/customers',
  method: 'GET',
  base: window.location.host,
}

export type { Customer }

export const fetcher: HookFetcher<Customer | null> = async (
  options,
  _,
  fetch
) => {
  const url = new URL(options?.url ?? defaultOpts.url, options?.base ?? defaultOpts.base)
  const data = await fetch<CustomerData | null>({
    ...defaultOpts,
    ...options,
    url: url.href,
  })
  return data?.customer ?? null
}

export function extendHook(
  customFetcher: typeof fetcher,
  swrOptions?: SwrOptions<Customer | null>
) {
  const useCustomer = () => {
    return useCommerceCustomer(defaultOpts, [], customFetcher, {
      revalidateOnFocus: false,
      ...swrOptions,
    })
  }

  useCustomer.extend = extendHook

  return useCustomer
}

export default extendHook(fetcher)
