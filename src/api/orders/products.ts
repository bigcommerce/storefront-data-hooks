import isAllowedMethod from "../utils/is-allowed-method"
import createApiHandler, {
	BigcommerceApiHandler,
	BigcommerceHandler,
} from "../utils/create-api-handler"
import { BigcommerceApiError } from "../utils/errors"
import getOrderProducts from "./handlers/get-order-products"

// This type should match:
// https://developer.bigcommerce.com/api-reference/store-management/orders/orders/getallorders#responses

interface AppliedDiscount {
	id: string;
	amount: string;
	name: string;
	code?: any;
	target: string;
}   

interface ProductOption {
	id: number;
	option_id: number;
	order_product_id: number;
	product_option_id: number;
	display_name: string;
	display_name_customer: string;
	display_name_merchant: string;
	display_value: string;
	display_value_customer: string;
	display_value_merchant: string;
	value: string;
	type: string;
	name: string;
	display_style: string;
}


type Product = {
	id: number;
	order_id: number;
	product_id: number;
	order_address_id: number;
	name: string;
	name_customer: string;
	name_merchant: string;
	sku: string;
	upc: string;
	type: string;
	base_price: string;
	price_ex_tax: string;
	price_inc_tax: string;
	price_tax: string;
	base_total: string;
	total_ex_tax: string;
	total_inc_tax: string;
	total_tax: string;
	weight: string;
	quantity: number;
	base_cost_price: string;
	cost_price_inc_tax: string;
	cost_price_ex_tax: string;
	cost_price_tax: string;
	is_refunded: boolean;
	quantity_refunded: number;
	refund_amount: string;
	return_id: number;
	wrapping_name: string;
	base_wrapping_cost: string;
	wrapping_cost_ex_tax: string;
	wrapping_cost_inc_tax: string;
	wrapping_cost_tax: string;
	wrapping_message: string;
	quantity_shipped: number;
	fixed_shipping_cost: string;
	ebay_item_id: string;
	ebay_transaction_id: string;
	option_set_id?: number;
	parent_order_product_id?: number;
	is_bundled_product: boolean;
	bin_picking_number: string;
	external_id?: any;
	fulfillment_source: string;
	applied_discounts: AppliedDiscount[];
	product_options: ProductOption[];
	configurable_fields: any[];
	event_name?: any;
	event_date?: any;
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
				orderId: 20015,
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
