import gql from 'graphql-tag';
import {Image, Link} from '@shopify/hydrogen/client';
import {useQuery} from '@apollo/client';

import React, {useState, useEffect} from 'react';
import {ChevronLeft, ChevronRight} from 'react-feather';

let slidedTheSlider = false;
let maxSteps = 1;

export default function CategoryList(props) {
  const item = props.item;
  const unqId = 'smpb-categorylist-' + item.entity_id;
  const [currentStep, setCurrentStep] = useState(0);

  const {data} = useQuery(QUERY);

  const cateCount =
    data && data.collections && data.collections.edges
      ? data.collections.edges.length
      : 0;

  const scrollToIndex = (index) => {
    if (cateCount && data.collections.edges[index]) {
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
    if (document.getElementById(unqId)) {
      const ctnEl = document.getElementById(unqId);
      const ctnWidth = ctnEl.offsetWidth;
      let galleryItemWidth;
      if (ctnEl.children && ctnEl.children[0]) {
        //margin inline end
        galleryItemWidth = ctnEl.children[0].offsetWidth;
        try {
          galleryItemWidth += 15;
        } catch (err) {}
      }
      if (!galleryItemWidth) {
        galleryItemWidth = ctnWidth / 3;
      }
      maxSteps = cateCount - parseInt(ctnWidth / galleryItemWidth);
    }
  });

  useEffect(() => {
    if (currentStep === 0) {
      if (!slidedTheSlider) return;
    } else slidedTheSlider = true;
    scrollToIndex(currentStep);
  }, [currentStep]);

  if (!data) return '';
  const edges = data.collections.edges;

  return (
    <div className="product-list">
      <div className="smpbProductListCtn" id={unqId}>
        {edges.map((edge) =>
          edge.node && edge.node.image && edge.node.image.transformedSrc ? (
            <div className="carousel-item-category" key={edge.node.handle}>
              <Link to={`/collections/${edge.node.handle}`}>
                <Image
                  className="category-list-image"
                  src={edge.node.image.transformedSrc}
                  width={220}
                  height={220}
                />
                <p className="category-name">{edge.node.title}</p>
              </Link>
            </div>
          ) : (
            ''
          ),
        )}
      </div>
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
    </div>
  );
}

export const CollectionFragment = gql`
  fragment CollectionFragment on Collection {
    id
    image {
      altText
      width
      height
      id
      originalSrc
      transformedSrc
    }
    title
    updatedAt
    descriptionHtml
    handle
  }
`;

const QUERY = gql`
  query getCollectionDetails {
    collections(first: 250) {
      edges {
        cursor
        node {
          ...CollectionFragment
        }
      }
    }
  }
  ${CollectionFragment}
`;
