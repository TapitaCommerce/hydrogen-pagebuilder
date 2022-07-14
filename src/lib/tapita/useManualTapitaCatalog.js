import {useEffect, useState} from 'react';
import {TAPITA_DOMAIN_OF_PRESENT} from '../const';

export const useManualTapitaCatalog = (props) => {
  const {maskedId, lazy} = props;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const gatherData = () => {
    const endpoint = `${TAPITA_DOMAIN_OF_PRESENT}/graphql`;
    const headers = {
      'content-type': 'application/json',
    };
    const graphqlQuery = {
      operationName: 'getCatalog',
      query: `{catalog_builder_page(pageMaskedId:"${maskedId}"){items{app_info_id apply_to created_at custom_css custom_header custom_js desc entity_id image is_rtl keywords masked_id modified name platform_value priority publish_items status storeview_visibility title type_id updated_at url_path visibility}}}`,
      variables: {},
    };

    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify(graphqlQuery),
    };
    return fetch(endpoint, options).then((res) => {
      if (res.status >= 400) {
        throw new Error(res.statusText);
      }
      return res.json();
    });
  };

  useEffect(() => {
    if (!loading && !data && !error && !lazy) {
      setLoading(true);
      gatherData()
        .then((data) => {
          setData(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  }, [loading, data, error, lazy]);

  return {
    data,
    loading,
    error,
  };
};
