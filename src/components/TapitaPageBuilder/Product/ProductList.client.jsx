import {
  flattenConnection,
  ProductProviderFragment,
  MediaFileFragment,
} from '@shopify/hydrogen/client';
import {useQuery} from '@apollo/client';
import ProductCard from './ProductCard.client';
import gql from 'graphql-tag';
import React, {useState, useEffect} from 'react';
//https://www.apollographql.com/docs/react/get-started/

import {ChevronLeft, ChevronRight} from 'react-feather';

let slidedTheSlider = false;
export default function ProductList(props) {
  const item = props.item;
  const unqId = 'smpb-productlist-' + item.entity_id;
  const [currentStep, setCurrentStep] = useState(0);
  const [maxSteps, setMaxSteps] = useState(0);

  let handle = null;
  let pageSize = 12;
  if (item && item.dataParsed) {
    const dataParsed = item.dataParsed;
    if (!dataParsed.openCategoryProducts) {
      return null;
    } else {
      handle = item.dataParsed.openCategoryProducts;
    }
    if (dataParsed.openProductsWidthSortPageSize) {
      pageSize = dataParsed.openProductsWidthSortPageSize;
    }
  }
  const {data} = useQuery(QUERY, {
    variables: {
      handle: handle,
      numProducts: pageSize,
    },
    skip: !handle,
  });
  const productCount =
    data &&
    data.collection &&
    data.collection.products &&
    data.collection.products.edges
      ? data.collection.products.edges.length
      : 0;

  const scrollToIndex = (index) => {
    if (
      data &&
      data.collection &&
      data.collection.products &&
      data.collection.products.edges &&
      data.collection.products.edges.length &&
      data.collection.products.edges[index]
    ) {
      const elements = document.getElementById(unqId).children;
      const target = elements.item(index);
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  };

  useEffect(() => {
    if (document.getElementById(unqId) && maxSteps === 0) {
      const ctnEl = document.getElementById(unqId);
      const ctnWidth = ctnEl.offsetWidth;
      let galleryItemWidth;
      if (ctnEl.children && ctnEl.children[0]) {
        //margin inline end
        galleryItemWidth = ctnEl.children[0].offsetWidth;
        try {
          galleryItemWidth += 10;
        } catch (err) {}
      }
      if (!galleryItemWidth) {
        galleryItemWidth = ctnWidth / 3;
      }
      const newMaxStep = productCount - parseInt(ctnWidth / galleryItemWidth);
      if (newMaxStep !== maxSteps) {
        setMaxSteps(newMaxStep);
      }
    }
  });

  useEffect(() => {
    if (currentStep === 0) {
      if (!slidedTheSlider) return;
    } else slidedTheSlider = true;
    scrollToIndex(currentStep);
  }, [currentStep]);

  if (!data) return '';
  const collection = data.collection;
  const products = flattenConnection(collection.products);
  return (
    <div className="product-list product-list-client">
      <div
        id={unqId}
        className="smpbProductListCtn"
        style={{
          display: 'flex',
          width: '100%',
          flexWrap: 'nowrap',
          overflow: 'auto',
        }}
      >
        {products.map((product) => (
          <div className="carousel-item">
            <ProductCard product={product} key={product.id} />
          </div>
        ))}
      </div>
      {maxSteps && maxSteps > 0 ? (
        <div className="scrollNavCtn">
          <div
            className={currentStep === 0 ? 'navDisabled' : ''}
            onClick={() => {
              if (currentStep > 0) setCurrentStep(currentStep - 1);
            }}
          >
            <ChevronLeft size={24} />
          </div>
          <div
            className={maxSteps && currentStep >= maxSteps ? 'navDisabled' : ''}
            onClick={() => {
              if (currentStep < maxSteps) setCurrentStep(currentStep + 1);
            }}
          >
            <ChevronRight size={24} />
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export const QUERY = gql`
  query CollectionDetails(
    $handle: String!
    $country: CountryCode
    $numProducts: Int!
    $includeReferenceMetafieldDetails: Boolean = false
    $numProductMetafields: Int = 0
    $numProductVariants: Int = 250
    $numProductMedia: Int = 6
    $numProductVariantMetafields: Int = 0
    $numProductVariantSellingPlanAllocations: Int = 0
    $numProductSellingPlanGroups: Int = 0
    $numProductSellingPlans: Int = 0
  ) @inContext(country: $country) {
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

  ${MediaFileFragment}
  ${ProductProviderFragment}
`;
