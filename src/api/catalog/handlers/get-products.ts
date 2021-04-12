import omit from 'lodash.omit';
import getAllProducts, { ProductEdge } from '../../operations/get-all-products'
import type { ProductsHandlers } from '../products'

const SORT: { [key: string]: string | undefined } = {
  latest: 'id',
  trending: 'total_sold',
  price: 'price',
}
const LIMIT = 12

export type Meta = {
  pagination: {
    /**
     * Total number of items in the collection response.
     */
    count: number
    /**
     * The page you are currently on within the collection.
     */
    current_page: number
    /**
     * Pagination links for the previous and next parts of the whole collection.
     */
    links?: {
      /**
       * Link to the current page returned in the response.
         */
      current?: string
      /**
       * Link to the next page returned in the response.
         */
      next?: string
      /**
       * Link to the previous page returned in the response.
         */
      previous?: string
    }
    /**
     * The amount of items returned in the collection per page, controlled by the limit parameter.
     */
    per_page: number
    /**
     * Total number of items in the result set.
     */
    total: number
    /**
     * The total number of pages in the collection.
     */
    total_pages: number
  }
}

// Return current cart info
const getProducts: ProductsHandlers['getProducts'] = async ({
  res,
  body: { search, category, categories, brand, sort, page },
  config,
}) => {
  // Use a dummy base as we only care about the relative path
  const url = new URL('/v3/catalog/products', 'http://a')

  url.searchParams.set('is_visible', 'true')
  url.searchParams.set('limit', String(LIMIT))

  if (search) url.searchParams.set('keyword', search)
  if (page) url.searchParams.set('page', page)

  const categoriesIn = [...categories?.split(',') || [], category].reduce((acc, category) => {
    if (category && Number.isInteger(Number(category))) return [...acc, category]
    return acc
  }, [] as string[])

  if (categoriesIn.length > 0)
    url.searchParams.set('categories:in', categoriesIn.join(','))

  if (brand && Number.isInteger(Number(brand)))
    url.searchParams.set('brand_id', brand)

  if (sort) {
    const [_sort, direction] = sort.split('-')
    const sortValue = SORT[_sort]

    if (sortValue && direction) {
      url.searchParams.set('sort', sortValue)
      url.searchParams.set('direction', direction)
    }
  }

  // We only want the id of each product
  url.searchParams.set('include_fields', 'id')

  const { data, meta } = await config.storeApiFetch<{ data: { id: number }[], meta: Meta }>(
    url.pathname + url.search
  )
  const entityIds = data.map((p) => p.id)
  const found = entityIds.length > 0
  // We want the GraphQL version of each product
  const graphqlData = await getAllProducts({
    variables: { first: LIMIT, entityIds },
    config,
  })
  // Put the products in an object that we can use to get them by id
  const productsById = graphqlData.products.reduce<{
    [k: number]: ProductEdge
  }>((prods, p) => {
    prods[p.node.entityId] = p
    return prods
  }, {})
  const products: ProductEdge[] = found ? [] : graphqlData.products

  // Populate the products array with the graphql products, in the order
  // assigned by the list of entity ids
  entityIds.forEach((id) => {
    const product = productsById[id]
    if (product) products.push(product)
  })

  const pagination = {
    ...omit(meta.pagination, ['links', 'current_page']),
    pages: {
      current: meta.pagination.current_page,
      ...meta.pagination.links?.previous ? {
        previous: meta.pagination.current_page - 1
      } : {},
      ...meta.pagination.links?.next ? {
        next: meta.pagination.current_page + 1
      } : {}
    }
  }
  res.status(200).json({ data: { products, found, pagination } })
}

export default getProducts
