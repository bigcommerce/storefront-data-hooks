import type { Products, OrderProductHandlers } from "../products"

const getOrderProducts: OrderProductHandlers["getOrderProducts"] = async ({
	res,
	body: { orderId },
	config,
}) => {
	let result: Products = []
	if (!orderId) {
		// If the customerToken is invalid, then this request is too
		return res.status(404).json({
			data: null,
			errors: [{ message: "Product order not found" }],
		})
	}

	result = await config.storeApiFetch(`/v2/orders/${orderId}/products`, {
		headers: {
			Accept: "application/json",
		},
	})

	res.status(200).json({ data: result ?? null })
}

export default getOrderProducts
