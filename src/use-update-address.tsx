import { useCallback } from "react"
import type { HookFetcher } from "./commerce/utils/types"
import { CommerceError } from "./commerce/utils/errors"
import useUpdateAddress from "./commerce/use-update-address"
import type { AddressBody } from "./api/address/update-address"
import useAddresses from "./use-addresses"

const defaultOpts = {
	url: "/api/bigcommerce/customers/update-address",
	method: "POST",
}

export type AddAddressInput = AddressBody

export const fetcher: HookFetcher<null, AddressBody> = (
	options,
	input,
	fetch
) => {
	if (!input.id) {
		throw new CommerceError({
			message: "An id is required to update an address",
		})
	}

	return fetch({
		...defaultOpts,
		...options,
		body: input,
	})
}

export function extendHook(customFetcher: typeof fetcher) {
	const useUpdateAddressHook = () => {
		const { revalidate } = useAddresses()
		const fn = useUpdateAddress<null, AddAddressInput>(
			defaultOpts,
			customFetcher
		)

		return useCallback(
			async (input: AddAddressInput) => {
				const data = await fn(input)
				await revalidate()
				return data
			},
			[fn]
		)
	}

	useUpdateAddressHook.extend = extendHook

	return useUpdateAddressHook
}

export default extendHook(fetcher)
