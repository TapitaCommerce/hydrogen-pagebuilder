import {
  useShopQuery,
  ProductProviderFragment,
  flattenConnection,
} from '@shopify/hydrogen';
import gql from 'graphql-tag';

import Layout from './Layout.server';
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

let pbData;

export default function NotFound(props) {
  const {country = {isoCode: 'US'}, serverState} = props;
  let pathname =
    serverState && serverState.pathname ? serverState.pathname : '';
  //   if (pathname && pathname[0] && pathname[0] === '/')
  //     pathname = pathname.substring(1);
  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      country: country.isoCode,
      numProductMetafields: 0,
      numProductVariants: 250,
      numProductMedia: 0,
      numProductVariantMetafields: 0,
      numProductVariantSellingPlanAllocations: 0,
      numProductSellingPlanGroups: 0,
      numProductSellingPlans: 0,
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
  query NotFoundProductDetails(
    $country: CountryCode
    $includeReferenceMetafieldDetails: Boolean = false
    $numProductMetafields: Int!
    $numProductVariants: Int!
    $numProductMedia: Int!
    $numProductVariantMetafields: Int!
    $numProductVariantSellingPlanAllocations: Int!
    $numProductSellingPlanGroups: Int!
    $numProductSellingPlans: Int!
  ) @inContext(country: $country) {
    products(first: 3) {
      edges {
        node {
          ...ProductProviderFragment
        }
      }
    }
  }

  ${ProductProviderFragment}
`;
