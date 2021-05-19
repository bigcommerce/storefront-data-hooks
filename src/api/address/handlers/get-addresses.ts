import omit from 'lodash.omit';

import type { BigCommerceAddressesResponse, AddressHandlers } from ".."
import getCustomerId from "../../operations/get-customer-id"

const getAddresses: AddressHandlers["getAddresses"] = async ({
	res,
	body: { customerToken, page = "1" },
	config,
}) => {
	let response: BigCommerceAddressesResponse = {}
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

		response = await config.storeApiFetch(
			`/v3/customers/addresses?customer_id:in=${customerId}&page=${parseInt(page, 10)}`,
			{
				headers: {
					Accept: "application/json",
				},
			}
		)
	}

	if (!response || !response.data || !response.meta?.pagination) {
		res.status(200).json({ data:  null })
	} else {
		res.status(200).json({ data: {
			addresses: response.data,
			pagination: {
				...omit(response.meta.pagination, ['links', 'current_page']),
				pages: {
					current: response.meta.pagination.current_page,
					...response.meta.pagination.links?.previous ? {
						previous: response.meta.pagination.current_page - 1
					} : {},
					...response.meta.pagination.links?.next ? {
						next: response.meta.pagination.current_page + 1
					} : {}
				}
			}
		}})
	}
}

export default getAddresses
