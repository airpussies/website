const _ = require(`lodash`);
const path = require("path");
const { slash } = require(`gatsby-core-utils`);

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const news_result = await graphql(`
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
  );
  // Handle errors
  if (news_result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }


  const newsTemplate = path.resolve("./src/templates/news.js");

  news_result.data.allContentfulNews.edges.forEach(edge => {
    // console.log(`createPage(news, ${edge.node.year}/${edge.node.slug.toLowerCase()})`)
    createPage({
      path: `/news/${edge.node.year}/${edge.node.slug.toLowerCase()}/`,
      component: slash(newsTemplate),
      context: {
        slug: edge.node.slug
      }
    });
  });

  const tournament_result = await graphql(`
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
    `
  );
  // Handle errors
  if (tournament_result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  const tournament_template = path.resolve("./src/templates/report.js");

  tournament_result.data.allContentfulTurnierbericht.edges.forEach(edge => {
    // console.log(`createPage(report, ${edge.node.year}/${edge.node.slug})`)
    createPage({
      path: `/turniere/${edge.node.year}/${edge.node.slug.toLowerCase()}/`,
      component: slash(tournament_template),
      context: {
        slug: edge.node.slug
      }
    });
  });
};