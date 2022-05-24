import { FetcherError } from '../../.././commerce/utils/errors'
import login from '../../operations/login'
import type { LoginHandlers } from '../login'
import { getIronSession } from 'iron-session'
import { sessionOptions } from '../../../lib/session'
import getCustomerImpersonationToken from '../../operations/get-customer-impersonation-token'

const invalidCredentials = /invalid credentials/i

const loginHandler: LoginHandlers['login'] = async ({
  req,
  res,
  body: { email, password },
  config,
}) => {
  // TODO: Add proper validations with something like Ajv
  if (!(email && password)) {
    return res.status(400).json({
      data: null,
      errors: [{ message: 'Invalid request' }],
    })
  }
  // TODO: validate the password and email
  // Passwords must be at least 7 characters and contain both alphabetic
  // and numeric characters.

  try {
    const data = await login({
      variables: { email, password },
      config,
      req,
      res,
    })

    // get customer impersonation token (cit)
    const token = await getCustomerImpersonationToken({ config })

    // store user id, cit in session
    const session = await getIronSession(req, res, sessionOptions)
    session.customerId = data.customerId
    session.token = token

    await session.save()

    res.status(200).json({ data })
  } catch (error) {
    // Check if the email and password didn't match an existing account
    if (
      error instanceof FetcherError &&
      invalidCredentials.test(error.message)
    ) {
      return res.status(401).json({
        data: null,
        errors: [
          {
            message:
              'Cannot find an account that matches the provided credentials',
            code: 'invalid_credentials',
          },
        ],
      })
    }

    throw error
  }
}

export default loginHandler
