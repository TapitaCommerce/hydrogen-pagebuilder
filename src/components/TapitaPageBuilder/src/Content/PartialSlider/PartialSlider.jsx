import React from 'react';

let slidedTheSlider = false;
const childByPos = [];

export const PartialSlider = (props) => {
  const {item} = props;
  const {name, children} = item;
  const unqId = 'smpb-partial-slider-' + item.entity_id;
  const dataParsed = item.dataParsed || {};
  const numberOfSteps = 0;
  const currentIndex = 0;

  const handleScroll = (index) => {
    if (currentIndex !== index) {
      setCurrentIndex(index);
    }
  };
  const numberOfChildren =
    children instanceof Array ? children.length : children ? 1 : 0;

  const scrollToIndex = (index) => {
    if (numberOfChildren <= 1) {
      // no where to scroll
    } else if (children[index]) {
      const elements = document.querySelector(
        `.${unqId}.partial-slider-child-container`,
      ).children;
      const target = elements.item(index);
      target.scrollIntoView({block: 'nearest', inline: 'start'});
    }
  };

  if (!numberOfChildren) return '';

  let indicators = [];
  if (numberOfSteps && dataParsed.showSliderIndicator) {
    for (let index = 0; index <= numberOfSteps; index++) {
      indicators.push(
        <div
          key={index}
          className={`partial-slider-dot ${
            index === currentIndex ? 'active' : ''
          }`}
          onClick={(e) => handleScroll(index)}
        />,
      );
    }
    indicators = <div className="partial-slider-dots">{indicators}</div>;
  }
  return (
    <React.Fragment>
      {dataParsed &&
      dataParsed.showSliderNavBtn &&
      numberOfSteps &&
      currentIndex > 0
        ? ''
        : ''}

      {dataParsed &&
      dataParsed.showSliderNavBtn &&
      numberOfSteps &&
      currentIndex < numberOfSteps
        ? ''
        : ''}
      <div className={`${unqId} partial-slider-child-container`}>
        {props.children}
      </div>
      {indicators}
    </React.Fragment>
  );
};
