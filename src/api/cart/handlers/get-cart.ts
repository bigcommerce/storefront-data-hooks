import { BigcommerceApiError } from '../../utils/errors'
import getCartCookie from '../../utils/get-cart-cookie'
import type { Cart, CartHandlers } from '..'

// Return current cart info
const getCart: CartHandlers['getCart'] = async ({
  res,
  body: { cartId, include },
  config,
}) => {
  let result: { data?: Cart } = {}

  if (cartId) {
    try {
      // Use a dummy base as we only care about the relative path
      const url = new URL(`/v3/carts/${cartId}`, 'http://a')
      if (include) url.searchParams.set('include', include)

      result = await config.storeApiFetch(url.pathname + url.search)
    } catch (error) {
      if (error instanceof BigcommerceApiError && error.status === 404) {
        // Remove the cookie if it exists but the cart wasn't found
        res.setHeader('Set-Cookie', getCartCookie(config.cartCookie))
      } else {
        throw error
      }
    }
  }

  res.status(200).json({ data: result.data ?? null })
}

export default getCart
