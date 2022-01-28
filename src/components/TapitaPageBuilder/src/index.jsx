import React from 'react';
//uncomment this to build standalone package
//import ReactDOM from 'react-dom'
import Content from './Content/index';
import {Helmet} from '@shopify/hydrogen/client';
import {styleString} from './style.css';

const itemFields = `
    entity_id
    page_id
    parent_id
    styles
    data
    name
    class_name
    type
    status
    visibility
    storeview_visibility
    sort_order
`;

const pageFields = `
                    priority
                    entity_id
                    name
                    status
                    masked_id
                    custom_css
                    custom_js
                    keywords
                    title
                    desc
                    is_rtl
                    storeview_visibility
`;

const PREVIEW_ITEM_QUERY = `
    query getPbItem($pageMaskedId: String) {
        spb_page(pageMaskedId: $pageMaskedId) {
            total_count
            items {
                ${pageFields}
            }
        }
        spb_item(pageMaskedId: $pageMaskedId) {
            total_count
            items {
                ${itemFields}
            }
        }
        catalog_builder_page(pageMaskedId: $pageMaskedId) {
            total_count
            items {
                ${pageFields}
            }
        }
        catalog_builder_item(pageMaskedId: $pageMaskedId) {
            total_count
            items {
                ${itemFields}
            }
        }
    }
`;

const GET_ITEM_QUERY = `
    query getPbItem($pageMaskedId: String) {
        spb_page(pageMaskedId: $pageMaskedId) {
            total_count
            items {
                ${pageFields}
                publish_items
            }
        }
        catalog_builder_page(pageMaskedId: $pageMaskedId) {
            total_count
            items {
                ${pageFields}
                publish_items
            }
        }
    }
`;

export const PageBuilderComponent = (props) => {
  const {
    endPoint,
    maskedId,
    pageData,
    toPreview,
    ProductList,
    ProductGrid,
    Category,
    ProductScroll,
    CategoryScroll,
    formatMessage: _formatMessage,
    history,
    Link,
    lazyloadPlaceHolder,
    overRender,
  } = props;
  const data =
    pageData && pageData.publish_items
      ? {data: {spb_page: {items: [pageData]}}}
      : false;

  const formatMessage = ({id, val, defaultMessage}) => {
    const msg = id || val || defaultMessage;
    if (!_formatMessage || !msg) {
      return val;
    } else {
      return _formatMessage({id: msg, defaultMessage: val});
    }
  };

  if (!data) {
    return '';
  }
  let spgData;
  let contentData = data.data;
  if (
    data &&
    data.data &&
    data.data.spb_page &&
    data.data.spb_page.items[0] &&
    (data.data.spb_page.items[0].publish_items ||
      (data.data.spb_item && data.data.spb_item.items))
  ) {
    spgData = data.data.spb_page.items[0];
  } else if (
    data &&
    data.data &&
    data.data.catalog_builder_page &&
    data.data.catalog_builder_page.items[0] &&
    (data.data.catalog_builder_page.items[0].publish_items ||
      (data.data.catalog_builder_item && data.data.catalog_builder_item.items))
  ) {
    spgData = data.data.catalog_builder_page.items[0];
    contentData = {
      spb_page: data.data.catalog_builder_page,
      spb_item: data.data.catalog_builder_item,
    };
  }
  console.log(spgData);
  if (spgData && (spgData.status || toPreview)) {
    return (
      <React.Fragment>
        {/*
        <Helmet>
          {spgData.title ? <title>{spgData.title}</title> : ''}
          {spgData.desc ? (
            <meta name="description" content={spgData.desc} />
          ) : (
            ''
          )}
          {spgData.keywords ? (
            <meta name="keywords" content={spgData.keywords} />
          ) : (
            ''
          )}
        </Helmet>
          */}
        <Content
          history={history}
          Link={Link}
          data={contentData}
          ProductList={ProductList}
          ProductGrid={ProductGrid}
          Category={Category}
          ProductScroll={ProductScroll}
          CategoryScroll={CategoryScroll}
          formatMessage={formatMessage}
          lazyloadPlaceHolder={lazyloadPlaceHolder}
          overRender={overRender}
        />
      </React.Fragment>
    );
  }
  return '';
};
