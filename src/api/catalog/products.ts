import isAllowedMethod from '../utils/is-allowed-method'
import createApiHandler, {
  BigcommerceApiHandler,
  BigcommerceHandler,
} from '../utils/create-api-handler'
import { BigcommerceApiError } from '../utils/errors'
import type { ProductEdge } from '../operations/get-all-products'
import getProducts, { Meta } from './handlers/get-products'

export type SearchProductsData = {
  products: ProductEdge[]
  found: boolean
  pagination: Omit<Meta["pagination"], "links" | "current_page"> & {
    pages: {
      /**
       * The page you are currently on within the collection.
       */
      current: Meta["pagination"]["current_page"],
      /**
       * The previous page within the same collection
       */
      previous?: number,
      /**
       * The next page within the same collection
       */
      next?: number
    }
  }
}

export type ProductsHandlers = {
  getProducts: BigcommerceHandler<
    SearchProductsData,
    { search?: 'string'; category?: string; categories?: string, brand?: string; sort?: string, page?: string }
  >
}

const METHODS = ['GET']

// TODO: a complete implementation should have schema validation for `req.body`
const productsApi: BigcommerceApiHandler<
  SearchProductsData,
  ProductsHandlers
> = async (req, res, config, handlers) => {
  if (!isAllowedMethod(req, res, METHODS)) return

  try {
    const body = req.query
    return await handlers['getProducts']({ req, res, config, body })
  } catch (error) {
    console.error(error)

    const message =
      error instanceof BigcommerceApiError
        ? 'An unexpected error ocurred with the Bigcommerce API'
        : 'An unexpected error ocurred'

    res.status(500).json({ data: null, errors: [{ message }] })
  }
}

export const handlers = { getProducts }

export default createApiHandler(productsApi, handlers, {})
