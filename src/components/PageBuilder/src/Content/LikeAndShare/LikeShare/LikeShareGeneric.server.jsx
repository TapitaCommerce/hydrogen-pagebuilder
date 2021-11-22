import React from 'react';
import { LikeShareReal } from './LikeShareReal.server';
import { tryParseJSON } from '../../../Helper/tryParseJSON';

export const LikeShareGeneric = (props) => {
	const { item } = props;

	const parsedStyle = tryParseJSON(item.styles, {});
	const type = parsedStyle.type;
	const parsedData = item.dataParsed
		? item.dataParsed
		: tryParseJSON(item.data, {});

	const { likeURL, appID } = parsedData;

	if (!likeURL) {
		return '';
	}

	return (
		<div>
			<LikeShareReal likeURL={likeURL} appID={appID} type={type} />
		</div>
	);
};
