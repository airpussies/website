require("dotenv").config({ quiet: true });

/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */
const siteUrl = process.env.URL || `https://www.airpussies.berlin`;

module.exports = {
  siteMetadata: {
    title: `air pussies`,
    siteUrl: siteUrl,
    description: `Website des Ultimate Frisbee Teams "air pussies"`
  },
  pathPrefix: "/website",
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    {
      resolve: "gatsby-source-contentful",
      options: {
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        // Learn about environment variables: https://gatsby.dev/env-vars
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
        downloadLocal: true
      }
    },
    `gatsby-transformer-remark`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `air pussies`,
        short_name: `air pussies`,
        start_url: `/`,
        legacy: true,
        background_color: `#f5f5f5`,
        theme_color: `#349663`,
        display: `standalone`,
        icon: `static/icons/icon.jpg`,
        icons: [
          {
            src: `/favicons/android-chrome-192x192.png`,
            sizes: `192x192`,
            type: `image/png`
          },
          {
            src: `/favicons/android-chrome-512x512.png`,
            sizes: `512x512`,
            type: `image/png`
          }
        ]
      }
    },
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        // The URL list comes from the pages Gatsby actually built (allSitePage);
        // Contentful only supplies lastmod. 404 pages are excluded by the plugin.
        excludes: ["/users/*"],
        query: `
        {
          allSitePage { nodes { path } }
          allContentfulNews { nodes { slug updatedAt year: publicationDate(formatString: "Y") } }
          allContentfulPages { nodes { slug updatedAt } }
          allContentfulTurnierbericht { nodes { slug updatedAt year: date(formatString: "Y") } }
        }`,
        resolveSiteUrl: () => siteUrl,
        resolvePages: ({
          allSitePage: { nodes: sitePages },
          allContentfulNews: { nodes: news },
          allContentfulPages: { nodes: pages },
          allContentfulTurnierbericht: { nodes: tournaments },
        }) => {
          const pagePaths = { home: "/", contact: "/kontakt/", imprint: "/impressum/", ultimate: "/was_ist_ultimate/", links: "/links/", privacy: "/datenschutz/" };
          const latest = (nodes) => nodes.map((n) => n.updatedAt).sort().at(-1);
          // same path scheme as gatsby-node.js; a mismatch only drops a lastmod, never a URL
          const lastmod = new Map([
            ...pages.map((p) => [pagePaths[p.slug], p.updatedAt]),
            ...news.map((n) => [`/news/${n.year}/${n.slug.toLowerCase()}/`, n.updatedAt]),
            ...tournaments.map((t) => [`/turniere/${t.year}/${t.slug.toLowerCase()}/`, t.updatedAt]),
            ["/news/", latest(news)],
            ["/turniere/", latest(tournaments)],
          ]);
          return sitePages.map(({ path }) => ({ path, lastmod: lastmod.get(path) }));
        },
        serialize: ({ path, lastmod }) => ({ url: `${siteUrl}${path}`, lastmod }),
      }
    }]
};