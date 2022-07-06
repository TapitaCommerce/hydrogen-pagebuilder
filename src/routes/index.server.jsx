import {Suspense} from 'react';
import {
  CacheLong,
  gql,
  Seo,
  ShopifyAnalyticsConstants,
  useServerAnalytics,
  useLocalization,
  useShopQuery,
  useServerProps,
} from '@shopify/hydrogen';

import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';
import {getHeroPlaceholder} from '~/lib/placeholders';
import {FeaturedCollections, Hero} from '~/components';
import {Layout, ProductSwimlane} from '~/components/index.server';
import {HomeClient} from '../components/tapita/Specific/Home.client';
import {TapitaTranscendentalStatistic} from '~/lib/tapita/TapitaTranscendentalStatistic';

export default function Homepage(props) {
  useServerAnalytics({
    shopify: {
      pageType: ShopifyAnalyticsConstants.pageType.home,
    },
  });
  const status = TapitaTranscendentalStatistic.getPageAnalyticBlock(props, '/');

  return (
    <Layout>
      <Suspense>
        <HigherOrderHome status={status} />
      </Suspense>
    </Layout>
  );
}

function HigherOrderHome({status}) {
  const {pending} = useServerProps();
  const intToken = Oxygen.env.TAPITA_INTEGRATION_TOKEN;
  const hasHome = !!intToken && status;

  return (
    <>
      {pending ? <p>Loading...</p> : null}
      {hasHome ? <HomeClient intToken={intToken} /> : null}
      {!hasHome ? <HomepageContent /> : null}
    </>
  );
}

function HomepageContent() {
  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

  const {data} = useShopQuery({
    query: HOMEPAGE_CONTENT_QUERY,
    variables: {
      language: languageCode,
      country: countryCode,
    },
    preload: true,
  });

  const {heroBanners, featuredCollections, featuredProducts} = data;

  // fill in the hero banners with placeholders if they're missing
  const [primaryHero, secondaryHero, tertiaryHero] = getHeroPlaceholder(
    heroBanners.nodes,
  );

  return (
    <>
      <Suspense>
        <SeoForHomepage />
      </Suspense>
      {primaryHero && (
        <Hero {...primaryHero} height="full" top loading="eager" />
      )}
      <ProductSwimlane
        data={featuredProducts.nodes}
        title="Featured Products"
        divider="bottom"
      />
      {secondaryHero && <Hero {...secondaryHero} />}
      <FeaturedCollections
        data={featuredCollections.nodes}
        title="Collections"
      />
      {tertiaryHero && <Hero {...tertiaryHero} />}
    </>
  );
}

function SeoForHomepage() {
  const {
    data: {
      shop: {title, description},
    },
  } = useShopQuery({
    query: HOMEPAGE_SEO_QUERY,
    cache: CacheLong(),
    preload: true,
  });

  return (
    <Seo
      type="homepage"
      data={{
        title,
        description,
        titleTemplate: '%s · Powered by Hydrogen',
      }}
    />
  );
}

const HOMEPAGE_CONTENT_QUERY = gql`
  ${MEDIA_FRAGMENT}
  ${PRODUCT_CARD_FRAGMENT}
  query homepage($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    heroBanners: collections(
      first: 3
      query: "collection_type:custom"
      sortKey: UPDATED_AT
    ) {
      nodes {
        id
        handle
        title
        descriptionHtml
        heading: metafield(namespace: "hero", key: "title") {
          value
        }
        byline: metafield(namespace: "hero", key: "byline") {
          value
        }
        cta: metafield(namespace: "hero", key: "cta") {
          value
        }
        spread: metafield(namespace: "hero", key: "spread") {
          reference {
            ...Media
          }
        }
        spreadSecondary: metafield(namespace: "hero", key: "spread_secondary") {
          reference {
            ...Media
          }
        }
      }
    }
    featuredCollections: collections(
      first: 3
      query: "collection_type:smart"
      sortKey: UPDATED_AT
    ) {
      nodes {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
    featuredProducts: products(first: 12) {
      nodes {
        ...ProductCard
      }
    }
  }
`;

const HOMEPAGE_SEO_QUERY = gql`
  query homeShopInfo {
    shop {
      title: name
      description
    }
  }
`;
