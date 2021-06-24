import createApiHandler, {
  BigcommerceApiHandler,
  BigcommerceHandler,
} from '../utils/create-api-handler'
import isAllowedMethod from '../utils/is-allowed-method'
import { BigcommerceApiError } from '../utils/errors'
import login from './handlers/login'

export type LoginBody = {
  email: string
  password: string
}

export type LoginResponse = { result?: string | undefined }

export type LoginHandlers = {
  login: BigcommerceHandler<LoginResponse, Partial<LoginBody>>
}

const METHODS = ['POST']

const loginApi: BigcommerceApiHandler<LoginResponse, LoginHandlers> = async (
  req,
  res,
  config,
  handlers
) => {
  if (!isAllowedMethod(req, res, METHODS)) return

  try {
    const body = req.body ?? {}
    return await handlers['login']({ req, res, config, body })
  } catch (error) {
    console.error(error)

    const message =
      error instanceof BigcommerceApiError
        ? 'An unexpected error ocurred with the Bigcommerce API'
        : 'An unexpected error ocurred'

    res.status(500).json({ data: null, errors: [{ message }] })
  }
}

export const handlers = { login }

export default createApiHandler(loginApi, handlers, {})
