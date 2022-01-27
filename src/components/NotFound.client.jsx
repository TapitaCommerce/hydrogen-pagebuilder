import Button from './Button.client';
import {useShop} from '@shopify/hydrogen/client';

import {useLocation, Link, useHistory} from 'react-router-dom';
import {useEffect} from 'react';

import {usePbFinder} from 'simi-pagebuilder-react';
import {PageBuilderComponent} from 'simi-pagebuilder-react';
import ProductList from './TapitaPageBuilder/Product/ProductList.client';
import ProductGrid from './TapitaPageBuilder/Product/ProductGrid.client';
import Category from './TapitaPageBuilder/Category/Category.client';
import CategoryList from './TapitaPageBuilder/Category/CategoryList.client';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';

let lastRenderedPage;

function NotFoundHero(props) {
  const {endPoint, integrationToken, serverRenderedPage, pbData} = props;
  if (
    typeof window !== 'undefined' &&
    pbData &&
    pbData.data &&
    pbData.data.spb_page
  ) {
    window.smPbPagesByToken = pbData;
  }
  const location = useLocation();
  const history = useHistory();

  const {storeDomain, storefrontToken, graphqlApiVersion} = useShop();
  const authLink = setContext((_, {headers}) => {
    return {
      headers: {
        ...headers,
        Cookie: '',
        'X-Shopify-Storefront-Access-Token': storefrontToken,
      },
    };
  });

  const httpLink = createHttpLink({
    uri:
      'https://' + storeDomain + '/api/' + graphqlApiVersion + '/graphql.json',
    useGETForQueries: false,
  });

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });

  const pbFinderProps = usePbFinder({
    endPoint,
    integrationToken,
  });

  const {loading: pbLoading, findPage, pathToFind} = pbFinderProps;
  let {pageMaskedId, pageData} = pbFinderProps;

  useEffect(() => {
    if (location && location.pathname) {
      if (!pageMaskedId || location.pathname !== pathToFind)
        findPage(location.pathname);
    }
  }, [pbLoading, location, pageMaskedId, findPage]);

  useEffect(() => {
    //if (pageMaskedId && pageMaskedId !== 'notfound') {
    try {
      //if client can run js like this, then we hide the ssr content
      document.getElementById('ssr-smpb-ctn').innerHTML = '';
    } catch (err) {}
    //}
  }, []);

  const pbcProps = {
    Link: Link,
    history: history,
    endPoint,
    integrationToken,
    ProductGrid,
    ProductList,
    Category,
    CategoryScroll: CategoryList,
  };

  const renderNotFoundContent = () => {
    if (pageMaskedId && pageMaskedId !== 'notfound') {
      if (pageData) lastRenderedPage = pageData;
      return (
        <PageBuilderComponent
          {...pbcProps}
          key={pageMaskedId}
          maskedId={pageMaskedId}
          pageData={pageData && pageData.publish_items ? pageData : false}
        />
      );
    } else if (serverRenderedPage || lastRenderedPage) {
      const pageToRender = serverRenderedPage || lastRenderedPage;
      if (pageToRender)
        return (
          <PageBuilderComponent
            {...pbcProps}
            key={pageToRender.masked_id}
            maskedId={pageToRender.masked_id}
            pageData={pageToRender}
          />
        );
      return '';
    }
  };

  return (
    <ApolloProvider client={client}>{renderNotFoundContent()}</ApolloProvider>
  );
}

export default NotFoundHero;
