import Button from './Button.client';

import {useLocation, Link, useHistory} from 'react-router-dom';
import {useEffect} from 'react';

import {usePbFinder} from 'simi-pagebuilder-react';
import {PageBuilderComponent} from 'simi-pagebuilder-react';
import LoadingFallback from './LoadingFallback';

let lastRenderedPage;

function NotFoundHero(props) {
  const {endPoint, integrationToken, serverRenderedPage} = props;
  const location = useLocation();
  const history = useHistory();

  const pbFinderProps = usePbFinder({
    endPoint,
    integrationToken,
  });

  const {loading: pbLoading, findPage, pathToFind} = pbFinderProps;
  let {pageMaskedId, pageData} = pbFinderProps;

  useEffect(() => {
    if (location && location.pathname) {
      if (!pageMaskedId || location.pathname !== pathToFind)
        findPage(location.pathname);
    }
  }, [pbLoading, location, pageMaskedId, findPage]);

  useEffect(() => {
    if (pageMaskedId && pageMaskedId !== 'notfound') {
      try {
        //if client can run js like this, then we hide the ssr content
        document.getElementById('ssr-smpb-ctn').innerHTML = '';
      } catch (err) {}
    }
  }, [pageMaskedId]);

  const pbcProps = {
    Link: Link,
    history: history,
    endPoint,
    integrationToken,
  };

  if (pageMaskedId && pageMaskedId !== 'notfound') {
    if (pageData) lastRenderedPage = pageData;
    return (
      <PageBuilderComponent
        {...pbcProps}
        key={pageMaskedId}
        maskedId={pageMaskedId}
        pageData={pageData && pageData.publish_items ? pageData : false}
      />
    );
  } else if (serverRenderedPage || lastRenderedPage) {
    const pageToRender = serverRenderedPage || lastRenderedPage;
    if (pageToRender)
      return (
        <PageBuilderComponent
          {...pbcProps}
          key={pageToRender.masked_id}
          maskedId={pageToRender.masked_id}
          pageData={pageToRender}
        />
      );
    return '';
  }
}

export default NotFoundHero;
