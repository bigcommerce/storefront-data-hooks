import type { HookFetcher } from "../commerce/utils/types"
import type { SwrOptions } from "../commerce/utils/use-data"
import useCommerceAddresses from "../commerce/address/use-addresses"

import type { AddressesResponse } from "../api/address"
import useCustomer from "../use-customer"

const defaultOpts = {
	url: "/api/bigcommerce/address",
	method: "GET",
	base: window.location.host,
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
	const url = new URL(options?.url ?? defaultOpts.url, options?.base ?? defaultOpts.base)
	if (page) url.searchParams.set('page', String(page))

	return fetch<AddressesResponse | null>({
		...defaultOpts,
		...options,
		url: url.href,
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
