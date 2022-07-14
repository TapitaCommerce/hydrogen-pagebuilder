import {CacheShort} from '@shopify/hydrogen';
import {FullPagePreviewClient} from '../../../../components/tapita/Specific/FullPagePreview.client';
import {NotFound} from '../../../../components/global/NotFound.server';
import {validateMaskedId} from '../../../../lib/tapita/validateMaskedId';

export default function (props) {
  const {params, response} = props;
  response.cache(CacheShort());
  const {handle} = params;

  if (validateMaskedId(handle)) {
    return <FullPagePreviewClient maskedId={handle} />;
  } else {
    return <NotFound />;
  }
}
