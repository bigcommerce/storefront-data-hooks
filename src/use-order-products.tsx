import type { HookFetcher } from "./commerce/utils/types"
import type { SwrOptions } from "./commerce/utils/use-data"
import useData from "./commerce/utils/use-data"

import type { Products } from "./api/orders/products"

const defaultOpts = {
	url: "/api/bigcommerce/order-products",
	method: "GET",
}

export type { Products }

export interface UseOrderProductsInput {
	orderId?: number
}

export const fetcher: HookFetcher<
	Products | null,
	UseOrderProductsInput
> = async (options, { orderId }, fetch) => {
	if (!orderId) return null

	return fetch<Products | null>({
		...defaultOpts,
		...options,
	})
}

export function extendHook(
	customFetcher: typeof fetcher,
	swrOptions?: SwrOptions<Products | null, UseOrderProductsInput>
) {
	const useOrderProducts = ({ orderId }: UseOrderProductsInput) => {
		return useData(defaultOpts, [["orderId", orderId]], customFetcher, {
			revalidateOnFocus: false,
			...swrOptions,
		})
	}

	useOrderProducts.extend = extendHook

	return useOrderProducts
}

export default extendHook(fetcher)
