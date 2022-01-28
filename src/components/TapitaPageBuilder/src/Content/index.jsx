import React from 'react';
import Innercontent from './Innercontent';
import Button from './Button/index';
import {randomString, listToTree} from '../Helper/Data';
import {useDeviceWidthPrefix} from '../hooks/useDeviceWidthPrefix';
import {PartialSlider} from './PartialSlider/PartialSlider';

export const buttonTypeFieldName = 'button-type';

export const formSubmitMethod = 'form-submit-method';
export const formSubmitTarget = 'form-submit-url';

const PbContent = (props) => {
  const {
    data: {spb_item, spb_page},
    ProductList,
    ProductGrid,
    Category,
    formatMessage,
    ProductScroll,
    CategoryScroll,
    history,
    Link,
    lazyloadPlaceHolder,
    overRender,
  } = props;
  const deviceFilterKey = useDeviceWidthPrefix();
  const pageData =
    spb_page && spb_page.items && spb_page.items[0] ? spb_page.items[0] : false;
  const isRtl = pageData && pageData.is_rtl;

  const renderItem = (item, children, parent) => {
    if (item.dataParsed) {
      if (deviceFilterKey === 'm_' && item.dataParsed.hideOnMobile) return '';
      else if (deviceFilterKey === 't_' && item.dataParsed.hideOnTablet)
        return '';
      else if (deviceFilterKey === 'l_' && item.dataParsed.hideOnDesktop)
        return '';
    }
    const itemType = item.type;
    const styles = prepareStyle(item, parent);
    item.stylesParsed = JSON.parse(JSON.stringify(styles));

    if (itemType === 'dropdown') {
      /**
       * Dropdown padding is for dropdown title
       * default padding for dropdown container is zero
       */
      styles.padding = 0;
      styles.paddingTop = 0;
      styles.paddingBottom = 0;
      styles.paddingLeft = 0;
      styles.paddingRight = 0;
    } else if (itemType === 'text_input') {
      styles.padding = 0;
      styles.overflow = 'hidden';
    }

    if (item.type === 'partial_slider') {
      styles.flexDirection = 'row';
      styles.flexWrap = 'nowrap';
    }

    if (item && ['html_video', 'youtube_video'].includes(item.type)) {
      let data = {};
      if (item.data && typeof item.data === 'object') {
        data = item.data;
      } else if (item.dataParsed) {
        try {
          data = item.dataParsed;
        } catch (err) {}
      }

      const _size = (data ? data.size : null) || null;
      const _width = (data ? data.width : null) || null;
      const height = 'auto';
      const width = _size || _width || '100%';
      styles.width = width;
      styles.height = height;
      // styles.display = 'block';
    }

    if (item.type === 'tabs') {
      styles.display = 'flex';
      styles.direction = 'ltr';
      if (item.dataParsed) {
        switch (item.dataParsed.tabTitleNavPos) {
          case 'left':
            styles.flexFlow = 'row';
            break;
          case 'right':
            styles.flexFlow = 'row-reverse';
            break;
          case 'bottom':
            styles.flexFlow = 'column-reverse';
            break;
          default:
            styles.flexFlow = 'column';
            break;
        }
      }
    }

    if (item.type === 'category_scroll_1') {
      styles.backgroundImage = 'none';
    }

    const itemProps = {
      id: item && item.entity_id ? `pbitm-id-${item.entity_id}` : null,
      key: `${randomString(5)}${item.root ? 'root' : item.entity_id}`,
      style: styles,
      className: `spb-item ${item.root ? 'spb-item-root' : ''} ${
        item.class_name || ''
      } ${'type_' + (item.type || '')} ${
        item.entity_id ? 'spb-item-id_' + item.entity_id : ''
      }`,
    };

    if (item.dataParsed && item.dataParsed.scrollTo) {
      itemProps.onClick = () => {
        const elmnt = document.getElementsByClassName(item.dataParsed.scrollTo);
        if (elmnt && elmnt.length) elmnt[0].scrollIntoView();
      };
    }
    if (item.dataParsed && item.dataParsed.openUrl && item.type !== 'text') {
      const openUrlInNewTab = parseInt(item.dataParsed.openUrlInNewTab) === 1;
      itemProps.onClick = () => {
        if (
          history &&
          !openUrlInNewTab &&
          item.dataParsed.openUrl.indexOf('http') === -1
        )
          history.push(item.dataParsed.openUrl);
        else {
          if (typeof window !== 'undefined') {
            window.open(
              item.dataParsed.openUrl,
              openUrlInNewTab ? '_blank' : '_self',
            );
          }
        }
      };
    }

    const innerContent = renderInnerContent(item, children, parent);

    if (overRender) {
      const overRendered = overRender(item, itemProps, innerContent);
      if (overRendered) return overRendered;
    }
    if (item.type === 'form_group') {
      const formMethod = item.dataParsed[formSubmitMethod] || 'GET';
      const formURL = item.dataParsed[formSubmitTarget] || '';
      return (
        <form
          key={itemProps.key}
          className="form-builder-artifact"
          action={formURL}
          method={formMethod}
        >
          <div {...itemProps}>{innerContent}</div>
        </form>
      );
    }
    if (
      item.dataParsed &&
      (item.dataParsed.openUrl ||
        item.dataParsed.sendEmail ||
        item.dataParsed.callNumber)
    ) {
      if (
        item.type === 'text' ||
        item.type === 'button' ||
        item.type === 'container' ||
        item.type === 'form_button' ||
        item.type === 'image'
      ) {
        const openUrlInNewTab = parseInt(item.dataParsed.openUrlInNewTab) === 1;
        if (!itemProps.style.textDecoration)
          itemProps.style.textDecoration = 'none';
        if (!itemProps.style.color) itemProps.style.color = 'initial';
        delete itemProps.onClick;
        if (
          Link &&
          item.dataParsed.openUrl &&
          item.dataParsed.openUrl.indexOf('http') === -1
        ) {
          return (
            <Link
              to={item.dataParsed.openUrl}
              target={openUrlInNewTab ? '_blank' : '_self'}
              rel="noreferrer"
              {...itemProps}
            >
              {innerContent}
            </Link>
          );
        }
        let aHref = item.dataParsed.openUrl;
        if (item.dataParsed.sendEmail)
          aHref = 'mailto: ' + item.dataParsed.sendEmail;
        else if (item.dataParsed.callNumber)
          aHref = 'tel:' + item.dataParsed.callNumber;
        return (
          <a
            href={aHref}
            target={openUrlInNewTab ? '_blank' : '_self'}
            rel="noreferrer"
            {...itemProps}
          >
            {innerContent}
          </a>
        );
      }
    }
    if (item.type === 'button' || item.type === 'form_button') {
      const buttonType = item.dataParsed
        ? item.dataParsed[buttonTypeFieldName]
        : 'button';
      return (
        <button type={buttonType} {...itemProps}>
          {innerContent}
        </button>
      );
    }

    return <div {...itemProps}>{innerContent}</div>;
  };

  const renderInnerContent = (item, children, parent) => {
    const dataParsed = item.dataParsed ? item.dataParsed : {};
    if (item.type === 'slider') {
      const slideSettings = {
        autoPlay: parseInt(dataParsed.sliderAutoSlide) === 1,
        showArrows: parseInt(dataParsed.showSliderNavBtn) !== 0,
        showThumbs: false,
        showIndicators:
          parseInt(dataParsed.showSliderIndicator) === 0
            ? false
            : !!(children.length && children.length !== 1),
        showStatus: false,
        infiniteLoop: parseInt(dataParsed.sliderInfiniteLoop) !== 0,
        transitionTime: !parseInt(dataParsed.sliderTransitionTime)
          ? dataParsed.sliderTransitionTime
          : 350,
      };
      if (isRtl) {
        slideSettings.selectedItem = children.length - 1;
        slideSettings.autoPlay = false;
      }
      const cChild = children.filter((itm) => itm !== '');
      return cChild[0];
    }
    if (item.type === 'partial_slider') {
      const showArrow = parseInt(dataParsed.showSliderNavBtn) !== 0;
      const showIndicators =
        parseInt(dataParsed.showSliderIndicator) === 0
          ? false
          : !!(children.length && children.length !== 1);
      return (
        <PartialSlider
          item={item}
          isRtl={isRtl}
          showArrow={showArrow}
          showIndicators={showIndicators}
        >
          {children}
        </PartialSlider>
      );
    }

    if (item.type === 'button' || item.type === 'form_button') {
      return (
        <Button item={item} formatMessage={formatMessage}>
          {children.length ? children : ''}
        </Button>
      );
    }

    return (
      <React.Fragment>
        <Innercontent
          item={item}
          parent={parent}
          formatMessage={formatMessage}
          ProductList={ProductList}
          ProductGrid={ProductGrid}
          Category={Category}
          ProductScroll={ProductScroll}
          CategoryScroll={CategoryScroll}
          deviceFilterKey={deviceFilterKey}
        />
        {children.length ? children : ''}
      </React.Fragment>
    );
  };

  const prepareStyle = (item, parent) => {
    const defaultStyles = {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      direction: isRtl ? 'rtl' : 'ltr',
    };
    let style = defaultStyles;
    if (item && item.stylesParsed) {
      try {
        const _itemStyle = JSON.parse(
          JSON.stringify(item.stylesParsed) || '{}',
        );
        const itemStyle = {..._itemStyle};

        // add device styles
        Object.keys(itemStyle).forEach((key) => {
          if (key.includes(deviceFilterKey)) {
            const styleKey = key.replace(deviceFilterKey, '');
            itemStyle[styleKey] = itemStyle[key];
          }
        });

        if (itemStyle.widthPercent) {
          itemStyle.width = parseInt(itemStyle.widthPercent, 10) + '%';
          delete itemStyle.widthPercent;
        }
        if (itemStyle.widthPixel) {
          itemStyle.width = parseInt(itemStyle.widthPixel, 10) + 'px';
          delete itemStyle.widthPixel;
        }
        if (itemStyle.heightPixel) {
          if (itemStyle.heightPixel === 'auto')
            itemStyle.height = itemStyle.heightPixel;
          else itemStyle.height = parseInt(itemStyle.heightPixel, 10) + 'px';
          delete itemStyle.heightPixel;
        }
        style = {...style, ...itemStyle};
      } catch (err) {
        console.warn(err);
      }
    }
    if (parent && parent.type === 'slider') {
      const parentSliderHeight =
        parent.stylesParsed &&
        (parent.stylesParsed[deviceFilterKey + 'heightPixel'] ||
          parent.stylesParsed.heightPixel);
      if (parentSliderHeight) {
        style.height = parseInt(parentSliderHeight) + 'px';
        // style.overflowY = 'hidden';
      }
    }
    if (item && item.type !== 'image' && item.type !== 'category') {
      if (item.dataParsed) {
        const itemData = item.dataParsed;
        if (itemData && itemData.image) {
          style.backgroundImage = `url("${itemData.image}")`;
        }
      }
    }
    if (item && item.type === 'slider') {
      style.direction = 'ltr';
    }

    return style;
  };

  /*
    Recursive render
    */

  const recursiveRender = (childrenArray, parent) => {
    const returnedItems = [];
    if (childrenArray) {
      childrenArray.map((item) => {
        const children = recursiveRender(item.children, item);
        returnedItems.push(renderItem(item, children, parent));
        return null;
      });
    }
    return returnedItems;
  };

  const renderItems = (itemTree) => {
    const children = recursiveRender(itemTree.children);
    return renderItem({root: true}, children);
  };

  const rootItem = {
    id: 'root',
  };
  let newTree;
  if (spb_item) {
    newTree = JSON.parse(JSON.stringify(spb_item.items));
  } else {
    newTree = JSON.parse(spb_page.items[0].publish_items);
  }
  newTree = listToTree(newTree);
  rootItem.children = newTree;
  return (
    <div className="smpb-container" style={{direction: isRtl ? 'rtl' : 'ltr'}}>
      {renderItems(rootItem)}
    </div>
  );
};

export default PbContent;
