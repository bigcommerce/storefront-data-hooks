# 1.7.0

## Set `OptionSelection` as an array
Following the BigCommerce API, `OptionSelection` have to be an array.

## Login cookies
Return only non-null cookies.

## Update cart after add, update or remove cart items
Allow to pass array of options to `useAddItem`, `useUpdateItem ` and `useRemoveItem ` as it's allowed in `useCart`.

This way, when using the hook of `useCart` with options, we can update its value through the rest of hooks if the same options are used. This is because behind the scenes we use **`swr`** in which the hook update depends on its input arguments. And the cart options are input arguments.

## Add review summary

Add review summary to get product operation.

## Increase product variants

By default, the number of variants returned by the API is 10. This has been changed to the maximum (250) to cover cases where a product has many possible variants.

## Reduce wishlist products to new maximum

The new maximum number of products returned by the API is 50.

# 1.6.0

## Add extra values to `useSignup` hook

Add support to more values that are supported in the Customer V3 API:

```
- phone
- company
- notes
- addresses
- accepts_product_review_abandoned_cart_emails
```

In addition, **`eslint/prettier`** has been configured.

## Category images

- Return (if exists) category images

## Add product options to product query

- Return specific product options for checkbox option
- Return specific product options for product pick list option
- Return `isDefault` for multiple choice option

## Add customer id to cart

Add the customer id (if the customer is logged) to the cart when creating it using the addItem hook
# 1.5.2
## Fix Address API imports
Export edit and delete handlers correctly. They were swapped.

# 1.5.1
## Add address folder to npm
Include the address folder to the package that will be uploaded to npm

# 1.5.0
## Improve extensibility
- Allow to override the base URL of every hook
- Allow to override the API handlers
- Allow to set the `base` at Provider level. Thus, if it is set, all requests will be made with that base URL.
- Allow to define the credentials that will be used in the network requests

## Support query params in cart hooks

Allow to define at hook level the parameter `include`, to be able to include more elements in the cart response. This allows, for example, to receive the different options of the products added to the cart.

```js
const { data } = useCart({ include: ['line_items.physical_items.options']})
```

Based on: https://developer.bigcommerce.com/api-reference/store-management/carts/cart/getacart

## Login updates

- Send customer on login response
- Set session and shopper cookies on login
- Export the customer handlers as we do in for the other resources

## Allow 204

- Allow responses with http status code 204

With the current configuration, when receiving a 204 (no content) it tries to execute the `.json()` method and fails. With this change we prevent the call to that method if the status is 204.

## Brand name

