import isAllowedMethod from '../utils/is-allowed-method'
import createApiHandler, {
  BigcommerceApiHandler,
  BigcommerceHandler,
} from '../utils/create-api-handler'
import { BigcommerceApiError } from '../utils/errors'
import getOrders from './handlers/get-orders'

type FormField = {
  name: string,
  value: string,
}

// This type should match:
// https://developer.bigcommerce.com/api-reference/store-management/orders/orders/getallorders#responses
type Order = {
  id: number,
  date_modified: string,
  date_shipped: string,
  cart_id: string,
  status: string,
  subtotal_tax: string,
  shipping_cost_tax: string,
  shipping_cost_tax_class_id: number,
  handling_cost_tax: string,
  handling_cost_tax_class_id: number,
  wrapping_cost_tax: string,
  wrapping_cost_tax_class_id: number,
  payment_status: "authorized" | "captured" | "capture pending" | "declined" | "held for review" | "paid" | "partially refunded" | "pending" | "refunded" | "void" | "void pending",
  store_credit_amount:  string,
  gift_certificate_amount: string,
  currency_id:  number,
  currency_code: string,
  currency_exchange_rate:  string,
  default_currency_id: number,
  coupon_discount: string,
  shipping_address_count: number,
  is_email_opt_in:boolean,
  order_source: string,
  products: {
    url: string,
    resource: string,
  },
  shipping_addresses: {
    url: string,
    resource: string,
  },
  coupons: {
    url: string,
    resource: string,
  },
  status_id: number,
  billing_address: {
      first_name: string,
      last_name: string,
      company: string,
      street_1: string,
      street_2: string,
      city: string,
      state: string,
      zip: number,
      country: string,
      country_iso2: string,
      phone: number
      email: string,
      form_fields: FormField[],
  },
  subtotal_ex_tax: string,
  subtotal_inc_tax: string,
  base_shipping_cost:string,
  shipping_cost_ex_tax: string,
  shipping_cost_inc_tax: string,
  base_handling_cost: string,
  handling_cost_ex_tax: string,
  handling_cost_inc_tax: string,
  base_wrapping_cost: string,
  wrapping_cost_ex_tax: string,
  wrapping_cost_inc_tax:  string,
  total_ex_tax: string,
  total_inc_tax: string,
  items_total:  number,
  items_shipped: number,
  payment_method: string,
  payment_provider_id?: string | number,
  refunded_amount: string,
  order_is_digital: boolean,
  ip_address: string,
  geoip_country: string,
  geoip_country_iso2:  string,
  staff_notes: string,
  customer_message: string,
  discount_amount:  string,
  is_deleted:  boolean,
  ebay_order_id?:string,
  external_source: string | null,
  external_id:  string | null,
  channel_id: number,
  tax_provider_id: string,
  date_created: string,
  default_currency_code: string,
}

export type Orders =  Order[]

export type OrdersHandlers = {
  getOrders: BigcommerceHandler<Orders, { customerToken?: string }>
}

const METHODS = ['GET']

const ordersApi: BigcommerceApiHandler<
  Orders,
  OrdersHandlers
> = async ( req, res, config, handlers) => {
  if (!isAllowedMethod(req, res, METHODS)) return

  const { cookies } = req
  const customerToken = cookies[config.customerCookie]


  try {
    // Return current orders info
    if (req.method === 'GET') {
      const body = {
        customerToken,
      }
      return await handlers['getOrders']({ req, res, config, body })
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

export const handlers = { getOrders }

export default createApiHandler(ordersApi, handlers, {})
