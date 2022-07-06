import {FullPageClient} from '../Layout/FullPage.client';
import {useRouteParams} from '@shopify/hydrogen';
import {defaultFindPagePredicate} from '~/lib/tapita/findBlock/defaultFindPagePredicate';

export function PageClient(props) {
  const {handle} = useRouteParams();
  return (
    <FullPageClient
      {...props}
      url_path={handle}
      findPagePredicate={defaultFindPagePredicate}
    />
  );
}
