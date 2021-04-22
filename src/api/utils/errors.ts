import type { Response } from '@vercel/fetch'

// Used for GraphQL errors
export class BigcommerceGraphQLError extends Error {
  constructor(msg: string) {
    super(msg)
    // Necessary to compile to ES5: https://github.com/microsoft/TypeScript/issues/22585
    Object.setPrototypeOf(this, BigcommerceGraphQLError.prototype);
  }
}

export class BigcommerceApiError extends Error {
  status: number
  res: Response
  data: any

  constructor(msg: string, res: Response, data?: any) {
    super(msg)
    // Necessary to compile to ES5: https://github.com/microsoft/TypeScript/issues/22585
    Object.setPrototypeOf(this, BigcommerceApiError.prototype);
    this.name = 'BigcommerceApiError'
    this.status = res.status
    this.res = res
    this.data = data
  }
}

export class BigcommerceNetworkError extends Error {
  constructor(msg: string) {
    super(msg)
    // Necessary to compile to ES5: https://github.com/microsoft/TypeScript/issues/22585
    Object.setPrototypeOf(this, BigcommerceNetworkError.prototype);
    this.name = 'BigcommerceNetworkError'
  }
}
