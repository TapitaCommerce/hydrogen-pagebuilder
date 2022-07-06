import {useCallback, useRef} from 'react';

export const checkElementVisible = (elem) => {
  const rect = elem.getBoundingClientRect();

  return (
    rect.left >= 0 &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

export const useScrollOnDemand = (props) => {
  const {scrollTargetSelector} = props;
  const scrollRef = useRef(null);

  const slide = useCallback(
    (direction) => {
      if (!scrollRef.current) {
        return false;
      }
      const candidates =
        scrollRef.current.querySelectorAll(scrollTargetSelector);
      if (!candidates.length) {
        return false;
      }

      let firstVisibleProductIndex = null;
      let lastVisibleProductIndex = null;

      for (let i = 0; i < candidates.length; i++) {
        const target = candidates[i];

        if (checkElementVisible(target)) {
          if (firstVisibleProductIndex === null) {
            firstVisibleProductIndex = i;
          }
          lastVisibleProductIndex = i;
        }
      }
      const scrollToTargetIndexMayNeg =
        direction === 'left'
          ? ((firstVisibleProductIndex ?? 0) - 1) % candidates.length
          : ((lastVisibleProductIndex ?? 0) + 1) % candidates.length;

      const scrollToTargetIndex =
        scrollToTargetIndexMayNeg < 0
          ? scrollToTargetIndexMayNeg + candidates.length
          : scrollToTargetIndexMayNeg;
      const finalTargetToScrollTo = candidates[scrollToTargetIndex];

      if (finalTargetToScrollTo) {
        finalTargetToScrollTo.scrollIntoView({
          block: 'nearest',
          inline: direction === 'right' ? 'start' : 'end',
          behavior: 'smooth',
        });
      }
    },
    [scrollRef],
  );

  return {
    scrollRef,
    slide,
  };
};
