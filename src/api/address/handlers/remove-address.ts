import getCustomerId from "../../operations/get-customer-id"
import type { AddressHandlers } from ".."

const removeAddress: AddressHandlers["removeAddress"] = async ({
	req,
	res,
	body: { id },
	config,
}) => {
	if (!id) {
		return res.status(400).json({
			data: null,
			errors: [{ message: "Invalid request" }],
		})
	}

	try {
		const { cookies } = req
		const customerToken = cookies[config.customerCookie]

		const customerId =
			customerToken && (await getCustomerId({ customerToken, config }))

		if (!customerId) {
			// If the customerToken is invalid, then this request is too
			return res.status(404).json({
				data: null,
				errors: [{ message: 'Invalid request' }],
			})
		}

		await config.storeApiFetch(`/v3/customers/addresses?id%3Ain=${id}`, {
			method: "DELETE",
		})
	} catch (error) {
		throw error
	}

	res.status(200).json({ data: null })
}

export default removeAddress
