import { useLayoutEffect, useState } from 'react';

export const useWindowSize = () => {
	const [size, setSize] = useState({
		width:
			typeof window !== 'undefined'
				? window.smpbWindowWidth ||
				  Math.max(
						document.documentElement.clientWidth || 0,
						window.innerWidth || 0,
				  )
				: 1440,
		height:
			typeof window !== 'undefined'
				? window.smpbWindowHeight || window.innerHeight
				: 1440,
	});
	return size;
};
