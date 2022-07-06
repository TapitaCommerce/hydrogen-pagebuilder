const CATEGORY_DEFINITION_PREFIX = 'collection_handle';

export const findCollectionPagePredicate = (tapitaPageBlock, currentVar) => {
  const {handle, countryCode} = currentVar;

  if (tapitaPageBlock.type_id !== 1) {
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
        return apply_to.slice(1).includes(handle);
      } else {
        return false;
      }
    }
  } else {
    return true;
  }

  return true;
};
