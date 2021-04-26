import isAllowedMethod from "../utils/is-allowed-method"
import createApiHandler, {
	BigcommerceApiHandler,
	BigcommerceHandler,
} from "../utils/create-api-handler"
import { BigcommerceApiError } from "../utils/errors"
import getOrderProducts from "./handlers/get-order-products"

// This type should match:
// https://developer.bigcommerce.com/api-reference/store-management/orders/order-products/getallorderproducts#responses

export interface Product {
  /**
   * Numeric ID of this product within this order.
   */
  id?: number
  /**
   * Numeric ID of the associated order.
   */
  order_id?: number
  /**
   * Numeric ID of the product.
   */
  product_id?: number
  /**
   * Numeric ID of the associated order address.
   */
  order_address_id?: number
  /**
   * Alias for name_customer - The product name that is shown to customer in storefront.
   */
  name?: string
  /**
   * User-defined product code/stock keeping unit (SKU).
   */
  sku?: string
  /**
   * Type of product
   */
  type?: "physical" | "digital"
  /**
   * The product's base price. (Float, Float-As-String, Integer)
   */
  base_price?: string
  /**
   * The product’s price excluding tax. (Float, Float-As-String, Integer)
   */
  price_ex_tax?: string
  /**
   * The product’s price including tax. (Float, Float-As-String, Integer)
   */
  price_inc_tax?: string
  /**
   * Amount of tax applied to a single product.
   *
   * Price tax is calculated as:
   * `price_tax = price_inc_tax - price_ex_tax`
   *
   * (Float, Float-As-String, Integer)
   */
  price_tax?: string
  /**
   * Total base price. (Float, Float-As-String, Integer)
   */
  base_total?: string
  /**
   * Total base price excluding tax. (Float, Float-As-String, Integer)
   */
  total_ex_tax?: string
  /**
   * Total base price including tax. (Float, Float-As-String, Integer)
   */
  total_inc_tax?: string
  /**
   * Total tax applied to products.
   * For example, if quantity if 2, base price is 5 and tax rate is 10%. price_tax will be $.50 and total_tax will be $1.00.
   *
   * If there is a manual discount applied total_tax is calcuted as the following:
   * `(price_ex_tax - discount)*tax_rate=total_tax`.
   * (Float, Float-As-String, Integer)
   */
  total_tax?: string
  /**
   * Quantity of the product ordered.
   */
  quantity?: number
  /**
   * The product's cost price.  This can be set using the Catalog API. (Float, Float-As-String, Integer) Read Only
   */
  base_cost_price?: string
  /**
   * The product's cost price including tax. (Float, Float-As-String, Integer)
   * The cost of your products to you; this is never shown to customers, but can be used for accounting purposes. Read Only
   */
  cost_price_inc_tax?: string
  /**
   * The products cost price excluding tax. (Float, Float-As-String, Integer)
   * The cost of your products to you; this is never shown to customers, but can be used for accounting purposes. Read Only
   */
  cost_price_ex_tax?: string
  /**
   * Weight of the product. (Float, Float-As-String, Integer)
   */
  weight?: number | string
  /**
   * Tax applied to the product’s cost price. (Float, Float-As-String, Integer)
   * The cost of your products to you; this is never shown to customers, but can be used for accounting purposes. Read Only
   */
  cost_price_tax?: string
  /**
   * Whether the product has been refunded.
   */
  is_refunded?: boolean
  /**
   * The amount refunded from this transaction. (Float, Float-As-String, Integer)
   */
  refunded_amount?: string
  /**
   * Numeric ID for the refund.
   */
  return_id?: number
  /**
   * Name of gift-wrapping option
   */
  wrapping_name?: string
  /**
   * The value of the base wrapping cost. (Float, Float-As-String, Integer)
   */
  base_wrapping_cost?: string | number
  /**
   * The value of the wrapping cost, excluding tax. (Float, Float-As-String, Integer)
   */
  wrapping_cost_ex_tax?: string
  /**
   * The value of the wrapping cost, including tax. (Float, Float-As-String, Integer)
   */
  wrapping_cost_inc_tax?: string
  /**
   * Tax applied to gift-wrapping option. (Float, Float-As-String, Integer)
   */
  wrapping_cost_tax?: string
  /**
   * Message to accompany gift-wrapping option.
   */
  wrapping_message?: string
  /**
   * Quantity of this item shipped.
   */
  quantity_shipped?: number
  /**
   * Name of promotional event/delivery date.
   */
  event_name?: string | null
  /**
   * Date of the promotional event/scheduled delivery.
   */
  event_date?: string | null
  /**
   * Fixed shipping cost for this product. (Float, Float-As-String, Integer)
   */
  fixed_shipping_cost?: string
  /**
   * Item ID for this product on eBay.
   */
  ebay_item_id?: string
  /**
   * Transaction ID for this product on eBay.
   */
  ebay_transaction_id?: string
  /**
   * Numeric ID of the option set applied to the product.
   */
  option_set_id?: number | null
  /**
   * ID of a parent product.
   */
  parent_order_product_id?: number | null
  /**
   * Whether this product is bundled with other products.
   */
  is_bundled_product?: boolean
  /**
   * Bin picking number for the physical product.
   */
  bin_picking_number?: string
  /**
   * Array of objects containing discounts applied to the product.
   */
  applied_discounts?: ProductAppliedDiscount[]
  /**
   * Array of product option objects.
   */
  product_options?: ProductOption[]
  /**
   * ID of the order in another system. For example, the Amazon Order ID if this is an Amazon order.This field can be updated in a /POST, but using a /PUT to update the order will return a 400 error. The field 'external_id' cannot be written to. Please remove it from your request before trying again. It can not be overwritten once set.
   */
  external_id?: string | null
  /**
   * Universal Product Code. Can be written to for custom products and catalog products.
   */
  upc?: string
  /**
   * Products `variant_id`. PUT or POST. This field is not available for custom products.
   */
  variant_id?: number
  /**
   * The product name that is shown to customer in storefront.
   */
  name_customer?: string
  /**
   * The product name that is shown to merchant in Control Panel.
   */
  name_merchant?: string
}
/**
 * When applying a manual discount to an order (not a product level discount), the discount is distributed across products in proportion to the products price.
 * `(total_manual_discount*price_ex_tax)/subtotal_ex_tax`
 */
