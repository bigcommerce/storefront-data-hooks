import createApiHandler, {
	BigcommerceApiHandler,
	BigcommerceHandler,
} from "../utils/create-api-handler"
import isAllowedMethod from "../utils/is-allowed-method"
import { BigcommerceApiError } from "../utils/errors"
import addAddress from "./handlers/add-address"
import type { Meta } from "."

export type AddressBody = {
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

export type AddAddressHandlers = {
	addAddress: BigcommerceHandler<null, Partial<AddressBody>>
}

const METHODS = ["POST"]

const signupApi: BigcommerceApiHandler<null, AddAddressHandlers> = async (
	req,
	res,
	config,
	handlers
) => {
	if (!isAllowedMethod(req, res, METHODS)) return

	try {
		const body = req.body
		return await handlers["addAddress"]({ req, res, config, body })
	} catch (error) {
		console.error(error)

		const message =
			error instanceof BigcommerceApiError
				? "An unexpected error ocurred with the Bigcommerce API"
				: "An unexpected error ocurred"

		res.status(500).json({ data: null, errors: [{ message }] })
	}
}

const handlers = { addAddress }

export default createApiHandler(signupApi, handlers, {})
