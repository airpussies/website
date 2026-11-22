import React from "react"

export const SITE_URL = "https://www.airpussies.berlin"
const DEFAULT_IMAGE = `${SITE_URL}/team.jpg`

// The team as schema.org entity — embedded in the structured data of
// every page that mentions it (home, events, news publisher).
export const team = {
  "@type": "SportsTeam",
  "@id": `${SITE_URL}/#team`,
  name: "air pussies",
  sport: "Ultimate Frisbee",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/icons/android-chrome-512x512.png`,
  image: DEFAULT_IMAGE,
  location: {
    "@type": "Place",
    name: "Berlin-Wedding",
    address: { "@type": "PostalAddress", addressLocality: "Berlin", addressCountry: "DE" },
  },
  sameAs: ["https://www.instagram.com/airpussies/"],
}

// <script type="application/ld+json">; "<" escaped so CMS text can't close the tag
export const JsonLd = ({ data }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({ "@context": "https://schema.org", ...data }).replace(/</g, "\\u003c"),
    }}
  />
)

/**
 * Everything every page's <head> needs. Use it from each page's `Head` export:
 *   export const Head = ({ location }) => <Seo title="…" description="…" pathname={location.pathname}/>
 * `noindex` pages (login, 404) get a robots noindex instead of a canonical.
 */
export default function Seo({ title, description, pathname, image, type = "website", noindex, children }) {
  const fullTitle = `air pussies — ${title}`.replace(/\s+/g, " ").trim() // CMS titles carry stray spaces
  const url = `${SITE_URL}${pathname}`
  return (
    <>
      <html lang="de" />
      <body className="has-navbar-fixed-top" />
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {noindex ? <meta name="robots" content="noindex" /> : <link rel="canonical" href={url} />}
      <meta property="og:site_name" content="air pussies" />
      <meta property="og:locale" content="de_DE" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image || DEFAULT_IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" />
      {children}
    </>
  )
}
