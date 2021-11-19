import {useLocation, Link, useHistory} from 'react-router-dom';

import Layout from './Layout.server';
//import {PageBuilderComponent} from 'simi-pagebuilder-react';
const endPoint = 'https://tapita.io/pb/graphql/';
const integrationToken = '14FJiubdB8n3Byig2IkpfM6OiS6RTO801622446444';

import NotFoundClient from './NotFound.client';
import {pagebuilderUrl} from './PageBuilder/PagebuilderServerPages';

export default function NotFound({country = {isoCode: 'US'}}) {
  const location = useLocation();

  const pbcProps = {
    Link: Link,
    endPoint,
    integrationToken,
  };
//   if (location && location.pathname && pagebuilderUrl[location.pathname]) {
//       const pageData = pagebuilderUrl[location.pathname];
//     return <Layout><div className="server-pb-ctn"><PageBuilderComponent key={location.pathname} {...pbcProps} pageData={pageData} maskedId={pageData.masked_id} /></div></Layout>;
//   }
  return (
    <Layout>
      <NotFoundClient />
    </Layout>
  );
}