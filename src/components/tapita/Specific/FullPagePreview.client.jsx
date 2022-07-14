import {SimplifiedPagebuilderClient} from '../Wrapper/SimplifiedPagebuilder.client';
import {TAPITA_DOMAIN_OF_PRESENT} from '../../../lib/const';

export const FullPagePreviewClient = (props) => {
  const {maskedId} = props || {};
  const endPoint = `${TAPITA_DOMAIN_OF_PRESENT}/graphql`;

  return (
    <SimplifiedPagebuilderClient endPoint={endPoint} maskedId={maskedId} />
  );
};
