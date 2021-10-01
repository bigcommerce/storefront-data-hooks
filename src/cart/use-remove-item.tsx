import { useCallback } from 'react'
import { HookFetcher } from '.././commerce/utils/types'
import useCartRemoveItem from '.././commerce/cart/use-remove-item'
import type { RemoveItemBody } from '../api/cart'
import useCart, { Cart, UseCartInput } from './use-cart'

const defaultOpts = {
  url: '/api/bigcommerce/cart',
  method: 'DELETE',
}

export type RemoveItemInput = {
  id: string
}

export const fetcher: HookFetcher<Cart | null, RemoveItemBody> = (
  options,
  { itemId, include },
  fetch
) => {
  // Use a dummy base as we only care about the relative path
  const url = new URL(options?.url ?? defaultOpts.url, 'http://a')
  if (include) url.searchParams.set('include', include)

  return fetch({
    ...defaultOpts,
    ...options,
    url: (options?.base || '') + url.pathname + url.search,
    body: { itemId },
  })
}

export function extendHook(customFetcher: typeof fetcher) {
  const useRemoveItem = (item?: any, input?: UseCartInput) => {
    // TODO; Item should be mandatory and types
    const { mutate } = useCart(input)
    const fn = useCartRemoveItem<Cart | null, RemoveItemBody>(
      defaultOpts,
      customFetcher
    )

    return useCallback(
      async function removeItem({ id: itemId }: RemoveItemInput) {
        const data = await fn({
          itemId: itemId ?? item?.id,
          include: input?.include?.join(','),
        })
        await mutate(data, false)
        return data
      },
      [fn, mutate]
    )
  }

  useRemoveItem.extend = extendHook

  return useRemoveItem
}

export default extendHook(fetcher)
