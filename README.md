![Last version](https://img.shields.io/github/tag/bigcommerce/storefront-data-hooks.svg?style=flat-square)
[![NPM Status](https://img.shields.io/npm/dm/@bigcommerce/storefront-data-hooks.svg?style=flat-square)](https://www.npmjs.org/package/@bigcommerce/storefront-data-hooks)

Table of Contents
=================

   * [BigCommerce Storefront Data Hooks](#bigcommerce-storefront-data-hooks)
      * [Installation](#installation)
      * [General Usage](#general-usage)
         * [CommerceProvider](#commerceprovider)
         * [useLogin hook](#uselogin-hook)
         * [useLogout](#uselogout)
         * [useCustomer](#usecustomer)
         * [useSignup](#usesignup)
         * [usePrice](#useprice)
      * [Cart Hooks](#cart-hooks)
         * [useCart](#usecart)
         * [useAddItem](#useadditem)
         * [useUpdateItem](#useupdateitem)
         * [useRemoveItem](#useremoveitem)
      * [Wishlist Hooks](#wishlist-hooks)
      * [Product Hooks and API](#product-hooks-and-api)
         * [useSearch](#usesearch)
         * [getAllProducts](#getallproducts)
         * [getProduct](#getproduct)
      * [Customer Addresses Hooks](#customer-addresses-hooks)
         * [useAddresses](#useaddresses)
         * [useAddAddress](#useaddaddress)
         * [useUpdateAddress](#useupdateaddress)
         * [useRemoveAddress](#useremoveaddress)
      * [Checkout](#checkout)
      * [Troubleshooting](#troubleshooting)
      * [More](#more)

# BigCommerce Storefront Data Hooks

> This project is under active development, new features and updates will be continuously added over time

UI hooks and data fetching methods built from the ground up for e-commerce applications written in React, that use BigCommerce as a headless e-commerce platform. The package provides:

- Code splitted hooks for data fetching using [SWR](https://swr.vercel.app/), and to handle common user actions
- Code splitted data fetching methods for initial data population and static generation of content
- Helpers to create the API endpoints that connect to the hooks, very well suited for Next.js applications

## Installation

To install:

```
yarn add @bigcommerce/storefront-data-hooks
```

After install, the first thing you do is: <b>set your environment variables</b> in `.env.local`

```sh
BIGCOMMERCE_STOREFRONT_API_URL=<>
BIGCOMMERCE_STOREFRONT_API_TOKEN=<>
BIGCOMMERCE_STORE_API_URL=<>
BIGCOMMERCE_STORE_API_TOKEN=<>
BIGCOMMERCE_STORE_API_CLIENT_ID=<>
```

## General Usage

### CommerceProvider

This component is a provider pattern component that creates commerce context for it's children. It takes config values for the locale and an optional `fetcherRef` object for data fetching.

```jsx
...
import { CommerceProvider } from '@bigcommerce/storefront-data-hooks'

const App = ({ locale = 'en-US', children }) => {
  return (
    <CommerceProvider locale={locale}>
      {children}
    </CommerceProvider>
  )
}
...
```

### useLogin hook

Hook for bigcommerce user login functionality, returns `login` function to handle user login.

```jsx
...
import useLogin from '@bigcommerce/storefront-data-hooks/use-login'

const LoginView = () => {
  const login = useLogin()

  const handleLogin = async () => {
    await login({
      email,
      password,
    })
  }

  return (
    <form onSubmit={handleLogin}>
      {children}
    </form>
  )
}
...
```

#### Login SSO

To authenticate a user using the Customer Login API, it's necessary to point the `useLogin` hook to your own authentication endpoint.

```jsx
const login = useLogin({
  options: {
    url: '/api/your-own-authentication'
  },
})
```

That authentication endpoint have to return a `Set-Cookie` header with `SHOP_TOKEN=your_customer_authentication_token`. [See an example.](https://gist.github.com/jorgemasta/c709b63501344970026f3a3e7646cc77)

### useLogout

Hook to logout user.

```jsx
...
import useLogout from '@bigcommerce/storefront-data-hooks/use-logout'

const LogoutLink = () => {
  const logout = useLogout()
  return (
    <a onClick={() => logout()}>
      Logout
    </a>
  )
}
```

### useCustomer

Hook for getting logged in customer data, and fetching customer info.

```jsx
...
import useCustomer from '@bigcommerce/storefront-data-hooks/use-customer'
...

const Profile = () => {
  const { data } = useCustomer()

  if (!data) {
    return null
  }

  return (
    <div>Hello, {data.firstName}</div>
  )
}
```

### useSignup

Hook for bigcommerce user signup, returns `signup` function to handle user signups.

```jsx
...
import useSignup from '@bigcommerce/storefront-data-hooks/use-login'

const SignupView = () => {
  const signup = useSignup()

  const handleSignup = async () => {
    await signup({
      email,
      firstName,
      lastName,
      password,
    })
  }

  return (
    <form onSubmit={handleSignup}>
      {children}
    </form>
  )
}
...
```

### usePrice

Helper hook to format price according to commerce locale, and return discount if available.

```jsx
import usePrice from '@bigcommerce/storefront-data-hooks/use-price'
...
  const { price, discount, basePrice } = usePrice(
    data && {
      amount: data.cart_amount,
      currencyCode: data.currency.code,
    }
  )
...
```

## Cart Hooks

### useCart

Returns the current cart data for use

```jsx
...
import useCart from '@bigcommerce/storefront-data-hooks/cart/use-cart'

const countItem = (count: number, item: any) => count + item.quantity
const countItems = (count: number, items: any[]) =>
  items.reduce(countItem, count)

const CartNumber = () => {
  const { data } = useCart()
  const itemsCount = Object.values(data?.line_items ?? {}).reduce(countItems, 0)

  return itemsCount > 0 ? <span>{itemsCount}</span> : null
}
```

### useAddItem

```jsx
...
import useAddItem from '@bigcommerce/storefront-data-hooks/cart/use-add-item'

const AddToCartButton = ({ productId, variantId }) => {
  const addItem = useAddItem()

  const addToCart = async () => {
    await addItem({
      productId,
      variantId,
    })
  }

  return <button onClick={addToCart}>Add To Cart</button>
}
...
```

### useUpdateItem

```jsx
...
import useUpdateItem from '@bigcommerce/storefront-data-hooks/cart/use-update-item'

const CartItem = ({ item }) => {
  const [quantity, setQuantity] = useState(item.quantity)
  const updateItem = useUpdateItem(item)

  const updateQuantity = async (e) => {
    const val = e.target.value
    await updateItem({ quantity: val })
  }

  return (
    <input
      type="number"
      max={99}
      min={0}
      value={quantity}
      onChange={updateQuantity}
    />
  )
}
...
```

### useRemoveItem

Provided with a cartItemId, will remove an item from the cart:

```jsx
...
import useRemoveItem from '@bigcommerce/storefront-data-hooks/cart/use-remove-item'

const RemoveButton = ({ item }) => {
  const removeItem = useRemoveItem()

  const handleRemove = async () => {
    await removeItem({ id: item.id })
  }

  return <button onClick={handleRemove}>Remove</button>
}
...
```

## Wishlist Hooks

Wishlist hooks are similar to cart hooks. See the below example for how to use `useWishlist`, `useAddItem`, and `useRemoveItem`.

```jsx
import useAddItem from '@bigcommerce/storefront-data-hooks/wishlist/use-add-item'
import useRemoveItem from '@bigcommerce/storefront-data-hooks/wishlist/use-remove-item'
import useWishlist from '@bigcommerce/storefront-data-hooks/wishlist/use-wishlist'

const WishlistButton = ({ productId, variant }) => {
  const addItem = useAddItem()
  const removeItem = useRemoveItem()
  const { data } = useWishlist()
  const { data: customer } = useCustomer()
  const itemInWishlist = data?.items?.find(
    (item) =>
      item.product_id === productId &&
      item.variant_id === variant?.node.entityId
  )

  const handleWishlistChange = async (e) => {
    e.preventDefault()

    if (!customer) {
      return
    }

    if (itemInWishlist) {
      await removeItem({ id: itemInWishlist.id! })
    } else {
      await addItem({
        productId,
        variantId: variant?.node.entityId!,
      })
    }
  }

  return (
    <button onClick={handleWishlistChange}>
      <Heart fill={itemInWishlist ? 'var(--pink)' : 'none'} />
    </button>
  )
}
```

## Product Hooks and API

### useSearch

`useSearch` handles searching the bigcommerce storefront product catalog by catalog, brand, and query string. It also allows pagination.

```jsx
...
import useSearch from '@bigcommerce/storefront-data-hooks/products/use-search'

const SearchPage = ({ searchString, category, brand, sortStr }) => {
  const { data } = useSearch({
    search: searchString || '',
    categoryId: category?.entityId,
    brandId: brand?.entityId,
    sort: sortStr || '',
    page: 1
  })

  const { products, pagination } = data

  return (
    <Grid layout="normal">
      {products.map(({ node }) => (
        <ProductCard key={node.path} product={node} />
      ))}
      <Pagination {...pagination}>
    </Grid>
  )
}
```

### getAllProducts

API function to retrieve a product list.

```js
import { getConfig } from '@bigcommerce/storefront-data-hooks/api'
import getAllProducts from '@bigcommerce/storefront-data-hooks/api/operations/get-all-products'

const { products } = await getAllProducts({
  variables: { field: 'featuredProducts', first: 6 },
  config,
  preview,
})
```

### getProduct

API product to retrieve a single product when provided with the product
slug string.

```js
import { getConfig } from '@bigcommerce/storefront-data-hooks/api'
import getProduct from '@bigcommerce/storefront-data-hooks/api/operations/get-product'

const { product } = await getProduct({
  variables: { slug },
  config,
  preview,
})
```

## Customer Addresses Hooks
### useAddresses

Hook for returning the current users addresses

```javascript
import useAddresses from '@bigcommerce/storefront-data-hooks/address/use-addresses'

const AddressPage = () => {
  const { data } = useAddresses()

  return (
    <div>
      <pre>{JSON.stringify(data?.addresses, null, 2)}</pre>
    </div>
  )
}

```

### useAddAddress

Hook for adding customer address

```javascript
import useAddAddress from '@bigcommerce/storefront-data-hooks/address/use-add-address'

const AddressPage = () => {
  const addAddress = useAddAddress()

  const handleAddAddress = async () => {
    await addAddress({
      first_name: "Rod",
      last_name: "Hull",
      address1: "Waffle Road",
      city: "Bristol",
      state_or_province: "Bristol",
      postal_code: "WAF FLE",
      country_code: "GB",
      phone: "01234567890",
      address_type: "residential",
    })
  }

  return (
    <form onSubmit={handleAddAddress}>
      {children}
    </form>
  )
}

```

### useUpdateAddress

Hook for updating a customer address

```javascript
import useUpdateAddress from '@bigcommerce/storefront-data-hooks/address/use-update-address'

const AddressPage = () => {
  const updateAddress = useUpdateAddress()

  const handleUpdateAddress = async () => {
    await updateAddress({
      id: 4,
      first_name: "Rod",
      last_name: "Hull",
      address1: "Waffle Road",
      city: "Bristol",
      state_or_province: "Bristol",
      postal_code: "WAF FLE",
      country_code: "GB",
      phone: "01234567890",
      address_type: "residential",
      id: 12
    })
  }

  return (
    <form onSubmit={handleUpdateAddress}>
      {children}
    </form>
  )
}

```

### useRemoveAddress

Hook for removing a customers address

```javascript
import useRemoveAddress from '@bigcommerce/storefront-data-hooks/address/use-remove-address'

const AddressPage = () => {
  const removeAddress = useRemoveAddress()

  const handleUpdateAddress = async () => {
    await removeAddress({
      id: 4,
    })
  }

  return (
    <form onSubmit={handleUpdateAddress}>
      {children}
    </form>
  )
}

```


## Checkout

> The checkout only works on **production** and with a custom domain

The recommended method is the [Embedded Checkout](https://developer.bigcommerce.com/api-docs/storefronts/embedded-checkout/embedded-checkout-tutorial), follow the tutorial to create a channel and a site. Notes:

- The channel should be of type `storefront`
- The site url must be your production url (e.g: https://mystorefront.com)
- This package takes care of the cart and redirect links creation
- Your bigcommerce storefront must be a subdomain of your headless storefront (eg: https://bc.mystorefront.com)

![example image](https://cdn-std.droplr.net/files/acc_896732/CSo83V)

## Troubleshooting
<details>
  <summary>When I try to create a customer with <code>useSignup</code>, I receive an error but the user is created</summary>

  The `useSignup` hooks tries to login the user after creating it. Probably you have an error with the login. Checkout that your have your store **Open** since if the store is *Down for Maintenance* the users can't login.
  ![image](https://user-images.githubusercontent.com/4943868/102613733-f46abd80-412a-11eb-8438-744be2351512.png)

  Thanks @Strapazzon 🚀
</details>

## Contributing
Pull requests, issues and comments are welcome! See [Contributing](CONTRIBUTING.md) for more details.

Many thanks to all [contributors](https://github.com/bigcommerce/storefront-data-hooks/contributors)!
## More

Feel free to read through the source for more usage, and check the commerce vercel demo and commerce repo for usage examples: ([demo.vercel.store](https://demo.vercel.store/)) ([repo](https://github.com/vercel/commerce))
