export const findPriortizedCatalog = (tapitaBlocks) => {
  if (!tapitaBlocks?.length) {
    return null;
  }
  const mirrorBlocks = [...tapitaBlocks];

  mirrorBlocks.sort((el1, el2) => {
    if (el1.apply_by) {
      if (el2.apply_by) {
        if (el2.apply_by !== el1.apply_by) {
          const valueTable = {
            product_sku: 5,
            product_type: 4,
            category_id: 3,
          };
          return valueTable[el2.apply_by] - valueTable[el1.apply_by];
        }
      } else {
        return -1;
      }
    } else if (el2.apply_by) {
      return 1;
    }
    return parseInt(el2.priority) - parseInt(el1.priority);
  });

  return mirrorBlocks[0];
};
