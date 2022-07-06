import {
  useLocalization,
  useShopQuery,
  Seo,
  useServerAnalytics,
  ShopifyAnalyticsConstants,
  gql,
  useServerProps,
} from '@shopify/hydrogen';
import {Suspense} from 'react';

import {PageHeader} from '~/components';
import {NotFound, Layout} from '~/components/index.server';
import {TapitaTranscendentalStatistic} from '../../lib/tapita/TapitaTranscendentalStatistic';
import {PageClient} from '../../components/tapita/Specific/Page.client';

const BasePage = ({page}) => {
  return (
    <Layout>
      <Suspense>
        <Seo type="page" data={page} />
      </Suspense>
      <PageHeader heading={page.title}>
        <div
          dangerouslySetInnerHTML={{__html: page.body}}
          className="prose dark:prose-invert"
        />
      </PageHeader>
    </Layout>
  );
};

export default function Page(props) {
  const {params} = props;

  const {
    language: {isoCode: languageCode},
  } = useLocalization();

  const {handle} = params;
  const {
    data: {page},
  } = useShopQuery({
    query: PAGE_QUERY,
    variables: {languageCode, handle},
  });
  const {pending} = useServerProps();

  if (!page) {
    return <NotFound />;
  }
  const intToken = Oxygen.env.TAPITA_INTEGRATION_TOKEN;
  const status = TapitaTranscendentalStatistic.getPageAnalyticBlock(
    props,
    handle,
  );
  const maybeTapitaPage = page.body === '';
  const hasPage = !!intToken && status && maybeTapitaPage;

  useServerAnalytics({
    shopify: {
      pageType: ShopifyAnalyticsConstants.pageType.page,
      resourceId: page.id,
    },
  });
  return (
    <>
      {pending ? <p>Loading...</p> : null}
      {hasPage ? <PageClient intToken={intToken} page={page} /> : null}
      {!hasPage ? <BasePage page={page} /> : null}
    </>
  );
}

const PAGE_QUERY = gql`
  query PageDetails($languageCode: LanguageCode, $handle: String!)
  @inContext(language: $languageCode) {
    page(handle: $handle) {
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
`;
