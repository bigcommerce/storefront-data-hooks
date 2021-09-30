import createApiHandler, {
  BigcommerceApiHandler,
  BigcommerceHandler,
} from '../utils/create-api-handler'
import isAllowedMethod from '../utils/is-allowed-method'
import { BigcommerceApiError } from '../utils/errors'
import signup from './handlers/signup'

import { SignupBody } from './signup.types'

export type SignupHandlers = {
  signup: BigcommerceHandler<null, { cartId?: string } & Partial<SignupBody>>
}

const METHODS = ['POST']

const signupApi: BigcommerceApiHandler<null, SignupHandlers> = async (
  req,
  res,
  config,
  handlers
) => {
  if (!isAllowedMethod(req, res, METHODS)) return

  const { cookies } = req
  const cartId = cookies[config.cartCookie]

  try {
    const body = { ...req.body, cartId }
    return await handlers['signup']({ req, res, config, body })
  } catch (error) {
    console.error(error)

    const message =
      error instanceof BigcommerceApiError
        ? 'An unexpected error ocurred with the Bigcommerce API'
        : 'An unexpected error ocurred'

    res.status(500).json({ data: null, errors: [{ message }] })
  }
}

export const handlers = { signup }
export * from './signup.types'
export default createApiHandler(signupApi, handlers, {})
