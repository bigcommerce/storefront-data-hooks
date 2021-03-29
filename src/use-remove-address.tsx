import { useCallback } from "react"
import type { HookFetcher } from "./commerce/utils/types"
import { CommerceError } from "./commerce/utils/errors"
import useRemoveAddress from "./commerce/use-remove-address"
import type { Body } from "./api/address/remove-address"
import useAddresses from "./use-addresses"

const defaultOpts = {
	url: "/api/bigcommerce/customers/remove-address",
	method: "POST",
}

export type AddAddressInput = Body

export const fetcher: HookFetcher<null, Body> = (options, { id }, fetch) => {
	if (!id) {
		throw new CommerceError({
			message: "An id is required to remove an address",
		})
	}

	return fetch({
		...defaultOpts,
		...options,
		body: { id },
	})
}

export function extendHook(customFetcher: typeof fetcher) {
	const useRemoveAddressHook = () => {
		const { revalidate } = useAddresses()
		const fn = useRemoveAddress<null, AddAddressInput>(
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

	useRemoveAddressHook.extend = extendHook

	return useRemoveAddressHook
}

export default extendHook(fetcher)
