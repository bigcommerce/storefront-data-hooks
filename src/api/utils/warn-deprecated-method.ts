import type { NextApiRequest, NextApiResponse } from 'next'

export default function warnDeprecatedMethod(
  req: NextApiRequest,
  deprecatedMethods: string[]
) {

  if (!req.method || !deprecatedMethods.includes(req.method)) {
    console.warn(`Calling a deprecated method: ${req.method}`)
    return false
  }
}
