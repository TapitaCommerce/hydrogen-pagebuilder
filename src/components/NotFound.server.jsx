import {useLocation, useHistory} from 'react-router-dom';
import Layout from './Layout.server';
import {PageBuilderComponent} from 'simi-pagebuilder-react';
const endPoint = 'https://tapita.io/pb/graphql/';
const integrationToken = '2xBXodtu16OPOKsWKcxA3riSeDkRpDL1622517111';
import {Link} from '@shopify/hydrogen';
import Button from './Button.client';

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
  const location = useLocation();
  if (!pbData) {
    pbData = {};
    const promise = getPageProps().then((pbResult) => {
      pbData = pbResult;
      //clean pb data every 60 secs
      setTimeout(() => {
        pbData = false;
      }, 60000);
    });
    throw promise;
  }

  if (
    location &&
    location.pathname &&
    pbData &&
    pbData.data &&
    pbData.data.spb_page &&
    pbData.data.spb_page.items &&
    pbData.data.spb_page.items.length
  ) {
    console.log('server tried again');
    const pbPages = JSON.parse(JSON.stringify(pbData.data.spb_page.items));
    pbPages.sort((el1, el2) => parseInt(el2.priority) - parseInt(el1.priority));
    const pageToFind = pbPages.find((item) => {
      return item.url_path === location.pathname;
    });

    if (pageToFind && pageToFind.masked_id) {
      return (
        <Layout fullWidthChildren={true}>
          <div id="ssr-smpb-ctn">
            <PageBuilderComponent
              key={location.pathname}
              Link={Link}
              integrationToken={integrationToken}
              pageData={pageToFind}
              maskedId={pageToFind.masked_id}
              ProductList={ProductList}
              ProductGrid={ProductGrid}
              Category={Category}
              CategoryScroll={CategoryList}
            />
          </div>
          <NotFoundClient
            integrationToken={integrationToken}
            endPoint={endPoint}
            serverRenderedPage={pageToFind}
          />
        </Layout>
      );
    }
  }

  return (
    <Layout>
      <div className="py-10 border-b border-gray-200">
        <div className="max-w-3xl text-center mx-4 md:mx-auto">
          <h1 className="text-gray-700 text-5xl font-bold mb-4">
            We&#39;ve lost this page
          </h1>
          <p className="text-xl m-8 text-gray-500">
            We couldn’t find the page you’re looking for. Try checking the URL
            or heading back to the home page.
          </p>
          <Button
            className="w-full md:mx-auto md:w-96"
            url="/"
            label="Take me to the home page"
          />
        </div>
      </div>
    </Layout>
  );
}
