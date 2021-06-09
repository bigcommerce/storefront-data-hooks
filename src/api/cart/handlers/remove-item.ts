import getCartCookie from '../../utils/get-cart-cookie'
import type { CartHandlers } from '..'

// Return current cart info
const removeItem: CartHandlers['removeItem'] = async ({
  res,
  body: { cartId, itemId, include },
  config,
}) => {
  if (!cartId || !itemId) {
    return res.status(400).json({
      data: null,
      errors: [{ message: 'Invalid request' }],
    })
  }

  // Use a dummy base as we only care about the relative path
  const url = new URL(`/v3/carts/${cartId}/items/${itemId}`, 'http://a')
  if (include) url.searchParams.set('include', include)

  const result = await config.storeApiFetch<{ data: any } | null>(
    url.pathname + url.search,
    { method: 'DELETE' }
  )
  const data = result?.data ?? null

  res.setHeader(
    'Set-Cookie',
    data
      ? // Update the cart cookie
        getCartCookie(config.cartCookie, cartId, config.cartCookieMaxAge)
      : // Remove the cart cookie if the cart was removed (empty items)
        getCartCookie(config.cartCookie)
  )
  res.status(200).json({ data })
}

export default removeItem
