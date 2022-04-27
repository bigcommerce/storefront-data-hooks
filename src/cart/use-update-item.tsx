import { useCallback } from 'react'
import debounce from 'lodash.debounce'
import type { HookFetcher } from '.././commerce/utils/types'
import { CommerceError } from '.././commerce/utils/errors'
import useCartUpdateItem from '.././commerce/cart/use-update-item'
import type { ItemBody, PhysicalItem, UpdateItemBody } from '../api/cart'
import { fetcher as removeFetcher } from './use-remove-item'
import useCart, { Cart, UseCartInput } from './use-cart'

const defaultOpts = {
  url: '/api/bigcommerce/cart',
  method: 'PUT',
}

export type UpdateItemInput = Partial<{ id: string } & ItemBody>

export const fetcher: HookFetcher<Cart | null, UpdateItemBody> = (
  options,
  { itemId, item, include },
  fetch
) => {
  if (Number.isInteger(item.quantity)) {
    // Also allow the update hook to remove an item if the quantity is lower than 1
    if (item.quantity! < 1) {
      return removeFetcher(null, { itemId }, fetch)
    }
  } else if (item.quantity) {
    throw new CommerceError({
      message: 'The item quantity has to be a valid integer',
    })
  }

  // Use a dummy base as we only care about the relative path
  const url = new URL(options?.url ?? defaultOpts.url, 'http://a')
  if (include) url.searchParams.set('include', include)

  return fetch({
    ...defaultOpts,
    ...options,
    url: (options?.base || '') + url.pathname + url.search,
    body: { itemId, item },
  })
}

function extendHook(customFetcher: typeof fetcher, cfg?: { wait?: number }) {
  const useUpdateItem = (item: PhysicalItem, input?: UseCartInput) => {
    const { mutate } = useCart(input)
    const fn = useCartUpdateItem<Cart | null, UpdateItemBody>(
      defaultOpts,
      customFetcher
    )

    return useCallback(
      async (newItem: UpdateItemInput) => {
        const data = await fn({
          itemId: newItem.id ?? item?.id,
          item: {
            productId: newItem.productId ?? item?.product_id,
            variantId: newItem.variantId ?? item?.variant_id,
            quantity: newItem.quantity,
          },
          include: input?.include?.join(','),
        })
        await mutate(data, false)
        return data
      },
      [fn, mutate]
    )
  }

  useUpdateItem.extend = extendHook

  return useUpdateItem
}

export default extendHook(fetcher)
