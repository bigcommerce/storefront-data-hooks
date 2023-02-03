import type { GetLoggedInCustomerQuery } from '../../../schema'
import type { CustomersHandlers } from '..'
import { getIronSession, IronSession } from 'iron-session'
import { sessionOptions } from '../../../lib/session'

export const getLoggedInCustomerQuery = /* GraphQL */ `
  query getLoggedInCustomer {
    customer {
      entityId
      firstName
      lastName
      email
      company
      customerGroupId
      notes
      phone
      addressCount
      attributeCount
      storeCredit {
        value
        currencyCode
      }
    }
  }
`
export type Customer = NonNullable<GetLoggedInCustomerQuery['customer']>

const getLoggedInCustomer: CustomersHandlers['getLoggedInCustomer'] = async ({
  req,
  res,
  config,
}) => {
  // use the session if available, otherwise fall back on the customerCookie
  const session: IronSession = await getIronSession(req, res, sessionOptions)
  const token: string = session.token || req.cookies[config.customerCookie]
  const headers: HeadersInit = session.token
    ? {
        Authorization: `Bearer ${session.token}`,
        'X-Bc-Customer-Id': session.customerId.toString(),
      }
    : {
        cookie: `${config.customerCookie}=${token}`,
      }

  if (token) {
    const { data } = await config.fetch<GetLoggedInCustomerQuery>(
      getLoggedInCustomerQuery,
      undefined,
      {
        headers,
      }
    )
    const { customer } = data

    if (!customer) {
      return res.status(400).json({
        data: null,
        errors: [{ message: 'Customer not found', code: 'not_found' }],
      })
    }

    return res.status(200).json({ data: { customer } })
  }

  res.status(200).json({ data: null })
}

export default getLoggedInCustomer
