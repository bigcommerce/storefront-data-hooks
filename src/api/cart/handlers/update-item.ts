import { parseCartItem } from '../../utils/parse-item'
import getCartCookie from '../../utils/get-cart-cookie'
import type { CartHandlers } from '..'

// Return current cart info
const updateItem: CartHandlers['updateItem'] = async ({
  res,
  body: { cartId, itemId, item, include },
  config,
}) => {
  if (!cartId || !itemId || !item) {
    return res.status(400).json({
      data: null,
      errors: [{ message: 'Invalid request' }],
    })
  }

  // Use a dummy base as we only care about the relative path
  const url = new URL(`/v3/carts/${cartId}/items/${itemId}`, 'http://a')
  if (include) url.searchParams.set('include', include)

  const { data } = await config.storeApiFetch(
    url.pathname + url.search,
    {
      method: 'PUT',
      body: JSON.stringify({
        line_item: parseCartItem(item),
      }),
    }
  )

  // Update the cart cookie
  res.setHeader(
    'Set-Cookie',
    getCartCookie(config.cartCookie, cartId, config.cartCookieMaxAge)
  )
  res.status(200).json({ data })
}

export default updateItem
