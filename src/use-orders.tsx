import type { HookFetcher } from './commerce/utils/types'
import type { SwrOptions } from './commerce/utils/use-data'
import useData from './commerce/utils/use-data'

import type { Orders } from './api/orders'
import useCustomer from './use-customer'

const defaultOpts = {
  url: '/api/bigcommerce/orders',
  method: 'GET',
  base: window.location.host,
}

export type { Orders }

export interface UseOrdersInput {
  customerId?: number
}

export const fetcher: HookFetcher<Orders | null, UseOrdersInput> = async (
  options,
  { customerId },
  fetch
) => {
  if (!customerId) return null

  const url = new URL(options?.url ?? defaultOpts.url, options?.base ?? defaultOpts.base)

  return fetch<Orders | null>({
    ...defaultOpts,
    ...options,
    url: url.href,
  })
}

export function extendHook(
  customFetcher: typeof fetcher,
  swrOptions?: SwrOptions<Orders | null, UseOrdersInput>
) {
  const useOrders = () => {
    const { data: customer } = useCustomer()
    return useData(defaultOpts,
      [
        ['customerId', customer?.entityId],
      ],
      customFetcher,
      {
        revalidateOnFocus: false,
        ...swrOptions,
      }
    )
  }

  useOrders.extend = extendHook

  return useOrders
}

export default extendHook(fetcher)
