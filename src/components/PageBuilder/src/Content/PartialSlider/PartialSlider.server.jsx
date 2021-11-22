import React, { Component, useRef, useState, useEffect } from 'react';
import { ReactComponent as ChevronBack } from '../images/icons/chevron-back-sharp.svg';
import { ReactComponent as ChevronForward } from '../images/icons/chevron-forward-sharp.svg';

let slidedTheSlider = false;
const childByPos = [];

export const PartialSlider = (props) => {
	const { item } = props;
	const { name, children } = item;
	const unqId = 'smpb-partial-slider-' + item.entity_id;
	const dataParsed = item.dataParsed || {};
	const [currentIndex, setCurrentIndex] = useState(0);
	const containerRef = useRef(null);

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
			target.scrollIntoView({ block: 'nearest', inline: 'start' });
		}
	};

	const [numberOfSteps, setNumberOfSteps] = useState(0);

	useEffect(() => {
		// first sliding event
		if (currentIndex === 0) {
			if (!slidedTheSlider) return;
		} else slidedTheSlider = true;
		// scroll by js
		scrollToIndex(currentIndex);
	}, [currentIndex]);

	// calculate the steps
	useEffect(() => {
		// wait for images to render, for better sure, set the min width to each child item
		setTimeout(function () {
			const childContainerEl = document.querySelector(
				`.${unqId}.partial-slider-child-container`,
			);
			if (childContainerEl) {
				const elements = Array.from(childContainerEl.children);
				let itemToMinus = 0;
				let widthFromEnd = 0;
				for (let indx = elements.length - 1; indx >= 0; indx--) {
					const target = elements[indx];
					childByPos[elements.length - (1 + indx)] = widthFromEnd;
					widthFromEnd += target.offsetWidth;
					if (widthFromEnd < childContainerEl.offsetWidth) {
						itemToMinus++;
					}
				}
				if (itemToMinus < numberOfChildren)
					setNumberOfSteps(numberOfChildren - itemToMinus);
				else setNumberOfSteps(numberOfChildren);
			}
		}, 1000);
	}, []);

	if (!numberOfChildren) return '';

	const onSliderTouchEnd = () => {
		if (containerRef && containerRef.current) {
			const containerScrollLeft = containerRef.current.scrollLeft;
			let nearestVal = 999999;
			let nearestIndx = 0;
			childByPos.map((childItmByPos, childIndx) => {
				const distance = Math.abs(childItmByPos - containerScrollLeft);
				if (nearestVal >= distance) {
					nearestIndx = childIndx;
					nearestVal = distance;
				}
			});
			if (currentIndex !== nearestIndx) handleScroll(nearestIndx);
			else scrollToIndex(nearestIndx);
		}
	};

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
		indicators = <div className='partial-slider-dots'>{indicators}</div>;
	}
	return (
		<React.Fragment>
			{dataParsed &&
			dataParsed.showSliderNavBtn &&
			numberOfSteps &&
			currentIndex > 0 ? (
				<div
					className='partial-slider-navic partial-slider-back-ic'
					onClick={(e) => {
						if (currentIndex > 0) handleScroll(currentIndex - 1);
					}}
				>
					<ChevronBack />
				</div>
			) : (
				''
			)}

			{dataParsed &&
			dataParsed.showSliderNavBtn &&
			numberOfSteps &&
			currentIndex < numberOfSteps ? (
				<div
					className='partial-slider-navic partial-slider-next-ic'
					onClick={(e) => {
						if (currentIndex < numberOfSteps) handleScroll(currentIndex + 1);
					}}
				>
					<ChevronForward />
				</div>
			) : (
				''
			)}
			<div
				className={`${unqId} partial-slider-child-container`}
				ref={containerRef}
				onTouchEnd={onSliderTouchEnd}
			>
				{props.children}
			</div>
			{indicators}
		</React.Fragment>
	);
};
