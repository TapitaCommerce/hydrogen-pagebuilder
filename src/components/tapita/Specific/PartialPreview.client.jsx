import React from 'react';
import {SimplifiedPagebuilderClient} from '../Wrapper/SimplifiedPagebuilder.client';

export const PartialPreviewClient = (props) => {
  const {data, ...rest} = props;
  const catalogs =
    data &&
    data.data &&
    data.data.catalog_builder_page &&
    data.data.catalog_builder_page.items;

  if (!catalogs || !catalogs.length) {
    return null;
  }
  const catalog = catalogs[0];

  return (
    <SimplifiedPagebuilderClient {...rest} pageData={{...catalog, status: 1}} />
  );
};
