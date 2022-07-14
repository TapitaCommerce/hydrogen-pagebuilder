const maskedRegex = /^\w{32,65}$/;

export const validateMaskedId = (m) => {
  return !!m && maskedRegex.test(m);
};
