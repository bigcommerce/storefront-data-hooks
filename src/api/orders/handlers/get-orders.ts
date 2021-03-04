import type { Order, OrdersHandlers } from '..'

const getOrders: OrdersHandlers['getOrders'] = async ({
  res,
  body: { customer_id },
  config,
}) => {
  let result: Order[] = []
  if (customer_id) {
    result = await config.storeApiFetch(`/v2/orders?customer_id=${customer_id}`, {
      headers: {
        Accept: "application/json",
      }
    })
  }

  res.status(200).json({ data: { orders: result } })
}

export default getOrders
