
import type { BigcommerceHandler } from "../utils/create-api-handler"


export type AddressType = "residential" | "commercial"
export type FormFieldValue =
  | CustomerFormFieldValue
  | CustomerAddressFormFieldValue

export interface Address {
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
	/**
	 * The customer ID.
	 */
	customer_id: number
	/**
	 * The unique numeric ID of the address.
	 */
	id: number
	/**
	 * The country name of the customer address.
	 */
	country?: string
	/**
	 * Array of form fields. Controlled by `formfields` parameter.
	 */
	form_fields?: FormFieldValue[]
}
export interface CustomerFormFieldValue {
	/**
	 * The form field name.
	 */
	name: string
	value: string | number | string[]
	customer_id: number
}
export interface CustomerAddressFormFieldValue {
	/**
	 * The form field name.
	 */
	name: string
	value: string | number | string[]
	/**
	 * The Customer Address ID.
	 */
	address_id: number
}

/**
 * Pagination links for the previous and next parts of the whole collection.
 */
 export interface Links {
  /**
   * Link to the previous page returned in the response.
   */
  previous?: string
  /**
   * Link to the current page returned in the response.
   */
  current?: string
  /**
   * Link to the next page returned in the response.
   */
  next?: string
}

export interface Pagination {
  /**
   * Total number of items in the result set.
   */
	 total: number
	 /**
		* Total number of items in the collection response.
		*/
	 count: number
	 /**
		* The amount of items returned in the collection per page, controlled by the limit parameter.
		*/
	 per_page: number
	 /**
		* The page you are currently on within the collection.
		*/
	 current_page: number
	 /**
		* The total number of pages in the collection.
		*/
	 total_pages: number
	 links: Links
}

export interface Meta {
	pagination: Pagination
}

export interface BigCommerceAddressesResponse {
  data?: Address[]
  meta?: Meta
}

export type AddressesResponse = {
  addresses: Address[]
  pagination: Omit<Meta["pagination"], "links" | "current_page"> & {
    pages: {
      /**
       * The page you are currently on within the collection.
       */
      current: Meta["pagination"]["current_page"],
      /**
       * The previous page within the same collection
       */
      previous?: number,
      /**
       * The next page within the same collection
       */
      next?: number
    }
  }
}

type AddressBody = {
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
  /**
   * The customer ID.
   */
  customer_id: number
}

export type GetAddressesBody = {
	customerToken?: string
	page?: string
}

export type AddAddressBody = AddressBody
export type UpdateAddressBody = AddressBody & {
	id: number
}
export type RemoveAddressBody = {
	id: number
}

export type AddressHandlers = {
	getAddresses: BigcommerceHandler<AddressesResponse, GetAddressesBody>
	addAddress: BigcommerceHandler<null, Partial<AddAddressBody>>
	updateAddress: BigcommerceHandler<null, Partial<UpdateAddressBody>>
	removeAddress: BigcommerceHandler<null, Partial<RemoveAddressBody>>
}