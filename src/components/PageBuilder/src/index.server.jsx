import React, {useState} from 'react';
import Content from './Content/index.server';

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
  const data = {data: {spb_page: {items: [pageData]}}};

  const formatMessage = ({id, val, defaultMessage}) => {
    const msg = id || val || defaultMessage;
    if (!_formatMessage || !msg) {
      return val;
    } else {
      return _formatMessage({id: msg, defaultMessage: val});
    }
  };

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

  if (spgData && (spgData.status || toPreview))
    return (
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
    );
  return '';
}; 