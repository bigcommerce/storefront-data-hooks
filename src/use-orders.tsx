import type { HookFetcher } from './commerce/utils/types'
import type { SwrOptions } from './commerce/utils/use-data'
import useData from './commerce/utils/use-data'

import type { Order, OrdersData } from './api/orders'
import useCustomer from './use-customer'

const defaultOpts = {
  url: '/api/bigcommerce/orders',
  method: 'GET',
}

export type { Order }

export interface UseOrdersInput {
  customerId?: number
}

export const fetcher: HookFetcher<Order[] | null, UseOrdersInput> = async (
  options,
  { customerId },
  fetch
) => {
  if (!customerId) return null

  // Use a dummy base as we only care about the relative path
  const url = new URL(options?.url ?? defaultOpts.url, 'http://a')

  url.searchParams.set('customer_id', String(customerId))
  const data = await fetch<OrdersData | null>({
    ...options,
    url: url.pathname + url.search,
    method: options?.method ?? defaultOpts.method,
  })
  return data?.orders ?? null
}

export function extendHook(
  customFetcher: typeof fetcher,
  swrOptions?: SwrOptions<Order[] | null, UseOrdersInput>
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
