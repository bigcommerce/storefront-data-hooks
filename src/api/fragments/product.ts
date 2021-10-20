export const productPrices = /* GraphQL */ `
  fragment productPrices on Prices {
    price {
      value
      currencyCode
    }
    salePrice {
      value
      currencyCode
    }
    retailPrice {
      value
      currencyCode
    }
    basePrice {
      value
      currencyCode
    }
  }
`

export const swatchOptionFragment = /* GraphQL */ `
  fragment swatchOption on SwatchOptionValue {
    isDefault
    hexColors
  }
`
export const productPickListOptionFragment = /* GraphQL */ `
  fragment productPickListOption on ProductPickListOptionValue {
    productId
  }
`

export const multipleChoiceOptionFragment = /* GraphQL */ `
  fragment multipleChoiceOption on MultipleChoiceOption {
    values {
      edges {
        node {
          entityId
          label
          isDefault
          ...swatchOption
          ...productPickListOption
        }
      }
    }
  }

  ${swatchOptionFragment}
  ${productPickListOptionFragment}
`

export const checkboxOptionFragment = /* GraphQL */ `
  fragment checkboxOption on CheckboxOption {
    checkedByDefault
  }
`

export const productInfoFragment = /* GraphQL */ `
  fragment productInfo on Product {
    entityId
    name
    path
    brand {
      entityId
      name
    }
    description
    prices {
      ...productPrices
    }
    images {
      edges {
        node {
          urlOriginal
          altText
          isDefault
        }
      }
    }
    reviewSummary {
      numberOfReviews
      summationOfRatings
    }
    variants(first: 250) {
      edges {
        node {
          entityId
          defaultImage {
            urlOriginal
            altText
            isDefault
          }
        }
      }
    }
    productOptions {
      edges {
        node {
          __typename
          entityId
          displayName
          isVariantOption
          isRequired
          ...multipleChoiceOption
          ...checkboxOption
        }
      }
    }
    localeMeta: metafields(namespace: $locale, keys: ["name", "description"])
      @include(if: $hasLocale) {
      edges {
        node {
          key
          value
        }
      }
    }
  }

  ${productPrices}
  ${multipleChoiceOptionFragment}
  ${checkboxOptionFragment}
`

export const productConnectionFragment = /* GraphQL */ `
  fragment productConnnection on ProductConnection {
    pageInfo {
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        ...productInfo
      }
    }
  }

  ${productInfoFragment}
`
