import createApiHandler, {
	BigcommerceApiHandler,
	BigcommerceHandler,
} from "../utils/create-api-handler"
import isAllowedMethod from "../utils/is-allowed-method"
import { BigcommerceApiError } from "../utils/errors"
import updateAddress from "./handlers/update-address"
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
	id: number
}

export type UpdateAddressHandlers = {
	updateAddress: BigcommerceHandler<null, Partial<AddressBody>>
}

const METHODS = ["POST", "PUT"]

const signupApi: BigcommerceApiHandler<null, UpdateAddressHandlers> = async (
	req,
	res,
	config,
	handlers
) => {
	if (!isAllowedMethod(req, res, METHODS)) return

	try {
		const body = req.body
		return await handlers["updateAddress"]({ req, res, config, body })
	} catch (error) {
		console.error(error)

		const message =
			error instanceof BigcommerceApiError
				? "An unexpected error ocurred with the Bigcommerce API"
				: "An unexpected error ocurred"

		res.status(500).json({ data: null, errors: [{ message }] })
	}
}

const handlers = { updateAddress }

export default createApiHandler(signupApi, handlers, {})
