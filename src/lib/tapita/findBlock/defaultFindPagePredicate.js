export const defaultFindPagePredicate = (tapitaPageBlock, currentVar) => {
  const {url_path} = currentVar;
  const normalizedNormalPath =
    url_path.charAt(0) === '/' ? url_path : '/' + url_path;
  return tapitaPageBlock.url_path === normalizedNormalPath;
};
