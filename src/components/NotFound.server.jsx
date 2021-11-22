import {useLocation, useHistory} from 'react-router-dom';
import Layout from './Layout.server';
import {PageBuilderComponent} from 'simi-pagebuilder-react';
const endPoint = 'https://tapita.io/pb/';
const integrationToken = '14FJiubdB8n3Byig2IkpfM6OiS6RTO801622446444';
import {Link} from '@shopify/hydrogen';

import NotFoundClient from './NotFound.client';

function getPageProps() {
  // Get our page props from our custom API:
  return fetch(endPoint + 'publishedpb/?integrationToken=' + integrationToken, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());
}

let pbData;
let firstLoadPathname;

export default function NotFound({country = {isoCode: 'US'}}) {
  const location = useLocation();
  if (!pbData) {
    console.log('query data');
    pbData = {};
    const promise = getPageProps().then((pbResult) => {
      pbData = pbResult;
    });
    throw promise;
  }

  if (
    location &&
    location.pathname &&
    (!firstLoadPathname || firstLoadPathname === location.pathname) &&
    pbData &&
    pbData.data &&
    pbData.data.spb_page &&
    pbData.data.spb_page.items &&
    pbData.data.spb_page.items.length
  ) {
    const pbPages = pbData.data.spb_page.items;
    pbPages.sort((el1, el2) => parseInt(el2.priority) - parseInt(el1.priority));
    const pageToFind = pbPages.find((item) => {
      return item.url_path === location.pathname;
    });
    if (pageToFind && pageToFind.masked_id) {
      pageData = pageToFind;
      pageMaskedId = pageToFind.masked_id;
      firstLoadPathname = location.pathname;
      return (
        <Layout>
          <PageBuilderComponent
            key={location.pathname}
            Link={Link}
            integrationToken={integrationToken}
            pageData={pageData}
            maskedId={pageData.masked_id}
          />
        </Layout>
      );
    }
  }

  return (
    <Layout>
      <NotFoundClient />
    </Layout>
  );
}
