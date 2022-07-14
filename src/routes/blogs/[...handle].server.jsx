import {CacheLong, useLocalization, useServerProps} from '@shopify/hydrogen';
import {Suspense} from 'react';
import {PageHeader} from '~/components';
import {Layout} from '~/components/index.server';
import {resolveBlog} from '../../lib/tapita/resolveBlog';
import {NotFound} from '../../components/global/NotFound.server';
import {BlogClient} from '../../components/tapita/Specific/Blog.client';
import {TapitaTranscendentalStatistic} from '../../lib/tapita/TapitaTranscendentalStatistic';
import {useRefreshingServerCache} from '../../lib/tapita/useRefreshingServerCache';
import {findFinalBlogPage} from '../../lib/tapita/findBlock/findFinalPage';

export default function Blog(props) {
  const {request, response} = props;
  response.cache(CacheLong());

  const {
    country: {isoCode: countryCode},
    language: {isoCode: languageCode},
  } = useLocalization();

  const {pathname} = new URL(request.url);
  const d = resolveBlog(pathname);

  const {cacheData} = useRefreshingServerCache();

  if (!d) {
    return <NotFound />;
  }
  const {blogHandle, articleHandle} = d;
  const pageCache = findFinalBlogPage(cacheData, {
    articleHandle,
    languageCode,
    countryCode,
    blogHandle,
  });

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
            cacheData={pageCache}
          />
        </Suspense>
      </PageHeader>
    </Layout>
  );
}

function ServerBlog({blogHandle, articleHandle, status, cacheData}) {
  const intToken = Oxygen.env.TAPITA_INTEGRATION_TOKEN;
  const {pending} = useServerProps();

  const hasBlog = !!intToken && (status || cacheData);

  return (
    <>
      {pending ? <p>Loading...</p> : null}
      {hasBlog && (
        <BlogClient
          blogHandle={blogHandle}
          articleHandle={articleHandle}
          intToken={intToken}
          cacheData={cacheData}
        />
      )}
      {!hasBlog && <NotFound />}
    </>
  );
}
