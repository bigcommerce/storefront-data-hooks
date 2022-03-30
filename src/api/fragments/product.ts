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
export const dateFieldOptionFragment = /* GraphQL */ `
  fragment dateFieldOption on DateFieldOption {
    defaultDate: defaultValue
    earliest
    latest
    limitDateBy
  }
`
export const textFieldOptionFragment = /* GraphQL */ `
  fragment textFieldOption on TextFieldOption {
    defaultValue
    minLength
    maxLength
  }
`

export const multiLineTextFieldOptionFragment = /* GraphQL */ `
  fragment multiLineTextFieldOption on MultiLineTextFieldOption {
    defaultValue
    minLength
    maxLength
    maxLines
  }
`

export const numberFieldOptionFragment = /* GraphQL */ `
  fragment numberFieldOption on NumberFieldOption {
    defaultNumber: defaultValue
    lowest
    highest
    isIntegerOnly
    limitNumberBy
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
    inventory {
      isInStock
      aggregated {
        warningLevel
        availableToSell
      }
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
          ...dateFieldOption
          ...textFieldOption
          ...multiLineTextFieldOption
          ...numberFieldOption
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
  ${dateFieldOptionFragment}
  ${textFieldOptionFragment}
  ${multiLineTextFieldOptionFragment}
  ${numberFieldOptionFragment}
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
