import React from 'react';

export const SimpleDot = (props) => {
	return (
		<i
			className='zmdi zmdi-circle simple-grey-dot'
			style={{
				opacity: 0.5,
				color: '#000',
				fontSize: '12px',
				marginLeft: 8,
			}}
			{...props}
		/>
	);
};

// have to separate because micro-bundler scope css by changing class => no dynamic class
export const SimpleActiveDot = (props) => {
	return <i className='zmdi zmdi-circle simple-grey-dot active' {...props} />;
};

export const DotWithOrbital = (props) => {
	return <i className='zmdi zmdi-dot-circle orbital-dot' />;
};

export const HorizontalBar = (props) => {
	return <i className='small-horizontal-bar' />;
};

export const FashionableDotPagination = (props) => {
	const {
		numberOfPages = 0,
		currentIndex = 0,
		onChangeIndex: _onChangeIndex,
	} = props || {};

	const pressableBits = [...Array(numberOfPages).keys()].map((x) => {
		const onChangeIndex = () => _onChangeIndex(x);
		const Component = x === currentIndex ? SimpleActiveDot : SimpleDot;
		return <Component key={x.toString()} onClick={onChangeIndex} />;
	});

	return (
		<div className='fashionable-pagination-container'>
			<DotWithOrbital />
			<HorizontalBar />
			{pressableBits}
		</div>
	);
};
