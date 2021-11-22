export const tryParseJSON = (x, fallback = null) => {
	try {
		return JSON.parse(x);
	} catch (e) {
		// console.log(x);
		// console.warn(e);
		return fallback;
	}
};
