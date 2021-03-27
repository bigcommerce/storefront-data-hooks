import { parseCartItem } from '../../utils/parse-item'
import getCartCookie from '../../utils/get-cart-cookie'
import type { CartHandlers } from '..'

// Return current cart info
const addItem: CartHandlers['addItem'] = async ({
  res,
  body: { cartId, locale, item },
  config,
}) => {
  if (!item) {
    return res.status(400).json({
      data: null,
      errors: [{ message: 'Missing item' }],
    })
  }
  if (!item.quantity) item.quantity = 1

  const options = {
    method: 'POST',
    body: JSON.stringify({
      line_items: [parseCartItem(item)],
      ...(!cartId && config.storeChannelId
        ? { channel_id: config.storeChannelId }
        : {}),
      ...(!cartId
        ? { locale }
        : {}),
    }),
  }
  const { data } = cartId
    ? await config.storeApiFetch(`/v3/carts/${cartId}/items?include=line_items.physical_items.options`, options)
    : await config.storeApiFetch('/v3/carts?include=line_items.physical_items.options', options)

  // Create or update the cart cookie
  res.setHeader(
    'Set-Cookie',
    getCartCookie(config.cartCookie, data.id, config.cartCookieMaxAge)
  )
  res.status(200).json({ data })
}

export default addItem
