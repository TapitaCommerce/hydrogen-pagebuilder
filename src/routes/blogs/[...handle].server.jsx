import {useServerProps} from '@shopify/hydrogen';
import {Suspense} from 'react';
import {PageHeader} from '~/components';
import {Layout} from '~/components/index.server';
import {resolveBlog} from '../../lib/tapita/resolveBlog';
import {NotFound} from '../../components/global/NotFound.server';
import {BlogClient} from '../../components/tapita/Specific/Blog.client';
import {TapitaTranscendentalStatistic} from '../../lib/tapita/TapitaTranscendentalStatistic';

export default function Blog(props) {
  const {request} = props;
  const {pathname} = new URL(request.url);
  const d = resolveBlog(pathname);

  if (!d) {
    return <NotFound />;
  }
  const {blogHandle, articleHandle} = d;

  const status = TapitaTranscendentalStatistic.getPageAnalyticBlock(
    props,
    `${blogHandle}/${articleHandle}`,
  );

  return (
    <Layout>
      <PageHeader className="gap-0">
        <Suspense>
          <ServerBlog
            blogHandle={blogHandle}
            articleHandle={articleHandle}
            status={status}
          />
        </Suspense>
      </PageHeader>
    </Layout>
  );
}

function ServerBlog({blogHandle, articleHandle, status}) {
  const intToken = Oxygen.env.TAPITA_INTEGRATION_TOKEN;
  const {pending} = useServerProps();

  const hasBlog = !!intToken && status;

  return (
    <>
      {pending ? <p>Loading...</p> : null}
      {hasBlog && (
        <BlogClient
          blogHandle={blogHandle}
          articleHandle={articleHandle}
          intToken={intToken}
        />
      )}
      {!hasBlog && <NotFound />}
    </>
  );
}
