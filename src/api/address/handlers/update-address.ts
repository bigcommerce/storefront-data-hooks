import getCustomerId from "../../operations/get-customer-id"
import type { AddressHandlers } from ".."

const updateAddress: AddressHandlers["updateAddress"] = async ({
	req,
	res,
	body,
	config,
}) => {
	if (
		!body.id ||
		!body.first_name ||
		!body.last_name ||
		!body.address1 ||
		!body.city ||
		!body.state_or_province ||
		!body.postal_code ||
		!body.country_code
	) {
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

		await config.storeApiFetch("/v3/customers/addresses", {
			method: "PUT",
			body: JSON.stringify([{ ...body, customer_id: customerId }]),
		})
	} catch (error) {
		throw error
	}

	res.status(200).json({ data: null })
}

export default updateAddress
