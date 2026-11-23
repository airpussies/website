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

// Plain-text meta description from markdown/HTML source: tags stripped,
// whitespace collapsed, cut at a word boundary to ~155 chars.
export const toDescription = (source, max = 155) => {
  const text = source.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return text.slice(0, text.lastIndexOf(" ", max)) + "…";
};

// Not Intl: short month names differ between Node's and the browser's ICU data ("Mär" vs "März"),
// which would break hydration.
const MONTHS = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

// date badge on tournament cards: { day: "7", month: "Nov" }, the calendar date as entered
export const dayAndMonth = iso => {
  const date = new Date(iso.slice(0, 10));
  return { day: String(date.getUTCDate()), month: MONTHS[date.getUTCMonth()] };
};

export const FIELD_TYPES = { grass: "Rasen", indoor: "Halle", sand: "Beach", "artificial turf": "Kunstrasen" };
