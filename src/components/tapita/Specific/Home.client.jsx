import {FullPageClient} from '../Layout/FullPage.client';
import {defaultFindPagePredicate} from '~/lib/tapita/findBlock/defaultFindPagePredicate';

export function HomeClient(props) {
  return (
    <FullPageClient
      {...props}
      url_path={'/'}
      findPagePredicate={defaultFindPagePredicate}
    />
  );
}
