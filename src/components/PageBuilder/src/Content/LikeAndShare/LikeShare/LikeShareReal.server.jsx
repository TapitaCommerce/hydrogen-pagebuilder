import React from 'react';

const DEFAULT_WIDTH_1 = 131;
const DEFAULT_HEIGHT_1 = 30;

const DEFAULT_WIDTH_2 = 168;
const DEFAULT_HEIGHT_2 = 30;

const DEFAULT_WIDTH_3 = 76;
const DEFAULT_HEIGHT_3 = 93;

const DEFAULT_WIDTH_4 = 403;
const DEFAULT_HEIGHT_4 = 31;

const translateButtonType = (type) => {
	if (type === 1) {
		return 'button';
	} else if (type === 2) {
		return 'button_count';
	} else if (type === 3) {
		return 'box_count';
	} else if (type === 4) {
		return 'standard';
	} else {
		return 'button';
	}
};

const translateButtonDimension = (type) => {
	if (type === 1) {
		return {
			width: DEFAULT_WIDTH_1,
			height: DEFAULT_HEIGHT_1,
		};
	} else if (type === 2) {
		return {
			width: DEFAULT_WIDTH_2,
			height: DEFAULT_HEIGHT_2,
		};
	} else if (type === 3) {
		return {
			width: DEFAULT_WIDTH_3,
			height: DEFAULT_HEIGHT_3,
		};
	} else if (type === 4) {
		return {
			width: DEFAULT_WIDTH_4,
			height: DEFAULT_HEIGHT_4,
		};
	} else {
		return {
			width: DEFAULT_WIDTH_1,
			height: DEFAULT_HEIGHT_1,
		};
	}
};

export const LikeShareReal = (props) => {
	const { likeURL: url, appID, type = 1 } = props;
	if (!url) {
		return <div />;
	}

	const encodedShareLink = encodeURIComponent(url);
	const buttonType = translateButtonType(type);
	const { width, height } = translateButtonDimension(type);

	const src =
		'https://www.facebook.com/plugins/like.php?' +
		`href=${encodedShareLink}&width=${width}` +
		`&layout=${buttonType}&action=like` +
		`&size=large&share=true&height=${height}` +
		`&appId${appID ? `=${appID}` : ''}`;

	return (
		<div>
			<iframe
				src={src}
				width={width}
				height={height}
				style={{ border: 'none', overflow: 'hidden' }}
				scrolling='no'
				frameBorder='0'
				allowFullScreen='true'
				allow='autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share'
			/>
		</div>
	);
};
