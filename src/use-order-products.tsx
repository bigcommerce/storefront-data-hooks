import type { HookFetcher } from "./commerce/utils/types"
import type { SwrOptions } from "./commerce/utils/use-data"
import useData from "./commerce/utils/use-data"

import type { Products } from "./api/orders/products"

const defaultOpts = {
	url: "/api/bigcommerce/orders/products",
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

	// Use a dummy base as we only care about the relative path
	const url = new URL(options?.url ?? defaultOpts.url, 'http://a')
	url.searchParams.set('order_id', String(orderId))

	return fetch<Products | null>({
		...defaultOpts,
		...options,
		url: (options?.base || '') + url.pathname + url.search,
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
