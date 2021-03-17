import type { Orders, OrdersHandlers } from '..'
import getCustomerId from '../../operations/get-customer-id'

const getOrders: OrdersHandlers['getOrders'] = async ({
  res,
  body: { customerToken },
  config,
}) => {
  let result: Orders = []
  if (customerToken) {
    const customerId = customerToken && (await getCustomerId({ customerToken, config }))

    if (!customerId) {
      // If the customerToken is invalid, then this request is too
      return res.status(404).json({
        data: null,
        errors: [{ message: 'Orders not found' }],
      })
    }

    result = await config.storeApiFetch(`/v2/orders?customer_id=${customerId}`, {
      headers: {
        Accept: "application/json",
      }
    })
  }

  res.status(200).json({ data: result ?? null })
}

export default getOrders
