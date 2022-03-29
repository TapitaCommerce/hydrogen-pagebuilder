import {useShopQuery, flattenConnection} from '@shopify/hydrogen';
import gql from 'graphql-tag';

import Layout from './Layout.server';
import Button from './Button.client';
import ProductCard from './ProductCard';

import {Link} from '@shopify/hydrogen';
import {PageBuilderComponent} from 'simi-pagebuilder-react';
const endPoint = 'https://tapita.io/pb/graphql/';
const integrationToken = '2xBXodtu16OPOKsWKcxA3riSeDkRpDL1622517111';
import NotFoundClient from './NotFound.client';
import ProductList from './TapitaPageBuilder/Product/ProductList.server';
import ProductGrid from './TapitaPageBuilder/Product/ProductGrid.server';
import Category from './TapitaPageBuilder/Category/Category.server';
import CategoryList from './TapitaPageBuilder/Category/CategoryList.server';

let pbData;

/**
 * A server component that defines the content to display when a page isn't found (404 error)
 */
function NotFoundHero() {
  return (
    <div className="py-10 border-b border-gray-200">
      <div className="max-w-3xl text-center mx-4 md:mx-auto">
        <h1 className="font-bold text-4xl md:text-5xl text-gray-900 mb-6 mt-6">
          We&#39;ve lost this page
        </h1>
        <p className="text-lg m-8 text-gray-500">
          We couldn’t find the page you’re looking for. Try checking the URL or
          heading back to the home page.
        </p>
        <Button
          className="w-full md:mx-auto md:w-96"
          url="/"
          label="Take me to the home page"
        />
      </div>
    </div>
  );
}

function getPageProps() {
  let pbUrl = endPoint.replace('/graphql', '/publishedpb');
  if (!pbUrl.endsWith('/')) pbUrl += '/';
  if (pbUrl.indexOf('?') !== -1)
    pbUrl += '&integrationToken=' + integrationToken;
  else pbUrl += '?integrationToken=' + integrationToken;
  // Get our page props from our custom API:
  return fetch(pbUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());
}

export default function NotFound(props) {
  const {country = {isoCode: 'US'}, serverState, response} = props;
  let pathname =
    serverState && serverState.pathname ? serverState.pathname : '';
  if (response) {
    response.doNotStream();
    response.writeHead({status: 404, statusText: 'Not found'});
  }
  console.log(pathname);
  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      country: country.isoCode,
    },
  });
  const products = data ? flattenConnection(data.products) : [];
  const location = serverState;
  if (!pbData) {
    pbData = {};
    const promise = getPageProps().then((pbResult) => {
      pbData = pbResult;
    });
    throw promise;
  }

  if (
    pathname &&
    pbData &&
    pbData.data &&
    pbData.data.spb_page &&
    pbData.data.spb_page.items &&
    pbData.data.spb_page.items.length
  ) {
    const pbPages = JSON.parse(JSON.stringify(pbData.data.spb_page.items));
    pbPages.sort((el1, el2) => parseInt(el2.priority) - parseInt(el1.priority));
    const pageToFind = pbPages.find((item) => {
      return item.url_path === pathname;
    });

    if (pageToFind && pageToFind.masked_id) {
      return (
        <Layout fullWidthChildren={true}>
          <div id="ssr-smpb-ctn">
            {/*
            <PageBuilderComponent
              key={pathname}
              Link={Link}
              integrationToken={integrationToken}
              pageData={pageToFind}
              maskedId={pageToFind.masked_id}
              ProductList={ProductList}
              ProductGrid={ProductGrid}
              Category={Category}
              CategoryScroll={CategoryList}
              /> */}
          </div>
          <NotFoundClient
            integrationToken={integrationToken}
            endPoint={endPoint}
            serverRenderedPage={pageToFind}
            pbData={pbData}
          />
        </Layout>
      );
    }
  }
  if (pathname === '/hook') {
    pbData = false;
    return JSON.stringify({code: 200, message: 'Completed'});
  }

  return (
    <Layout>
      <NotFoundHero />
      <div className="my-8">
        <p className="mb-8 text-lg text-black font-medium uppercase">
          Products you might like
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {products.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

const QUERY = gql`
  query NotFoundProductDetails($country: CountryCode)
  @inContext(country: $country) {
    products(first: 3) {
      edges {
        node {
          handle
          id
          title
          variants(first: 1) {
            edges {
              node {
                id
                title
                availableForSale
                image {
                  id
                  url
                  altText
                  width
                  height
                }
                priceV2 {
                  currencyCode
                  amount
                }
                compareAtPriceV2 {
                  currencyCode
                  amount
                }
              }
            }
          }
        }
      }
    }
  }
`;
