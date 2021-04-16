import { useCallback } from "react"
import type { HookFetcher } from "../commerce/utils/types"
import { CommerceError } from "../commerce/utils/errors"
import useCommerceUpdateAddress from "../commerce/address/use-update-address"
import type { UpdateAddressBody } from "../api/address"
import useAddresses from "./use-addresses"

const defaultOpts = {
	url: "/api/bigcommerce/address",
	method: "PUT",
}

export type UpdateAddressInput = Omit<UpdateAddressBody, "customer_id">

export const fetcher: HookFetcher<null, UpdateAddressInput> = (
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
	const useUpdateAddress = () => {
		const { revalidate } = useAddresses()
		const fn = useCommerceUpdateAddress<null, UpdateAddressInput>(
			defaultOpts,
			customFetcher
		)

		return useCallback(
			async (input: UpdateAddressInput) => {
				const data = await fn(input)
				await revalidate()
				return data
			},
			[fn]
		)
	}

	useUpdateAddress.extend = extendHook

	return useUpdateAddress
}

export default extendHook(fetcher)
