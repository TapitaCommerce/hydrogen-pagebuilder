const CATEGORY_DEFINITION_PREFIX = 'collection_handle';
const PRODUCT_DEFINITION_PREFIX = 'product_handle';

export const findProductDetailPagePredicate = (tapitaPageBlock, currentVar) => {
  const {
    handle: productHandle,
    countryCode,
    collectionHandles = [],
  } = currentVar;

  if (tapitaPageBlock.type_id !== 0) {
    return false;
  }
  if (countryCode && tapitaPageBlock.storeview_visibility) {
    const storeViews = tapitaPageBlock.storeview_visibility.trim().split(',');
    if (!storeViews.includes(countryCode)) return false;
  }

  if (tapitaPageBlock.apply_to) {
    let apply_to = tapitaPageBlock.apply_to.replace(/\s/g, '');
    apply_to = apply_to.split(',');
    if (apply_to.length >= 2) {
      tapitaPageBlock.apply_by = apply_to[0];
      if (apply_to[0] === CATEGORY_DEFINITION_PREFIX) {
        for (const h of apply_to.slice(1)) {
          if (collectionHandles.includes(h)) {
            return true;
          }
        }
      } else if (apply_to[0] === PRODUCT_DEFINITION_PREFIX) {
        return apply_to.slice(1).includes(productHandle);
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return true;
  }

  return true;
};
