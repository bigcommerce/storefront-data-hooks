import isAllowedMethod from '../utils/is-allowed-method'
import createApiHandler, {
  BigcommerceApiHandler,
  BigcommerceHandler,
} from '../utils/create-api-handler'
import { BigcommerceApiError } from '../utils/errors'
import getCart from './handlers/get-cart'
import addItem from './handlers/add-item'
import updateItem from './handlers/update-item'
import removeItem from './handlers/remove-item'

type OptionSelections = {
  option_id: number
  option_value: number | string
}

export type ItemBody = {
  productId: number
  variantId?: number
  quantity?: number
  optionSelections?: OptionSelections[]
}

export type AddItemBody = { item: ItemBody; locale?: string; include?: string }

export type UpdateItemBody = {
  itemId: string
  item: ItemBody
  include?: string
}

export type RemoveItemBody = { itemId: string; include?: string }

export type Coupon = {
  code: string
  id: string
  coupon_type: string
  discounted_amount: number
}
export type Discount = {
  id: number
  discounted_amount: number
}
export type Option = {
  name?: string
  name_id?: number
  value?: string
  value_id?: number
}

export type BaseItem = {
  id: string
  variant_id: number
  product_id: number
  sku?: string
  name?: string
  url?: string
  quantity: number
  is_taxable?: boolean
  image_url?: string
  discounts?: Discount[]
  coupons?: Coupon[]
  discount_amount?: number
  coupon_amount?: number
  list_price?: number
  sale_price?: number
  extended_list_price?: number
  extended_sale_price?: number
  options?: Option[]
}

export type CustomItem = {
  id: string
  sku?: string
  name?: string
  quantity?: number
  list_price?: number
  extended_list_price?: number
}

export type PhysicalItem = BaseItem & {
  is_require_shipping?: boolean
  gift_wrapping?: {
    name?: string
    message?: string
    amount?: number
  }
}

export type DigitalItem = BaseItem & {
  download_file_urls?: string[]
  download_page_url?: string
  download_size: string
}

export type Gift_Certificate = {
  id: string
  name: string
  theme: string
  amount: number
  is_taxable?: boolean
  sender: {
    name?: string
    email?: string
  }
  recipient: {
    name?: string
    email?: string
  }
  message?: string
}

// https://developer.bigcommerce.com/api-reference/cart-checkout/server-server-cart-api/cart/getacart#responses
export type Cart = {
  id: string
  parent_id?: string
  customer_id: number
  email: string
  currency: { code: string }
  tax_included: boolean
  base_amount: number
  discount_amount: number
  cart_amount: number
  coupons?: Coupon[]
  discounts?: Discount[]
  line_items: {
    physical_items: PhysicalItem[]
    digital_items: DigitalItem[]
    gift_certificates: Gift_Certificate[]
    custom_items: CustomItem[]
  }
  created_time: string
  updated_time: string
  channel_id: number
  redirect_urls?: {
    cart_url: string
    checkout_url: string
    embedded_checkout_url?: string
  }
}

export type CartHandlers = {
  getCart: BigcommerceHandler<Cart, { cartId?: string; include?: string }>
  addItem: BigcommerceHandler<Cart, { cartId?: string } & Partial<AddItemBody>>
  updateItem: BigcommerceHandler<
    Cart,
    { cartId?: string } & Partial<UpdateItemBody>
  >
  removeItem: BigcommerceHandler<
    Cart,
    { cartId?: string } & Partial<RemoveItemBody>
  >
}

const METHODS = ['GET', 'POST', 'PUT', 'DELETE']

// TODO: a complete implementation should have schema validation for `req.body`
const cartApi: BigcommerceApiHandler<Cart, CartHandlers> = async (
  req,
  res,
  config,
  handlers
) => {
  if (!isAllowedMethod(req, res, METHODS)) return

  const { cookies } = req
  const cartId = cookies[config.cartCookie]
  const include =
    typeof req.query.include === 'string' ? req.query.include : undefined

  try {
    // Return current cart info
    if (req.method === 'GET') {
      const body = { cartId, include }
      return await handlers['getCart']({ req, res, config, body })
    }

    // Create or add an item to the cart
    if (req.method === 'POST') {
      const body = { ...req.body, cartId, include }
      return await handlers['addItem']({ req, res, config, body })
    }

    // Update item in cart
    if (req.method === 'PUT') {
      const body = { ...req.body, cartId, include }
      return await handlers['updateItem']({ req, res, config, body })
    }

    // Remove an item from the cart
    if (req.method === 'DELETE') {
      const body = { ...req.body, cartId, include }
      return await handlers['removeItem']({ req, res, config, body })
    }
  } catch (error) {
    console.error(error)

    const message =
      error instanceof BigcommerceApiError
        ? 'An unexpected error ocurred with the Bigcommerce API'
        : 'An unexpected error ocurred'

    res.status(500).json({ data: null, errors: [{ message }] })
  }
}

export const handlers = { getCart, addItem, updateItem, removeItem }

export default createApiHandler(cartApi, handlers, {})
