import {stripSlash} from '../stripSlash';

export const findBlogPagePredicate = (tapitaPageBlock, currentVar) => {
  const {articleHandle, blogHandle, countryCode} = currentVar;

  if (tapitaPageBlock.type_id !== 2) {
    return false;
  }

  if (countryCode && tapitaPageBlock.storeview_visibility) {
    const storeViews = tapitaPageBlock.storeview_visibility.trim().split(',');
    if (!storeViews.includes(countryCode)) return false;
  }

  const tapitaBlogHandle = stripSlash(tapitaPageBlock.apply_to);
  const tapitaArticleHandle = stripSlash(tapitaPageBlock.url_path);

  if (
    tapitaBlogHandle &&
    tapitaArticleHandle &&
    tapitaBlogHandle === blogHandle &&
    tapitaArticleHandle === articleHandle
  ) {
    return true;
  } else {
    return false;
  }
};
