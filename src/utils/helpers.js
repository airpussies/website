export const removeKeyFromObj = (raw, predicate) => {
  return Object.keys(raw)
    .filter(predicate)
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: raw[key]
      };
    }, {});
};

export const count = (data, term) => {
  if (!data) return 0;
  return data.reduce((n, x) => n + (x === term), 0);
};