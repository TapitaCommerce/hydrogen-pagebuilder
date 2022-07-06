import {Grid} from '../../../elements';
import {ProductCard} from '../../../cards';
import {getImageLoadingPriority} from '../../../../lib/const';
import {useTapitaProductBridge} from '../../../../lib/tapita/useTapitaProductBridge';

export const ProductGrid = (props) => {
  const {pending, products} = useTapitaProductBridge(props);

  return (
    <>
      {pending ? 'Loading...' : ''}
      <Grid layout="products" className={props.classes}>
        {products.map((product, i) => (
          <ProductCard
            key={i}
            product={product}
            loading={getImageLoadingPriority(i)}
          />
        ))}
      </Grid>
    </>
  );
};
