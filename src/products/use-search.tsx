import type { HookFetcher } from '.././commerce/utils/types'
import type { SwrOptions } from '.././commerce/utils/use-data'
import useCommerceSearch from '.././commerce/products/use-search'
import type { SearchProductsData } from '../api/catalog/products'

const defaultOpts = {
  url: '/api/bigcommerce/catalog/products',
  method: 'GET',
}

export type SearchProductsInput = {
  search?: string
  categoryId?: number
  categoryIds?: number[]
  page?: number
  brandId?: number
  sort?: string
}
export type SearchProductsPayload = Omit<SearchProductsInput, "categoryIds"> & {
  stringifiedCategoryIds?: string // JSON.stringify(number[])
}

export const fetcher: HookFetcher<SearchProductsData, SearchProductsPayload> = (
  options,
  { search, categoryId, stringifiedCategoryIds, brandId, sort, page },
  fetch
) => {
  // Use a dummy base as we only care about the relative path
  const url = new URL(options?.url ?? defaultOpts.url, 'http://a')

  if (search) url.searchParams.set('search', search)
  if (page) url.searchParams.set('page', String(page))
  if (Number.isInteger(categoryId))
    url.searchParams.set('category', String(categoryId))
  const categoryIds: SearchProductsInput["categoryIds"] = JSON.parse(stringifiedCategoryIds || '[]')
  if (
    categoryIds &&
    categoryIds.length > 0 &&
    categoryIds.every((categoryId: number) => Number.isInteger(Number(categoryId)))
  )
    url.searchParams.set('categories', categoryIds.join(','))
  if (Number.isInteger(brandId)) url.searchParams.set('brand', String(brandId))
  if (sort) url.searchParams.set('sort', sort)

  return fetch({
    ...defaultOpts,
    ...options,
    url: (options?.base || '') + url.pathname + url.search
  })
}

export function extendHook(
  customFetcher: typeof fetcher,
  swrOptions?: SwrOptions<SearchProductsData, SearchProductsPayload>
) {
  const useSearch = (input: SearchProductsInput = {}) => {
    if (input.categoryId) {
      console.warn(`categoryId (number) will be deprecated in favor of categoryIds (number[]) in the next major release.`)
    }
    // SWR doesn't support nested arrays as key, so it's necessary to stringify it
    const response = useCommerceSearch(
      defaultOpts,
      [
        ['search', input.search],
        ['categoryId', input.categoryId],
        ['stringifiedCategoryIds', JSON.stringify(input.categoryIds)],
        ['brandId', input.brandId],
        ['sort', input.sort],
        ['page', input.page],
      ],
      customFetcher,
      { revalidateOnFocus: false, ...swrOptions }
    )

    return response
  }

  useSearch.extend = extendHook

  return useSearch
}

export default extendHook(fetcher)