interface ProductAppliedDiscount {
  /**
   * Name of the coupon applied to order.
   */
  id?: string
  /**
   * Amount of the discount.(Float, Float-As-String, Integer)
   */
  amount?: string
  /**
   * Name of the coupon.
   * `Manual Discount` when creating a manual discount.
   */
  name?: string
  /**
   * Coupon Code.
   * There is no code when creating a manual discount.
   */
  code?: string | null
  /**
   * Determines if the discount if discount was applied at the Order or Product level. Read Only.
   */
  target?: "order" | "product"
  [k: string]: unknown
}
interface ProductOption {
  /**
   * The unique numerical ID of the option; increments sequentially.
   */
  id?: number
  /**
   * Numeric ID of the associated option.
   */
  option_id?: number
  order_product_id?: number
  product_option_id?: number
  /**
   * Alias for display_name_customer. The product option name that is shown to customer in the storefront.
   */
  display_name?: string
  /**
   * Alias for display_value_customer. The product option value that is shown to customer in storefront.
   */
  display_value?: string
  /**
   * This value is used to access the Customer File Upload.
   */
  value?: string
  /**
   * Option Type
   */
  type?:
    | "Checkbox"
    | "Date field"
    | "File Upload"
    | "Multi-line text field"
    | "Multiple choice"
    | "Product Pick List"
    | "Swatch"
    | "Text field"
  /**
   * The option’s name, as used internally. Must be unique.
   */
  name?: string
  /**
   * How it is displayed on the storefront. Examples include Drop-down, radio buttons, or rectangles.
   */
  display_style?: string
  /**
   * The product option name that is shown to customer in storefront.
   */
  display_name_customer?: string
  /**
   * The product option name that is shown to merchant in Control Panel.
   */
  display_name_merchant?: string
  /**
   * The product option value that is shown to customer in storefront.
   */
  display_value_customer?: string
  /**
   * The product option value that is shown to merchant in Control Panel.
   */
  display_value_merchant?: string
}

export type Products = Product[]

export type OrderProductHandlers = {
	getOrderProducts: BigcommerceHandler<Products, { orderId?: number }>
}

const METHODS = ["GET"]

const orderProductsApi: BigcommerceApiHandler<Products, OrderProductHandlers> = async (
	req,
	res,
	config,
	handlers
) => {
	if (!isAllowedMethod(req, res, METHODS)) return

	try {
		// Return current orders info
		if (req.method === "GET") {
			const body = {
				orderId: Number(req.query.order_id)
			}
			return await handlers.getOrderProducts({ req, res, config, body })
		}
	} catch (error) {
		const message =
			error instanceof BigcommerceApiError
				? "An unexpected error ocurred with the Bigcommerce API"
				: "An unexpected error ocurred"

		res.status(500).json({ data: null, errors: [{ message }] })
	}
}

export const handlers = { getOrderProducts }

export default createApiHandler(orderProductsApi, handlers, {})
