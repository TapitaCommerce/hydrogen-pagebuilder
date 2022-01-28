import React from 'react';
import {randomString} from '../../Helper/Data';

export const Tab = (props) => {
  const {item} = props;
  const selectedTab = 0;
  const navId = 'tab_nav_ctn_' + randomString(10);
  const itemChildren =
    item && item.children && item.children.length ? item.children : [];
  return (
    <div
      id={navId}
      className={`spbitem-tab-nav ${
        item.dataParsed &&
        (item.dataParsed.tabTitleNavPos === 'left' ||
          item.dataParsed.tabTitleNavPos === 'right')
          ? 'vertical'
          : 'horizontal'
      }`}
    >
      {itemChildren.map((childItem, childIndx) => {
        return (
          <div
            key={childItem.entity_id}
            className={`spbitem-tab-nav-item ${
              selectedTab === childIndx ? 'active' : 'inactive'
            }`}
          >
            {childItem.name}
          </div>
        );
      })}
    </div>
  );
};
