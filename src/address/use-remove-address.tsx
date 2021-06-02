import { useCallback } from "react"
import type { HookFetcher } from "../commerce/utils/types"
import { CommerceError } from "../commerce/utils/errors"
import useCommerceRemoveAddress from "../commerce/address/use-remove-address"
import type { RemoveAddressBody } from "../api/address"
import useAddresses from "./use-addresses"

const defaultOpts = {
	url: "/api/bigcommerce/address",
	method: "DELETE",
	base: window.location.host,
}

export type RemoveAddressInput = RemoveAddressBody

export const fetcher: HookFetcher<null, RemoveAddressBody> = (options, { id }, fetch) => {
	if (!id) {
		throw new CommerceError({
			message: "An id is required to remove an address",
		})
	}

	const url = new URL(options?.url ?? defaultOpts.url, options?.base ?? defaultOpts.base)

	return fetch({
		...defaultOpts,
		...options,
		url: url.href,
		body: { id },
	})
}

export function extendHook(customFetcher: typeof fetcher) {
	const useRemoveAddress = () => {
		const { revalidate } = useAddresses()
		const fn = useCommerceRemoveAddress<null, RemoveAddressInput>(
			defaultOpts,
			customFetcher
		)

		return useCallback(
			async (input: RemoveAddressInput) => {
				const data = await fn(input)
				await revalidate()
				return data
			},
			[fn]
		)
	}

	useRemoveAddress.extend = extendHook

	return useRemoveAddress
}

export default extendHook(fetcher)
