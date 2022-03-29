import {useShop} from '@shopify/hydrogen/client';

import {useHistory} from 'react-router-dom';
import {useEffect} from 'react';

import {usePbFinder, PageBuilderComponent} from 'simi-pagebuilder-react';
import ProductList from './TapitaPageBuilder/Product/ProductList.client';
import ProductGrid from './TapitaPageBuilder/Product/ProductGrid.client';
import Category from './TapitaPageBuilder/Category/Category.client';
import CategoryList from './TapitaPageBuilder/Category/CategoryList.client';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {Link} from '@shopify/hydrogen/client';

let lastRenderedPage;

function NotFoundClient(props) {
  const {endPoint, integrationToken, serverRenderedPage, pbData} = props;
  if (
    typeof window !== 'undefined' &&
    pbData &&
    pbData.data &&
    pbData.data.spb_page
  ) {
    window.smPbPagesByToken = pbData;
  }
  const isuseABot = isBot();
  const history = useHistory();
  const location = history && history.location ? history.location : false;
  const shopData = useShop();
  const {storeDomain, storefrontToken, storefrontApiVersion} = shopData;

  const authLink = setContext((_, {headers}) => {
    return {
      headers: {
        ...headers,
        Cookie: '',
        'X-Shopify-Storefront-Access-Token': storefrontToken,
      },
    };
  });

  const httpLink = createHttpLink({
    uri:
      'https://' +
      storeDomain +
      '/api/' +
      storefrontApiVersion +
      '/graphql.json',
    useGETForQueries: false,
  });

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });

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
    //if (pageMaskedId && pageMaskedId !== 'notfound') {
    try {
      //if client can run js like this, then we hide the ssr content
      if (
        (typeof window !== 'undefined' && window && window.smIsLightHouse) ||
        isuseABot
      ) {
      } else document.getElementById('ssr-smpb-ctn').innerHTML = '';
    } catch (err) {}
    //}
  }, []);

  if (
    (typeof window !== 'undefined' && window && window.smIsLightHouse) ||
    isuseABot
  )
    return '';

  const pbcProps = {
    Link: Link,
    history: history,
    endPoint,
    integrationToken,
    ProductGrid,
    ProductList,
    Category,
    CategoryScroll: CategoryList,
  };

  const renderNotFoundContent = () => {
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
  };
  return (
    <ApolloProvider client={client}>{renderNotFoundContent()}</ApolloProvider>
  );
}

export default NotFoundClient;

const isBot = () => {
  if (typeof navigator === 'undefined' || !navigator.userAgent) return false;
  var botPattern =
    '(googlebot|Googlebot|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)';
  var re = new RegExp(botPattern, 'i');
  var userAgent = navigator.userAgent;
  if (re.test(userAgent)) {
    return true;
  } else {
    return false;
  }
};
