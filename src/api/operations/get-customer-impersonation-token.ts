import type { RecursivePartial, RecursiveRequired } from '../utils/types'
import { BigcommerceConfig, getConfig } from '..'

async function getCustomerImpersonationToken({
  config,
}: {
  config?: BigcommerceConfig
} = {}): Promise<string> {
  config = getConfig(config)
  const options = {
    method: 'POST',
    body: JSON.stringify({
      channel_id: config.storeChannelId || 1,
      expires_at: Math.floor(new Date().getTime() / 1000) + 1 * 24 * 60 * 60, // 1 day
    }),
  }
  const { data } = await config.storeApiFetch<{ data: { token: string } }>(
    '/v3/storefront/api-token-customer-impersonation',
    options
  )
  return data.token
}

export default getCustomerImpersonationToken
