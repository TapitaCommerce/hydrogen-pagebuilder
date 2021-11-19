import Button from './Button.client';

import {useLocation, Link, useHistory} from 'react-router-dom';
import {useEffect} from 'react';

const endPoint = 'https://tapita.io/pb/graphql/';
const integrationToken = '14FJiubdB8n3Byig2IkpfM6OiS6RTO801622446444';
import {usePbFinder} from 'simi-pagebuilder-react';
import {PageBuilderComponent} from 'simi-pagebuilder-react';
import LoadingFallback from './LoadingFallback';

function NotFoundHero() {
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

  const pbcProps = {
    Link: Link,
    history: history,
    endPoint,
    integrationToken,
  };

  if (pageMaskedId && pageMaskedId !== 'notfound') {
    return (
      <PageBuilderComponent
        {...pbcProps}
        key={pageMaskedId}
        maskedId={pageMaskedId}
        pageData={pageData && pageData.publish_items ? pageData : false}
      />
    );
  }
  if (!pageMaskedId) {
    return (
      <div style={{minHeight: '100vh', textAlign: 'center', paddingTop: 100}}>
        Loading...
      </div>
    );
  }

  return (
    <div className="py-10 border-b border-gray-200">
      <div className="max-w-3xl text-center mx-4 md:mx-auto">
        <h1 className="text-gray-700 text-5xl font-bold mb-4">
          We&#39;ve lost this page
        </h1>
        <p className="text-xl m-8 text-gray-500">
          We couldn’t find the page you’re looking for. Try checking the URL or
          heading back to the home page.
        </p>
        <Button
          className="w-full md:mx-auto md:w-96"
          url="/"
          label="Take me to the home page"
        />
      </div>
    </div>
  );
}

export default function NotFoundClient(props) {
  return <NotFoundHero />;
}
