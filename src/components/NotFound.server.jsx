import {useLocation, useHistory} from 'react-router-dom';
import Layout from './Layout.server';
import {PageBuilderComponent} from 'simi-pagebuilder-react';
const endPoint = 'https://tapita.io/pb/graphql/';
const integrationToken = '17nMVmUJAxdditfSvAqBqoC6VJKTKpD21626949895';
import {Link} from '@shopify/hydrogen';

import NotFoundClient from './NotFound.client';

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
    const pbPages = JSON.parse(JSON.stringify(pbData.data.spb_page.items));
    pbPages.sort((el1, el2) => parseInt(el2.priority) - parseInt(el1.priority));
    const pageToFind = pbPages.find((item) => {
      return item.url_path === location.pathname;
    });

    if (pageToFind && pageToFind.masked_id) {
      pageMaskedId = pageToFind.masked_id;
      return (
        <Layout>
          <div id="ssr-smpb-ctn">
            <PageBuilderComponent
              key={location.pathname}
              Link={Link}
              integrationToken={integrationToken}
              pageData={pageToFind}
              maskedId={pageToFind.masked_id}
            />
          </div>
          <NotFoundClient
            integrationToken={integrationToken}
            endPoint={endPoint}
          />
        </Layout>
      );
    }
  }

  return (
    <Layout>
      <NotFoundClient integrationToken={integrationToken} endPoint={endPoint} />
    </Layout>
  );
}
