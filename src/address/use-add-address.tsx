import { useCallback } from "react"
import type { HookFetcher } from "../commerce/utils/types"
import { CommerceError } from "../commerce/utils/errors"
import useCommerceAddAddress from "../commerce/address/use-add-address"
import type { AddAddressBody } from "../api/address"
import useAddresses from "./use-addresses"

const defaultOpts = {
	url: "/api/bigcommerce/address",
	method: "POST",
}

export type AddAddressInput = Omit<AddAddressBody, "customer_id">

export const fetcher: HookFetcher<null, AddAddressInput> = (
	options,
	input,
	fetch
) => {
	if (
		!input.first_name ||
		!input.last_name ||
		!input.address1 ||
		!input.city ||
		!input.state_or_province ||
		!input.postal_code ||
		!input.country_code
	) {
		throw new CommerceError({
			message:
				"A first name, last name, address1, city, state_or_province, postal_code and country_code are required",
		})
	}
	// Use a dummy base as we only care about the relative path
	const url = new URL(options?.url ?? defaultOpts.url, 'http://a')

	return fetch({
		...defaultOpts,
		...options,
		url: (options?.base || '') + url.pathname,
		body: input,
	})
}

export function extendHook(customFetcher: typeof fetcher) {
	const useAddAddress = () => {
		const { revalidate } = useAddresses()
		const fn = useCommerceAddAddress<null, AddAddressInput>(defaultOpts, customFetcher)

		return useCallback(
			async (input: AddAddressInput) => {
				const data = await fn(input)
				await revalidate()
				return data
			},
			[fn]
		)
	}

	useAddAddress.extend = extendHook

	return useAddAddress
}

export default extendHook(fetcher)
