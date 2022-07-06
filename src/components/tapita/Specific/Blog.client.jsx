import {FullPageClient} from '../Layout/FullPage.client';
import {findBlogPagePredicate} from '~/lib/tapita/findBlock/findBlogPagePredicate';

export const BlogClient = (props) => {
  return (
    <FullPageClient
      {...props}
      pageNamespace={'catalog_builder_page'}
      findPagePredicate={findBlogPagePredicate}
    />
  );
};
