import {fetchSync, useLocalization} from '@shopify/hydrogen';
import {SimplifiedPagebuilderClient} from '../Wrapper/SimplifiedPagebuilder.client';
import {defaultFindPagePredicate} from '~/lib/tapita/findBlock/defaultFindPagePredicate';
import {findPriortizedCatalog} from '../../../lib/tapita/findBlock/findPriortizedCatalog';

const DEFAULT_PAGE_NAMESPACE = 'catalog_builder_page';

export const PartialPageClient = (props) => {
  const {
    handle,
    pageNamespace = DEFAULT_PAGE_NAMESPACE,
    layoutFilter = null,
    findPagePredicate = defaultFindPagePredicate,
    findPriortized = findPriortizedCatalog,
    collectionHandles,
  } = props;

  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

  const sth = fetchSync(`/hydrated_tapita/api`, {}).json();

  const pages = sth?.data?.[pageNamespace]?.items ?? [];

  const currentVar = {
    handle,
    languageCode,
    countryCode,
    collectionHandles,
  };
  const matchingPages = pages.filter((p) => findPagePredicate(p, currentVar));
  const pageFound = findPriortized(matchingPages);

  if (pageFound) {
    return (
      <>
        <SimplifiedPagebuilderClient
          pageData={pageFound}
          layoutFilter={layoutFilter}
        />
      </>
    );
  } else {
    return null;
  }
};
