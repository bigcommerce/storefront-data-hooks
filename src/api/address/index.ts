import isAllowedMethod from "../utils/is-allowed-method"
import createApiHandler, {
	BigcommerceApiHandler,
} from "../utils/create-api-handler"
import { BigcommerceApiError } from "../utils/errors"
import getAddresses from "./handlers/get-addresses"
import addAddress from "./handlers/add-address"
import updateAddress from "./handlers/update-address"
import removeAddress from "./handlers/remove-address"

import { AddressesResponse, AddressHandlers } from './types';

const METHODS = ['GET', 'POST', 'PUT', 'DELETE']

const addressesApi: BigcommerceApiHandler<AddressesResponse | null, AddressHandlers> = async (
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
				...req.query,
			}
			return await handlers.getAddresses({ req, res, config, body })
		}
		// Create or add a new address
		if (req.method === 'POST') {
			const body = { ...req.body, customerToken }
			return await handlers['addAddress']({ req, res, config, body })
		}

		// Update an existing address
		if (req.method === 'PUT') {
			const body = { ...req.body, customerToken }
			return await handlers['updateAddress']({ req, res, config, body })
		}

		// Remove an address
		if (req.method === 'DELETE') {
			const body = { ...req.body, customerToken }
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
export * from './types'
export default createApiHandler(addressesApi, handlers, {})
