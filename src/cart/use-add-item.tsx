import { useCallback } from 'react'
import type { HookFetcher } from '.././commerce/utils/types'
import { CommerceError } from '.././commerce/utils/errors'
import useCartAddItem from '.././commerce/cart/use-add-item'
import type { ItemBody, AddItemBody } from '../api/cart'
import { useCommerce } from '..'
import useCart, { Cart } from './use-cart'

const defaultOpts = {
  url: '/api/bigcommerce/cart',
  method: 'POST',
}

export type AddItemInput = ItemBody

export const fetcher: HookFetcher<Cart, AddItemBody> = (
  options,
  { item, locale },
  fetch
) => {
  if (
    item.quantity &&
    (!Number.isInteger(item.quantity) || item.quantity! < 1)
  ) {
    throw new CommerceError({
      message: 'The item quantity has to be a valid integer greater than 0',
    })
  }

  // Use a dummy base as we only care about the relative path
  const url = new URL(options?.url ?? defaultOpts.url, 'http://a')

  return fetch({
    ...defaultOpts,
    ...options,
    url: (options?.base || '') + url.pathname,
    body: { item, locale },
  })
}

export function extendHook(customFetcher: typeof fetcher) {
  const useAddItem = () => {
    const { mutate } = useCart()
    const { locale } = useCommerce()
    const fn = useCartAddItem(defaultOpts, customFetcher)

    return useCallback(
      async function addItem(input: AddItemInput) {
        const data = await fn({ item: input, locale })
        await mutate(data, false)
        return data
      },
      [fn, mutate]
    )
  }

  useAddItem.extend = extendHook

  return useAddItem
}

export default extendHook(fetcher)
