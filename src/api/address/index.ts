import isAllowedMethod from "../utils/is-allowed-method"
import createApiHandler, {
	BigcommerceApiHandler,
	BigcommerceHandler,
} from "../utils/create-api-handler"
import { BigcommerceApiError } from "../utils/errors"
import getAddresses from "./handlers/get-addresses"

// This type should match:
// https://developer.bigcommerce.com/api-reference/store-management/orders/orders/getallorders#responses
export interface Address {
	address1: string
	address2: string
	address_type: string
	city: string
	company: string
	country: string
	country_code: string
	customer_id: number
	first_name: string
	id: number
	last_name: string
	phone: string
	postal_code: string
	state_or_province: string
}

export interface Pagination {
	count: number
	current_page: number
	per_page: number
	total: number
	total_pages: number
}

export interface Meta {
	pagination: Pagination
}

export interface Addresses {
	data?: Address[]
	meta?: Meta
}

export type AddressHandlers = {
	getAddresses: BigcommerceHandler<Addresses, { customerToken?: string }>
}

const METHODS = ["GET"]

const addressesApi: BigcommerceApiHandler<Addresses, AddressHandlers> = async (
	req,
	res,
	config,
	handlers
) => {
	if (!isAllowedMethod(req, res, METHODS)) return

	const { cookies } = req
	const customerToken = cookies[config.customerCookie]

	try {
		// Return current orders info
		if (req.method === "GET") {
			const body = {
				customerToken,
			}
			return await handlers.getAddresses({ req, res, config, body })
		}
	} catch (error) {
		console.error(error)

		const message =
			error instanceof BigcommerceApiError
				? "An unexpected error ocurred with the Bigcommerce API"
				: "An unexpected error ocurred"

		res.status(500).json({ data: null, errors: [{ message }] })
	}
}

export const handlers = { getAddresses }

export default createApiHandler(addressesApi, handlers, {})
