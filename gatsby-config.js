/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  pathPrefix: "/website",
  siteMetadata: {
    title: `air pussies`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: `f8cmlwci71xg`,
        // Learn about environment variables: https://gatsby.dev/env-vars
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
        downloadLocal: true
      }
    },
    `gatsby-transformer-remark`,
    'gatsby-plugin-sharp',
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
            type: `image/png`,
          },
          {
            src: `/favicons/android-chrome-512x512.png`,
            sizes: `512x512`,
            type: `image/png`,
          }
        ]
      }
    },
    {
      resolve: "gatsby-plugin-firebase",
      options: {
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
    }
  ]
}