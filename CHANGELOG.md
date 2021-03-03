# 1.0.1

- Initial public release in support of https://nextjs.org/commerce

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