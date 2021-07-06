import type { HookFetcher } from "../commerce/utils/types"
import type { SwrOptions } from "../commerce/utils/use-data"
import useCommerceAddresses from "../commerce/address/use-addresses"

import type { AddressesResponse } from "../api/address"
import useCustomer from "../use-customer"

const defaultOpts = {
	url: "/api/bigcommerce/address",
	method: "GET",
}

export type { AddressesResponse }

export type UseAddressesInput  = {
	page?: number
}
export type UseAddressesPayload = UseAddressesInput & {
	customerId?: number
}

export const fetcher: HookFetcher<AddressesResponse | null, UseAddressesPayload> = async (
	options,
	{ customerId, page },
	fetch
) => {
	if (!customerId) return null
	// Use a dummy base as we only care about the relative path
	const url = new URL(options?.url ?? defaultOpts.url, 'http://a')
	if (page) url.searchParams.set('page', String(page))

	return fetch<AddressesResponse | null>({
		...defaultOpts,
		...options,
		url: (options?.base || '') + url.pathname + url.search
	})
}

export function extendHook(
	customFetcher: typeof fetcher,
	swrOptions?: SwrOptions<AddressesResponse | null, UseAddressesPayload>
) {
	const useAddresses = (input?: UseAddressesInput) => {
		const { data: customer } = useCustomer()
		return useCommerceAddresses(
			defaultOpts,
			[
				["customerId", customer?.entityId],
				['page', input?.page],
			],
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
