import { useCallback } from "react"
import type { HookFetcher } from "./commerce/utils/types"
import { CommerceError } from "./commerce/utils/errors"
import useAddAddress from "./commerce/use-add-address"
import type { AddressBody } from "./api/address/add-address"
import useAddresses from "./use-addresses"

const defaultOpts = {
	url: "/api/bigcommerce/customers/add-address",
	method: "POST",
}

export type AddAddressInput = AddressBody

export const fetcher: HookFetcher<null, AddressBody> = (
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

	return fetch({
		...defaultOpts,
		...options,
		body: input,
	})
}

export function extendHook(customFetcher: typeof fetcher) {
	const useAddAddressHook = () => {
		const { revalidate } = useAddresses()
		const fn = useAddAddress<null, AddAddressInput>(defaultOpts, customFetcher)

		return useCallback(
			async (input: AddAddressInput) => {
				const data = await fn(input)
				await revalidate()
				return data
			},
			[fn]
		)
	}

	useAddAddressHook.extend = extendHook

	return useAddAddressHook
}

export default extendHook(fetcher)
