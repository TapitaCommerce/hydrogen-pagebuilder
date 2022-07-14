import {findPriortizedPage} from './findPriortizedPage';
import {defaultFindPagePredicate} from './defaultFindPagePredicate';
import {findBlogPagePredicate} from './findBlogPagePredicate';
import {findProductDetailPagePredicate} from './findProductDetailPagePredicate';
import {findPriortizedCatalog} from './findPriortizedCatalog';
import {findCollectionPagePredicate} from './findCollectionPagePredicate';

const findFinal = (pageList, currentVar, filterPredicate, findPriortized) => {
  if (!pageList) {
    return null;
  }
  const pagesFound = pageList.filter((p) => filterPredicate(p, currentVar));
  return findPriortized(pagesFound);
};

export const findFinalPage = (data, currentVar) => {
  const pages =
    (data &&
      data.data &&
      data.data.data &&
      data.data.data.spb_page &&
      data.data.data.spb_page.items) ||
    [];
  return findFinal(
    pages,
    currentVar,
    defaultFindPagePredicate,
    findPriortizedPage,
  );
};

export const findFinalBlogPage = (data, currentVar) => {
  const pages =
    (data &&
      data.data &&
      data.data.data &&
      data.data.data.catalog_builder_page &&
      data.data.data.catalog_builder_page.items) ||
    [];
  return findFinal(
    pages,
    currentVar,
    findBlogPagePredicate,
    findPriortizedPage,
  );
};

export const findFinalProductPage = (data, currentVar) => {
  const pages =
    (data &&
      data.data &&
      data.data.data &&
      data.data.data.catalog_builder_page &&
      data.data.data.catalog_builder_page.items) ||
    [];
  return findFinal(
    pages,
    currentVar,
    findProductDetailPagePredicate,
    findPriortizedCatalog,
  );
};
export const findFinalCatalogPage = (data, currentVar) => {
  const pages =
    (data &&
      data.data &&
      data.data.data &&
      data.data.data.catalog_builder_page &&
      data.data.data.catalog_builder_page.items) ||
    [];
  return findFinal(
    pages,
    currentVar,
    findCollectionPagePredicate,
    findPriortizedCatalog,
  );
};
