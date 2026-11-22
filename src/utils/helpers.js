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

// Contentful dates carry the editor's offset ("2026-11-07T00:00+02:00").
// Format the calendar date as entered, in UTC, so the build server (Netlify
// runs in UTC) and every browser render the same text — anything
// timezone-dependent here breaks hydration and can show the day before.
export const formatDate = iso =>
  new Intl.DateTimeFormat("de", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso.slice(0, 10)));
