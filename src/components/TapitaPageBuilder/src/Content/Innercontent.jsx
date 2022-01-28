import React, {Fragment} from 'react';
import {HtmlVideo} from './HTMLVideo/HTMLVideo';
import {Tab} from './Tab/index';
import {icons} from './icons/icons';
import {randomString} from '../Helper/Data';
import {Dropdown} from './Dropdown/index';

export const customIconDefKey = 'is-custom-icon';
export const customIcon = 'custom-icon';

const Innercontent = (props) => {
  const {
    item,
    parent,
    ProductList,
    ProductGrid,
    Category,
    formatMessage,
    ProductScroll,
    CategoryScroll,
    deviceFilterKey,
  } = props;

  if (!item || !item.entity_id) return '';

  let data = {};
  if (item.data && typeof item.data === 'object') {
    data = {...item.data};
  } else if (item.dataParsed) {
    data = {...item.dataParsed};
  }
  Object.keys(data).forEach((key) => {
    if (key.includes(deviceFilterKey)) {
      const styleKey = key.replace(deviceFilterKey, '');
      data[styleKey] = data[key];
    }
  });
  const styles = item.stylesParsed || {};
  const dataParsed = item.dataParsed || {};

  if (item.type === 'text') {
    const textValue = item.name ? item.name : 'Your Text Go Here';
    const translatedText = formatMessage({val: textValue});
    if (item.dataParsed && item.dataParsed.textTag) {
      const TextTag = item.dataParsed.textTag;
      const textStyle = {};
      const {
        stylesParsed: {
          fontSize,
          fontStyle,
          textDecoration,
          fontWeight,
          fontFamily,
          lineHeight,
        },
      } = item;
      if (fontSize) textStyle.fontSize = fontSize;
      if (fontStyle) textStyle.fontStyle = fontStyle;
      if (textDecoration) textStyle.textDecoration = textDecoration;
      if (fontWeight) textStyle.fontWeight = fontWeight;
      if (fontFamily) textStyle.fontFamily = fontFamily;
      if (lineHeight) textStyle.lineHeight = lineHeight;
      return <TextTag style={textStyle}>{translatedText}</TextTag>;
    }
    return translatedText;
  } else if (item.type === 'tabs') {
    return <Tab item={item} />;
  } else if (item.type === 'dropdown') {
    return <Dropdown item={item} formatMessage={formatMessage} />;
  } else if (item.type === 'image') {
    if (data.image) {
      const alt = formatMessage({
        val: (data.alt !== undefined ? data.alt : 'Image') || '',
      });
      const title = formatMessage({
        val: (data.title !== undefined ? data.title : '') || '',
      });
      return (
        <img
          src={data.image}
          alt={alt}
          title={title}
          style={{
            width: data.width || '100%',
            height: data.height || '100%',
            objectFit:
              item.stylesParsed && item.stylesParsed.objectFit
                ? item.stylesParsed.objectFit
                : 'cover',
          }}
        />
      );
    }
  } else if (item.type === 'category') {
    if (Category)
      return (
        <Category
          item={item}
          formatMessage={formatMessage}
          data={data}
          styles={styles}
        />
      );
    else return '';
  } else if (item.type === 'product_scroll') {
    if (ProductList)
      return (
        <ProductList
          item={item}
          formatMessage={formatMessage}
          data={data}
          styles={styles}
        />
      );
    else return '';
  } else if (item.type === 'product_grid') {
    if (ProductGrid)
      return (
        <ProductGrid
          item={item}
          formatMessage={formatMessage}
          data={data}
          styles={styles}
        />
      );
    else return '';
  } else if (item.type === 'product_scroll_1') {
    if (ProductScroll)
      return (
        <ProductScroll
          item={item}
          formatMessage={formatMessage}
          data={data}
          styles={styles}
        />
      );
    else return '';
  } else if (item.type === 'category_scroll_1') {
    if (CategoryScroll)
      return (
        <CategoryScroll
          item={item}
          formatMessage={formatMessage}
          data={data}
          styles={styles}
        />
      );
    else return '';
  } else if (item.type === 'paragraph') {
    return <div dangerouslySetInnerHTML={{__html: data.paragraphContent}} />;
  } else if (['html_video', 'youtube_video'].includes(item.type)) {
    const imgCover = (data ? data.imageCover : null) || null;
    const size = (data ? data.size : null) || null;
    const width = (data ? data.width : null) || null;
    const videoURL = (data ? data.videoURL : null) || '';
    const showControl =
      data && data.showControl !== undefined ? data.showControl : true;

    if (item.type === 'html_video') {
      return (
        <Fragment>
          <HtmlVideo
            width={width}
            size={size}
            showControl={showControl}
            imgCover={imgCover}
            videoURL={videoURL}
            formatMessage={formatMessage}
          />
        </Fragment>
      );
    } else if (item.type === 'youtube_video') {
      return '';
    }
  } else if (item.type === 'share_button') {
    return '';
  } else if (item.type === 'instagram') {
    return '';
  } else if (item.type === 'custom_html') {
    if (data.htmlContent)
      return <div dangerouslySetInnerHTML={{__html: data.htmlContent}} />;
  } else if (item.type === 'icon') {
    const shouldUseCustomIcon = data[customIconDefKey];
    const customIconValue = data[customIcon] || '';
    if (shouldUseCustomIcon) {
      return <i className={customIconValue} />;
    }
    if (data.icon && icons[data.icon]) return icons[data.icon];
  } else if (item.type === 'text_input') {
    const placeholder = data ? data.placeholder : '';
    const applicableStyleAttr = [
      'padding',
      'paddingTop',
      'paddingBottom',
      'paddingLeft',
      'paddingRight',
      'fontWeight',
      'fontSize',
      'border',
      'borderRadius',
      'lineHeight',
      'color',
      'fontFamily',
      'width',
      'height',
      'widthPixel',
      'heightPixel',
      'maxWidth',
      'maxHeight',
      'minWidth',
      'minHeight',
    ];
    // padding for input behave differently from others,
    // so the above style can not be used in outer container

    const miniStyle = Object.entries(styles)
      .filter(([k, v]) => {
        return applicableStyleAttr.includes(k);
      })
      .reduce((acc, [k, v]) => {
        acc[k] = v;
        return acc;
      }, {});

    if (miniStyle.widthPixel !== undefined) {
      miniStyle.width = miniStyle.widthPixel;
    }
    if (miniStyle.heightPixel !== undefined) {
      miniStyle.height = miniStyle.heightPixel;
    }
    miniStyle.border = 'none';
    return (
      <input
        type="text"
        placeholder={placeholder}
        style={{...miniStyle, height: '100%'}}
      />
    );
  }
  return '';
};

export default Innercontent;
