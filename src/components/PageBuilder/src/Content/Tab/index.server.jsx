import React, { useEffect, useState } from 'react';
export const Tab = (props) => {
	const { item } = props;
	const [selectedTab, setSelectedTab] = useState(0);
	const navId = 'tab_nav_ctn_' + item.entity_id;
	const itemChildren =
		item && item.children && item.children.length ? item.children : [];
	useEffect(() => {
		try {
			const children = Array.from(
				document.getElementById(navId).parentElement.children,
			);
			children.map((childNode, childNodeIndx) => {
				if (childNodeIndx === 0) {
					// itself
				} else if (childNodeIndx - 1 !== selectedTab) {
					childNode.style.display = 'none';
				} else {
					const childItem = itemChildren[selectedTab];
					let newDisplayStyle = 'flex';
					if (
						childItem &&
						childItem.stylesParsed &&
						childItem.stylesParsed.display
					)
						newDisplayStyle = childItem.stylesParsed.display;
					childNode.style.display = newDisplayStyle;
				}
			});
		} catch (err) {}
	}, [item, selectedTab]);
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
						onClick={(e) => setSelectedTab(childIndx)}
					>
						{childItem.name}
					</div>
				);
			})}
		</div>
	);
};