- Return the brand name when requesting the products. Receiving only the id was of little use
- Update the schema including the brand name field
- Update the schema including latest changes in the [Storefront GraphQL API](https://developer.bigcommerce.com/changelog#labels/storefront-api)

# 1.4.0
## Get `locale`  with `useCommerce` instead of `useRouter`

Right now, in the `useAddItem`, we use `useRouter` to get locale. This requires `next` as peer dependency, which isn't optimal, and was introduced in version [v1.2.0](https://github.com/bigcommerce/storefront-data-hooks/releases/tag/v1.2.0)  when adding locale support to the cart https://github.com/bigcommerce/storefront-data-hooks/pull/41.

Now the `locale` will be obtained from the `useCommerce` as is done in other hooks such as `usePrice`.
https://github.com/bigcommerce/storefront-data-hooks/blob/e6196b04ca86239987148878e305f61c05f58902/src/commerce/use-price.tsx#L54

## Add `useOrderProducts` hook

Add a new `useOrderProducts` hook. Right now the `useOrders` hook doesn't include the products for each order due to limitations in the BigCommerce API. Thanks to this new hook you can get the products of a specific order.

API Reference: https://developer.bigcommerce.com/api-reference/store-management/orders/order-products/getallorderproducts

### Usage

```
import useOrderProduct from "@bigcommerce/storefront-data-hooks/use-order-products"

const { data } = useOrderProduct({ orderId: 20015 })
```

## Add Customer Address Hooks

Allow getting, adding, modifying and deleting customer addresses with hooks.

All hooks require the user to be authenticated, if not, they will return an error.

- New `useAddresses` hook to get all the customer addresses (includes pagination)
- New `useAddAddress`  hook to create a new address
- New `useRemoveAddress` hook to remove a specific address by id.
- New `useUpdateAddress` hook to update a existing address
- Update de Readme to include examples of how to use the new hooks

## Set prototype to BigCommerce Error

Programmatically set the prototype to be able to check if a thrown Error is a BigCommerce Error. This is necessary because our compile target is ES5. Related issue: https://github.com/microsoft/TypeScript/issues/22585

Resolves a bug where the user couldn't add new products to the cart because the current cart was invalid but never deleted.

Resolves [49](#49)
# 1.3.1
### Troubleshoot login cookie problem

-  The Bigcommerce API has changed the cookies it returns after login, now we specifically select the cookie we are interested in returning to the customer: `SHOP_TOKEN`

# 1.3.0
## Login SSO Documentation

-  Fix a bug in the Login SSO sample code: The `url` param must be passed inside the `options` object.

## Add pagination to `useSearch`

- Update `README.me`
- Add a new param to the `useSearch` hook: `page`
- Get the results based on the provided `page`.

*Resolves [#38](https://github.com/bigcommerce/storefront-data-hooks/issues/38)*

## Return `basePrice` in the product query

- Return `basePrice` in the product query
- Update GraphQL schema to generate the updated types (also includes updated types from the latest [Storefront GraphQL API](https://developer.bigcommerce.com/changelog#labels/storefront-api) updates)

*Related to [#37](https://github.com/bigcommerce/storefront-data-hooks/issues/37)*

# 1.2.0
## Embedded checkout

- Now the `SHOP_TOKEN` is set at TLD (Top Level Domain) so the subdomain (where the embedded checkout iframe lives) can access the token
- Added a new section in the readme with some notes about how to make the checkout work
- Modified the `logout` endpoint to be `POST` to prevent unwanted caching

*Resolves [#36](https://github.com/bigcommerce/storefront-data-hooks/issues/36)*
*Resolves [#6](https://github.com/bigcommerce/storefront-data-hooks/issues/6)*

## Create `useOrders` hooks

Allow to fetch the orders using a new `useOrders` hook.

- If the user is not logged in, nothing is returned.
- If the user is logged in, it returns an array with their orders.
- Get the customer ID on the server (through the token) to avoid security issues.

*Resolves [#25](https://github.com/bigcommerce/storefront-data-hooks/issues/25)*

## Add locale to cart

When creating the carts, you can specify the locale. By default it's **en**, now the package checks the locale of the app to add it to the request.

⚠️ This adds as a Peer Dependency `next`.

*Resolves [#30](https://github.com/bigcommerce/storefront-data-hooks/issues/30)*

# 1.1.0

## Fix `useUpdateItem`

- Fix typo in  https://github.com/bigcommerce/storefront-data-hooks/blob/034be1e4c7fa363f4b1362fd1a6d50e25b2632ea/src/cart/use-update-item.tsx#L54
- Add missing types to the `Cart` body

*Resolves [#22](https://github.com/bigcommerce/storefront-data-hooks/issues/22)*

## Login SSO

- Accept `options` in the `useLogin` hook to allow Login SSO
- Update Readme with a quick guide of using Login SSO

*Resolves [#11](https://github.com/bigcommerce/storefront-data-hooks/issues/11) and [#13](https://github.com/bigcommerce/storefront-data-hooks/issues/13)*

## Allow to get products of different categories

- Add a new key to `useSearch`: `categoryIds`
- Stringify `categoryIds` to use as a key in SWR
- Add a deprecation warning to `categoryId`

*Resolves [#9](https://github.com/bigcommerce/storefront-data-hooks/issues/9)*


## Fix `useAddItem` types
- Set `variantId` as optional

*Resolves [#21](https://github.com/bigcommerce/storefront-data-hooks/issues/21)*

# 1.0.1

- Initial public release in support of https://nextjs.org/commerce