export const findPriortizedPage = (tapitaBlocks) => {
  if (!tapitaBlocks?.length) {
    return null;
  }
  const mirrorBlocks = [...tapitaBlocks];

  mirrorBlocks.sort((el1, el2) => {
    return parseInt(el2.priority) - parseInt(el1.priority);
  });
  return mirrorBlocks[0];
};
