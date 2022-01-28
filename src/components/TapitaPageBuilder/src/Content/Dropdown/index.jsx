import React from 'react';

export const Dropdown = (props) => {
  const {item, formatMessage} = props;

  let title = item.name ? item.name : 'Your Dropdown Title';
  title = formatMessage({
    val: title,
  });
  return (
    <div className="smpb-dropdown-title">
      <div className="smpb-dropdown-title-text">{title}</div>
    </div>
  );
};
