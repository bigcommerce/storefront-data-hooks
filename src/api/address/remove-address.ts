import createApiHandler, {
	BigcommerceApiHandler,
	BigcommerceHandler,
} from "../utils/create-api-handler"
import isAllowedMethod from "../utils/is-allowed-method"
import { BigcommerceApiError } from "../utils/errors"
import removeAddress from "./handlers/remove-address"

export type Body = {
	id: number
}

export type RemoveAddressHandlers = {
	removeAddress: BigcommerceHandler<null, Partial<Body>>
}

const METHODS = ["POST", "PUT"]

const signupApi: BigcommerceApiHandler<null, RemoveAddressHandlers> = async (
	req,
	res,
	config,
	handlers
) => {
	if (!isAllowedMethod(req, res, METHODS)) return

	try {
		const body = req.body
		return await handlers["removeAddress"]({ req, res, config, body })
	} catch (error) {
		console.error(error)

		const message =
			error instanceof BigcommerceApiError
				? "An unexpected error ocurred with the Bigcommerce API"
				: "An unexpected error ocurred"

		res.status(500).json({ data: null, errors: [{ message }] })
	}
}

const handlers = { removeAddress }

export default createApiHandler(signupApi, handlers, {})
