const getPrefix = (width) =>
  width >= 1280 ? 'l_' : width >= 1024 ? 't_' : 'm_';

// for future on resize responsiveness
export const useDeviceWidthPrefix = (props) => {
  //const {width} = useWindowSize();
  return getPrefix(1280);
};
