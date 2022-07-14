import {
  CacheLong,
  CacheShort,
  gql,
  ProductOptionsProvider,
  Seo,
  useLocalization,
  useShopQuery,
} from '@shopify/hydrogen';
import {NotFound} from '../../../../components/global/NotFound.server';
import {validateMaskedId} from '../../../../lib/tapita/validateMaskedId';
import {Layout} from '../../../../components/global/Layout.server';
import {getExcerpt, MEDIA_FRAGMENT} from '../../../../lib';
import {ProductLayoutPagePreviewClient} from '../../../../components/tapita/Specific/ProductLayoutPagePreview.client';
import {
  Heading,
  ProductDetail,
  ProductForm,
  ProductGallery,
  Section,
  Text,
} from '../../../../components';
import {ProductSwimlane} from '../../../../components/sections/ProductSwimlane.server';

const ALL_PRODUCTS_QUERY = gql`
  query AllProducts {
    products(first: 1) {
      nodes {
        handle
      }
    }
  }
`;

const PRODUCT_QUERY = gql`
  ${MEDIA_FRAGMENT}
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      title
      vendor
      descriptionHtml
      collections(first: 250) {
        nodes {
          handle
        }
      }
      media(first: 7) {
        nodes {
          ...Media
        }
      }
      variants(first: 100) {
        nodes {
          id
          availableForSale
          selectedOptions {
            name
            value
          }
          image {
            id
            url
            altText
            width
            height
          }
          priceV2 {
            amount
            currencyCode
          }
          compareAtPriceV2 {
            amount
            currencyCode
          }
          sku
          title
          unitPrice {
            amount
            currencyCode
          }
        }
      }
      seo {
        description
        title
      }
    }
    shop {
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
`;

export default function (props) {
  const {params, response} = props;
  response.cache(CacheShort());
  const {handle} = params;

  const {data: productsData} = useShopQuery({
    query: ALL_PRODUCTS_QUERY,
    variables: {
      pageBy: 1,
    },
    preload: true,
    cache: CacheLong(),
  });

  const productHandles =
    productsData && productsData.products && productsData.products.nodes;
  const productHandle =
    productHandles && productHandles.length ? productHandles[0].handle : 'ant';

  const {data: productData, errors} = useShopQuery({
    query: PRODUCT_QUERY,
    variables: {
      handle: productHandle,
    },
    preload: true,
    cache: CacheLong(),
  });

  if (validateMaskedId(handle)) {
    const product = productData ? productData.product : null;
    const shop = productData ? productData.shop : null;

    if (!product) {
      return null;
    }
    const {
      media,
      title,
      vendor,
      descriptionHtml,
      id,
      collections = [],
    } = product;
    const {shippingPolicy, refundPolicy} = shop;

    return (
      <Layout>
        <Seo type="noindex" data={{title: 'Preview'}} />
        <ProductLayoutPagePreviewClient maskedId={handle} data={productData}>
          <ProductOptionsProvider data={product}>
            <Section padding="x" className="px-0">
              <div className="grid items-start md:gap-6 lg:gap-20 md:grid-cols-2 lg:grid-cols-3">
                <ProductGallery
                  media={media.nodes}
                  className="w-screen md:w-full lg:col-span-2"
                />
                <div className="sticky md:-mb-nav md:top-nav md:-translate-y-nav md:h-screen md:pt-nav hiddenScroll md:overflow-y-scroll">
                  <section className="flex flex-col w-full max-w-xl gap-8 p-6 md:mx-auto md:max-w-sm md:px-0">
                    <div className="grid gap-2">
                      <Heading as="h1" format className="whitespace-normal">
                        {title}
                      </Heading>
                      {vendor && (
                        <Text className={'opacity-50 font-medium'}>
                          {vendor}
                        </Text>
                      )}
                    </div>
                    <ProductForm />
                    <div className="grid gap-4 py-4">
                      {descriptionHtml && (
                        <ProductDetail
                          title="Product Details"
                          content={descriptionHtml}
                        />
                      )}
                      {shippingPolicy?.body && (
                        <ProductDetail
                          title="Shipping"
                          content={getExcerpt(shippingPolicy.body)}
                          learnMore={`/policies/${shippingPolicy.handle}`}
                        />
                      )}
                      {refundPolicy?.body && (
                        <ProductDetail
                          title="Returns"
                          content={getExcerpt(refundPolicy.body)}
                          learnMore={`/policies/${refundPolicy.handle}`}
                        />
                      )}
                    </div>
                  </section>
                </div>
              </div>
            </Section>
            <ProductSwimlane title="Related Products" data={id} />
          </ProductOptionsProvider>
        </ProductLayoutPagePreviewClient>
      </Layout>
    );
  } else {
    return <NotFound />;
  }
}
