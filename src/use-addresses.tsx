import type { HookFetcher } from "./commerce/utils/types"
import type { SwrOptions } from "./commerce/utils/use-data"
import useData from "./commerce/utils/use-data"

import type { Addresses } from "./api/address"
import useCustomer from "./use-customer"

const defaultOpts = {
	url: "/api/bigcommerce/customers/addresses",
	method: "GET",
}

export type { Addresses }

export interface UseAddressesInput {
	customerId?: number
}

export const fetcher: HookFetcher<Addresses | null, UseAddressesInput> = async (
	options,
	{ customerId },
	fetch
) => {
	if (!customerId) return null

	return fetch<Addresses | null>({
		...defaultOpts,
		...options,
	})
}

export function extendHook(
	customFetcher: typeof fetcher,
	swrOptions?: SwrOptions<Addresses | null, UseAddressesInput>
) {
	const useAddresses = () => {
		const { data: customer } = useCustomer()
		return useData(
			defaultOpts,
			[["customerId", customer?.entityId]],
			customFetcher,
			{
				revalidateOnFocus: false,
				...swrOptions,
			}
		)
	}

	useAddresses.extend = extendHook

	return useAddresses
}

export default extendHook(fetcher)
