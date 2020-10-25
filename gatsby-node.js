const _ = require(`lodash`)
const path = require('path')
const {slash} = require(`gatsby-core-utils`)

exports.createPages = ({graphql, actions}) => {
  const {createPage} = actions

  return graphql(
    `
      {
        allContentfulNews {
          edges {
            node {
              year: publicationDate(formatString: "Y")
              slug
            }
          }
        }
      }
    `
  )
    .then(result => {
      if (result.errors) {
        console.log(result.errors)
        throw result.errors
      }

      const newsTemplate = path.resolve('./src/templates/news.js')

      _.each(result.data.allContentfulNews.edges, edge => {
        console.log(`createPage(news, ${edge.node.year}/${edge.node.slug})`)
        createPage({
          path: `/news/${edge.node.year}/${edge.node.slug}/`,
          component: slash(newsTemplate),
          context: {
            slug: edge.node.slug
          },
        })
      })
    })
    .then(() => {
      graphql(`
      {
        allContentfulTurnierbericht {
          edges {
            node {
              slug
              year: date(formatString: "Y")
            }
          }
        }
      }
`)
        .then(result => {
          if (result.errors) {
            console.log(result.errors)
            throw result.errors
          }

          const newsTemplate = path.resolve('./src/templates/report.js')

          _.each(result.data.allContentfulTurnierbericht.edges, edge => {
            console.log(`createPage(report, ${edge.node.year}/${edge.node.slug})`)
            createPage({
              path: `/turnierberichte/${edge.node.year}/${edge.node.slug}/`,
              component: slash(newsTemplate),
              context: {
                slug: edge.node.slug
              },
            })
          })
        })
    })
}