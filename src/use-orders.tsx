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

  const data = await fetch<OrdersData | null>({
    ...defaultOpts,
    ...options,
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
