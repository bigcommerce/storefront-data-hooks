# 1.2.0
### Embedded checkout

- Now the `SHOP_TOKEN` is set at TLD (Top Level Domain) so the subdomain (where the embedded checkout iframe lives) can access the token
- Added a new section in the readme with some notes about how to make the checkout works
- Modified the `logout` endpoint to be `POST` to prevent unwanted caching

*Resolves [#36](https://github.com/bigcommerce/storefront-data-hooks/issues/36)*
*Resolves [#6](https://github.com/bigcommerce/storefront-data-hooks/issues/6)*

### Create `useOrders` hooks

Allow to fetch the orders using a new `useOrders` hook.

- If the user is not logged in, nothing is returned.
- If the user is logged in, it returns an array with his orders.
- Get the customer ID on the server (through the token) to avoid security issues.

*Resolves [#25](https://github.com/bigcommerce/storefront-data-hooks/issues/25)*

### Add locale to cart

When creating the carts, you can specify the locale. By default it's **en**, now the package checks the locale of the app to add it to the request.

⚠️ This adds as a Peer Dependency `next`.

*Resolves [#30](https://github.com/bigcommerce/storefront-data-hooks/issues/30)*

# 1.1.0

### Fix `useUpdateItem`

- Fix typo in  https://github.com/bigcommerce/storefront-data-hooks/blob/034be1e4c7fa363f4b1362fd1a6d50e25b2632ea/src/cart/use-update-item.tsx#L54
- Add missing types to the `Cart` body

*Resolves [#22](https://github.com/bigcommerce/storefront-data-hooks/issues/22)*

### Login SSO

- Accept `options` in the `useLogin` hook to allow Login SSO
- Update Readme with a quick guide of using Login SSO

*Resolves [#11](https://github.com/bigcommerce/storefront-data-hooks/issues/11) and [#13](https://github.com/bigcommerce/storefront-data-hooks/issues/13)*

### Allow to get products of different categories

- Add a new key to `useSearch`: `categoryIds`
- Stringify `categoryIds` to use as a key in SWR
- Add a deprecation warning to `categoryId`

*Resolves [#9](https://github.com/bigcommerce/storefront-data-hooks/issues/9)*


### Fix `useAddItem` types
- Set `variantId` as optional

*Resolves [#21](https://github.com/bigcommerce/storefront-data-hooks/issues/21)*

# 1.0.1

- Initial public release in support of https://nextjs.org/commerce