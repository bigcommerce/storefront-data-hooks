type AddressType = 'residential' | 'commercial'

/**
 * The `address` object for the `customer` object's `addresses` array.
 */
type CustomerAddress = {
  /**
   * The first name of the customer address.
   */
  first_name: string
  /**
   * The last name of the customer address.
   */
  last_name: string
  /**
   * The company of the customer address.
   */
  company?: string
  /**
   * The address 1 line.
   */
  address1: string
  /**
   * The address 2 line.
   */
  address2?: string
  /**
   * The city of the customer address.
   */
  city: string
  /**
   * The state or province name
   */
  state_or_province: string
  /**
   * The postal code of the customer address.
   */
  postal_code: string
  /**
   * The country code of the customer address.
   */
  country_code: string
  /**
   * The phone number of the customer address.
   */
  phone?: string
  address_type?: AddressType
}

export type SignupBody = {
  /**
   * The first name of the customer.
   */
  firstName: string
  /**
   * The last name of the customer.
   */
  lastName: string
  /**
   * The email of the customer. Must be unique.
   */
  email: string
  /**
   * New password for customer.
   */
  password: string
  /**
   * The company of the customer.
   */
  company?: string
  /**
   * The phone number of the customer.
   */
  phone?: string
  /**
   * The customer notes.
   */
  notes?: string
  /**
   * It determines if the customer is signed up to receive either product review or abandoned cart emails or recieve both emails.
   */
  acceptsEmails?: boolean
  /**
   * Array of customer addresses. Limited to 10
   */
  addresses?:
    | []
    | [CustomerAddress]
    | [CustomerAddress, CustomerAddress]
    | [CustomerAddress, CustomerAddress, CustomerAddress]
    | [CustomerAddress, CustomerAddress, CustomerAddress, CustomerAddress]
    | [
        CustomerAddress,
        CustomerAddress,
        CustomerAddress,
        CustomerAddress,
        CustomerAddress
      ]
    | [
        CustomerAddress,
        CustomerAddress,
        CustomerAddress,
        CustomerAddress,
        CustomerAddress,
        CustomerAddress
      ]
    | [
        CustomerAddress,
        CustomerAddress,
        CustomerAddress,
        CustomerAddress,
        CustomerAddress,
        CustomerAddress,
        CustomerAddress
      ]
    | [
        CustomerAddress,
        CustomerAddress,
        CustomerAddress,
        CustomerAddress,
        CustomerAddress,
        CustomerAddress,
        CustomerAddress,
        CustomerAddress
      ]
    | [
        CustomerAddress,
        CustomerAddress,
        CustomerAddress,
        CustomerAddress,
        CustomerAddress,
        CustomerAddress,
        CustomerAddress,
        CustomerAddress,
        CustomerAddress
      ]
    | [
        CustomerAddress,
        CustomerAddress,
        CustomerAddress,
        CustomerAddress,
        CustomerAddress,
        CustomerAddress,
        CustomerAddress,
        CustomerAddress,
        CustomerAddress,
        CustomerAddress
      ]
}
