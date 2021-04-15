import isAllowedMethod from "../utils/is-allowed-method"
import createApiHandler, {
	BigcommerceApiHandler,
	BigcommerceHandler,
} from "../utils/create-api-handler"
import { BigcommerceApiError } from "../utils/errors"
import getAddresses from "./handlers/get-addresses"
import addAddress from "./handlers/add-address"
import updateAddress from "./handlers/remove-address"
import removeAddress from "./handlers/update-address"

// This type should match:
// https://developer.bigcommerce.com/api-reference/store-management/customers-v3/customer-addresses/customersaddressesget#responses
// TODO: Double check this
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

export type AddAddressBody = {
	first_name: string
	last_name: string
	company: string
	address1: string
	address2: string
	city: string
	state_or_province: string
	postal_code: string
	country_code: string
	phone: string
	address_type: string
}

export type UpdateAddressBody = {
	first_name: string
	last_name: string
	company: string
	address1: string
	address2: string
	city: string
	state_or_province: string
	postal_code: string
	country_code: string
	phone: string
	address_type: string
	id: number
}

export type RemoveAddressBody = {
	id: number
}

export type AddressHandlers = {
	getAddresses: BigcommerceHandler<Addresses, { customerToken?: string }>
	addAddress: BigcommerceHandler<Address, Partial<AddAddressBody>>
	updateAddress: BigcommerceHandler<Address, Partial<UpdateAddressBody>>
	removeAddress: BigcommerceHandler<null, Partial<Body>>
}

const METHODS = ['GET', 'POST', 'PUT', 'DELETE']

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
		// Return all addresses
		if (req.method === "GET") {
			const body = {
				customerToken,
			}
			return await handlers.getAddresses({ req, res, config, body })
		}
		// Create or add a new address
		if (req.method === 'POST') {
			const body = { ...req.body, cartId }
			return await handlers['addAddress']({ req, res, config, body })
		}

		// Update an existing address
		if (req.method === 'PUT') {
			const body = { ...req.body, cartId }
			return await handlers['updateAddress']({ req, res, config, body })
		}

		// Remove an address
		if (req.method === 'DELETE') {
			const body = { ...req.body, cartId }
			return await handlers['removeAddress']({ req, res, config, body })
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

export const handlers = { getAddresses, addAddress, updateAddress, removeAddress }

export default createApiHandler(addressesApi, handlers, {})
