import {useTapitaProductBridge} from '../../../../lib/tapita/useTapitaProductBridge';
import {ProductCard, Section} from '~/components';
import {useScrollOnDemand} from '../../../../lib/tapita/useScrollOnDemand';
import {IconArrow} from '../../../elements';

export const ProductList = (props) => {
  const {pending, products, name} = useTapitaProductBridge(props);

  const {scrollRef, slide} = useScrollOnDemand({
    scrollTargetSelector: 'span.legit-child',
  });

  return (
    <>
      {pending ? 'Loading...' : ''}
      <Section heading={name} padding="y" {...props}>
        <div
          className="swimlane hiddenScroll md:pb-8 md:scroll-px-8 lg:scroll-px-12 md:px-8 lg:px-12"
          ref={scrollRef}
        >
          {[...products, ...products, ...products, ...products].map(
            (product, i) => (
              <span key={i} className={'legit-child'}>
                <ProductCard product={product} className={'snap-start w-80'} />
              </span>
            ),
          )}
        </div>

        <div className={'button-rotate-container'}>
          <button
            onClick={() => slide('left')}
            className={'product-list-left-button'}
          >
            <IconArrow direction={'left'} />
          </button>
          <button
            onClick={() => slide('right')}
            className={'product-list-right-button'}
          >
            <IconArrow direction={'right'} />
          </button>
        </div>
      </Section>
    </>
  );
};
