import type { HookFetcher } from "../commerce/utils/types"
import type { SwrOptions } from "../commerce/utils/use-data"
import useData from "../commerce/utils/use-data"

import type { AddressesResponse } from "../api/address"
import useCustomer from "../use-customer"

const defaultOpts = {
	url: "/api/bigcommerce/address",
	method: "GET",
}

export type { AddressesResponse }

export interface UseAddressesInput {
	customerId?: number
}
// TODO: Add pagination support

export const fetcher: HookFetcher<AddressesResponse | null, UseAddressesInput> = async (
	options,
	{ customerId },
	fetch
) => {
	if (!customerId) return null

	return fetch<AddressesResponse | null>({
		...defaultOpts,
		...options,
	})
}

export function extendHook(
	customFetcher: typeof fetcher,
	swrOptions?: SwrOptions<AddressesResponse | null, UseAddressesInput>
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
