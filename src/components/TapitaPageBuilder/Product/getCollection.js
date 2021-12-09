import {ProductProviderFragment} from '@shopify/hydrogen';
import gql from 'graphql-tag';
import shopifyConfig from '../../../../shopify.config';

export const GET_COLLECTION_QUERY = gql`
  query CollectionDetails(
    $handle: String!
    $numProducts: Int!
    $numProductMetafields: Int = 0
    $numProductVariants: Int = 250
    $numProductMedia: Int = 6
    $numProductVariantMetafields: Int = 0
  ) {
    collection(handle: $handle) {
      id
      title
      descriptionHtml

      products(first: $numProducts) {
        edges {
          node {
            vendor
            ...ProductProviderFragment
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  }

  fragment ProductProviderFragment on Product {
    compareAtPriceRange {
      maxVariantPrice {
        ...MoneyFragment
      }
      minVariantPrice {
        ...MoneyFragment
      }
    }
    descriptionHtml
    handle
    id
    media(first: $numProductMedia) {
      edges {
        node {
          ...MediaFileFragment
        }
      }
    }
    metafields(first: $numProductMetafields) {
      edges {
        node {
          ...MetafieldFragment
        }
      }
    }
    priceRange {
      maxVariantPrice {
        ...MoneyFragment
      }
      minVariantPrice {
        ...MoneyFragment
      }
    }
    title
    variants(first: $numProductVariants) {
      edges {
        node {
          ...VariantFragment
        }
      }
    }
  }

  fragment MediaFileFragment on Media {
    ... on MediaImage {
      mediaContentType
      image {
        ...ImageFragment
      }
    }
    ... on Video {
      mediaContentType
      ...VideoFragment
    }
    ... on ExternalVideo {
      mediaContentType
      ...ExternalVideoFragment
    }
    ... on Model3d {
      mediaContentType
      ...Model3DFragment
    }
  }

  fragment MetafieldFragment on Metafield {
    id
    type
    namespace
    key
    value
    createdAt
    updatedAt
    description
  }

  fragment VariantFragment on ProductVariant {
    id
    title
    availableForSale
    image {
      ...ImageFragment
    }
    ...UnitPriceFragment
    priceV2 {
      ...MoneyFragment
    }
    compareAtPriceV2 {
      ...MoneyFragment
    }
    selectedOptions {
      name
      value
    }
    metafields(first: $numProductVariantMetafields) {
      edges {
        node {
          ...MetafieldFragment
        }
      }
    }
    sellingPlanAllocations(first: $numProductVariantSellingPlanAllocations) {
      edges {
        node {
          priceAdjustments {
            compareAtPrice {
              ...MoneyFragment
            }
            perDeliveryPrice {
              ...MoneyFragment
            }
            price {
              ...MoneyFragment
            }
            unitPrice {
              ...MoneyFragment
            }
          }
        }
      }
    }
  }
  fragment MoneyFragment on MoneyV2 {
    currencyCode
    amount
  }
  fragment ImageFragment on Image {
    id
    url
    altText
    width
    height
  }

  fragment VideoFragment on Video {
    id
    previewImage {
      url
    }
    sources {
      mimeType
      url
    }
  }

  fragment ExternalVideoFragment on ExternalVideo {
    id
    embeddedUrl
    host
  }

  fragment Model3DFragment on Model3d {
    id
    alt
    mediaContentType
    previewImage {
      url
    }
    sources {
      url
    }
  }

  fragment MoneyFragment on MoneyV2 {
    currencyCode
    amount
  }
  fragment ImageFragment on Image {
    id
    url
    altText
    width
    height
  }

  fragment UnitPriceFragment on ProductVariant {
    unitPriceMeasurement {
      measuredType
      quantityUnit
      quantityValue
      referenceUnit
      referenceValue
    }
    unitPrice {
      ...MoneyFragment
    }
  }
  fragment MoneyFragment on MoneyV2 {
    currencyCode
    amount
  }
  fragment MoneyFragment on MoneyV2 {
    currencyCode
    amount
  }

  fragment MoneyFragment on MoneyV2 {
    currencyCode
    amount
  }
`;

export async function sendRequest(
  callBack,
  queryContent,
  variables,
  operationName,
) {
  const {storeDomain, graphqlApiVersion, storefrontToken} = shopifyConfig;
  const endPoint = `https://${storeDomain}/api/${graphqlApiVersion}/graphql.json`;
  const requestData = {};
  requestData.method = 'POST';
  requestData.headers = {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': storefrontToken,
  };
  requestData.body = JSON.stringify({
    query: queryContent,
    variables: variables,
    operationName: operationName || 'SimiPbQuery',
  });

  const _request = new Request(endPoint, requestData);
  let result = null;

  fetch(_request)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (data) {
      if (data) {
        if (Array.isArray(data) && data.length === 1 && data[0])
          result = data[0];
        else result = data;
        if (result && typeof result === 'object') result.endPoint = endPoint;
      } else result = {errors: [{code: 0, message: 'Network response was not ok', endpoint: endPoint}]};
      if (callBack) callBack(result);
    })
    .catch((error) => {
      console.warn(error);
    });
}
