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
      resolve: "gatsby-plugin-firebase",
      options: {
        features: {
          auth: true,
          firestore: true
        },
        credentials: {
          apiKey: "AIzaSyBYqZhiCKPRDMKMZI7-o6BaGV3dG3xKR40",
          authDomain: "trnrvtng.firebaseapp.com",
          databaseURL: "<YOUR_FIREBASE_DATABASE_URL>",
          projectId: "trnrvtng",
          storageBucket: "trnrvtng.appspot.com",
          messagingSenderId: "116633660030",
          appId: "1:116633660030:web:f51c3f1964dd121a66c62f"
        }
      }
    },
    `gatsby-plugin-sitemap`,
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        query: `
        {
          allContentfulNews {
            group(field: {contentful_id: SELECT}) {
              nodes {
                slug
                updatedAt
                year: publicationDate(formatString: "Y")
              }
            }
          }
          allContentfulPages {
            group(field: {contentful_id: SELECT}) {
              nodes {
                slug
                updatedAt
              }
            }
          }
          allContentfulTurnierbericht {
            group(field: {contentful_id: SELECT}) {
              nodes {
                slug
                year: date(formatString: "Y")
                updatedAt
              }
            }
          }
      }`,
        resolveSiteUrl: () => siteUrl,
        resolvePages:
          ({
             allContentfulNews: { group: news },
             allContentfulPages: { group: pages },
             allContentfulTurnierbericht: { group: tournaments }
           }) => {
            const newsEntries = news.map((page) => {
              const news = page.nodes[0];
              const uri = `/news/${news.year}/${news.slug}/`;
              return { path: uri.toLowerCase(), lastmod: news.updatedAt };
            });
            const pageEntries = pages.map((page) => {
              const x = page.nodes[0];
              switch (x.slug) {
                case "home":
                  return { path: "/", lastmod: x.updatedAt };
                case "contact":
                  return { path: "/kontakt/", lastmod: x.updatedAt };
                case "imprint":
                  return { path: "/impressum/", lastmod: x.updatedAt };
                case "ultimate":
                  return { path: "/was_ist_ultimate/", lastmod: x.updatedAt };
                case "links":
                  return { path: "/links/", lastmod: x.updatedAt };
                case "privacy":
                  return { path: "/datenschutz/", lastmod: x.updatedAt };
                default:
                  return { path: x.slug, lastmod: x.updatedAt };
              }
            });
            const tournamentEntries = tournaments.map((page) => {
              const tournament = page.nodes[0];
              const uri = `/turniere/${tournament.year}/${tournament.slug}/`;
              return { path: uri.toLowerCase(), lastmod: tournament.updatedAt };
            });
            console.log({ pages: [...pageEntries, ...newsEntries] });
            return [...pageEntries, ...newsEntries, ...tournamentEntries];
          },
        serialize:
          ({
             path,
             lastmod,
             changefreq,
             priority
           }) => {
            return {
              url: `${siteUrl}${path}`,
              lastmod,
              changefreq,
              priority
            };
          }
      }
    }]
};