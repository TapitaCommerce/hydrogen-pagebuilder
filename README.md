# Hydrogen App

Hydrogen is a React framework and SDK that you can use to build fast and dynamic Shopify custom storefronts.

[Check out the docs](https://shopify.dev/custom-storefronts/hydrogen)

## Getting started

**Requirements:**

- Node v14+
- Yarn

```bash
yarn
yarn dev
```

Remember to update `shopify.config.js` with your shop's domain and Storefront API token!

## Previewing a production build

To run a local preview of your Hydrogen app in an environment similar to Oxygen, build your Hydrogen app and then run `yarn preview`:

```bash
yarn build
yarn preview
```

## Building for production

```bash
yarn build
```

Then, you can run a local `server.js` using the production build with:

```bash
yarn serve
```


## To Integrate your key
1. You have to create an account at Tapita.io
2. Sync your Shopify site to Tapita
3. Copy Integration Token 
![alt text](https://tapita.io/wp-content/uploads/2021/11/Hydrogen_int_guide.png)
4. Open the file at
```
  src/components/NotFound.server.jsx
```
5. And change the value at this line:
```
  const integrationToken = '2xBXodtu16OPOKsWKcxA3riSeDkRpDL1622517111';
```
to your integration key and re-run the serve command.
```
yarn serve
```
