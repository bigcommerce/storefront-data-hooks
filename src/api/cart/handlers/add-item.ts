import getCustomerId from '../../operations/get-customer-id'
import { parseCartItem } from '../../utils/parse-item'
import getCartCookie from '../../utils/get-cart-cookie'
import type { CartHandlers } from '..'

// Return current cart info
const addItem: CartHandlers['addItem'] = async ({
  res,
  req,
  body: { cartId, locale, item, include },
  config,
}) => {
  if (!item) {
    return res.status(400).json({
      data: null,
      errors: [{ message: 'Missing item' }],
    })
  }
  if (!item.quantity) item.quantity = 1

  const { cookies } = req
  const customerToken = cookies[config.customerCookie]
  const customerId =
    customerToken && (await getCustomerId({ customerToken, config }))

  // Use a dummy base as we only care about the relative path
  const url = new URL(
    cartId ? `/v3/carts/${cartId}/items` : '/v3/carts',
    'http://a'
  )
  if (include) url.searchParams.set('include', include)

  const options = {
    method: 'POST',
    body: JSON.stringify({
      customer_id: customerId,
      line_items: [parseCartItem(item)],
      ...(!cartId && config.storeChannelId
        ? { channel_id: config.storeChannelId }
        : {}),
      ...(!cartId ? { locale } : {}),
    }),
  }
  const { data } = await config.storeApiFetch(
    url.pathname + url.search,
    options
  )

  // Create or update the cart cookie
  res.setHeader(
    'Set-Cookie',
    getCartCookie(config.cartCookie, data.id, config.cartCookieMaxAge)
  )
  res.status(200).json({ data })
}

export default addItem
