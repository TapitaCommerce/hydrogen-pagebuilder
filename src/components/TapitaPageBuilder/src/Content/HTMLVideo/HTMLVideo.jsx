import React, { Fragment } from 'react';
const NO_SUPPORT = 'Your browser does not support the video tag.';

export const _HtmlVideo = (props) => {
	const { width, size, showControl, imgCover, videoURL, formatMessage } = props;

	if (!videoURL) {
		return '';
	}

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<video
				width='100%'
				height='auto'
				controls={showControl || false}
				poster={imgCover || undefined}
			>
				<source src={videoURL} />
				{formatMessage({ val: NO_SUPPORT })}
			</video>
		</div>
	);
};

export const HtmlVideo = React.memo(_HtmlVideo, (prevProps, nextProps) => {
	const { width, size, showControl, videoURL, imgCover } = prevProps || {};
	const { width1, size1, showControl1, videoURL1, imgCover1 } = nextProps || {};

	return (
		width === width1 &&
		size === size1 &&
		showControl === showControl1 &&
		videoURL === videoURL1 &&
		imgCover === imgCover1
	);
});
