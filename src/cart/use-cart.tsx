import type { HookFetcher } from '.././commerce/utils/types'
import type { SwrOptions } from '.././commerce/utils/use-data'
import useCommerceCart, { CartInput } from '.././commerce/cart/use-cart'
import type { Cart } from '../api/cart'

const defaultOpts = {
  url: '/api/bigcommerce/cart',
  method: 'GET',
}

export type { Cart }

export type UseCartInput = {
  include?:  ("redirect_urls" |"line_items.physical_items.options" |"line_items.digital_items.options")[]
}

export const fetcher: HookFetcher<Cart | null, CartInput> = (
  options,
  { cartId, include },
  fetch
) => {
  if (!cartId) return null
  // Use a dummy base as we only care about the relative path
  const url = new URL(options?.url ?? defaultOpts.url, 'http://a')
  if (include) url.searchParams.set('include', include)

  return fetch({
    ...defaultOpts,
    ...options,
    url: (options?.base || '') + url.pathname + url.search,
  })
}

export function extendHook(
  customFetcher: typeof fetcher,
  swrOptions?: SwrOptions<Cart | null, CartInput>
) {
  const useCart = (input?: UseCartInput) => {
    const response = useCommerceCart(defaultOpts, [
      ['include', input?.include?.join(',')]
    ], customFetcher, {
      revalidateOnFocus: false,
      ...swrOptions,
    })

    // Uses a getter to only calculate the prop when required
    // response.data is also a getter and it's better to not trigger it early
    Object.defineProperty(response, 'isEmpty', {
      get() {
        return Object.values(response.data?.line_items ?? {}).every(
          (items) => !items.length
        )
      },
      set: (x) => x,
    })

    return response
  }

  useCart.extend = extendHook

  return useCart
}

export default extendHook(fetcher)
