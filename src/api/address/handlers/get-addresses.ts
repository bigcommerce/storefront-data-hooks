import type { Addresses, AddressHandlers } from ".."
import getCustomerId from "../../operations/get-customer-id"

const getAddresses: AddressHandlers["getAddresses"] = async ({
	res,
	body: { customerToken },
	config,
}) => {
	let result: Addresses = {}
	if (customerToken) {
		const customerId =
			customerToken && (await getCustomerId({ customerToken, config }))

		if (!customerId) {
			// If the customerToken is invalid, then this request is too
			return res.status(404).json({
				data: null,
				errors: [{ message: 'Invalid request' }],
			})
		}

		result = await config.storeApiFetch(
			`/v3/customers/addresses?customer_id%3Ain=${customerId}`,
			{
				headers: {
					Accept: "application/json",
				},
			}
		)
	}

	res.status(200).json({ data: result ?? null })
}

export default getAddresses
