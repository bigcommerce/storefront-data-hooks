import type { Response } from '@vercel/fetch'

// Used for GraphQL errors
export class BigcommerceGraphQLError extends Error {
  constructor(public readonly message: string) {
    super()
  }
}

export class BigcommerceApiError<Data> extends Error {
  public readonly name = 'BigcommerceApiError'
  public readonly status: number

  constructor(
    public readonly message: string,
    public readonly response: Response,
    public readonly data?: Data
  ) {
    super()

    this.status = response.status
  }
}

export class BigcommerceNetworkError extends Error {
  public readonly name = 'BigcommerceNetworkError'

  constructor(public readonly message: string) {
    super()

    this.name = 'BigcommerceNetworkError'
  }
}
