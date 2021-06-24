import { useCallback } from 'react'
import type { HookFetcher, HookFetcherOptions } from './types'
import { useCommerce } from '..'

export default function useAction<T, Input = null>(
  options: HookFetcherOptions,
  fetcher: HookFetcher<T, Input>
) {
  const { fetcherRef, credentials, base } = useCommerce()

  return useCallback(
    (input: Input) => fetcher({...options, credentials, base }, input, fetcherRef.current),
    [fetcher]
  )
}
