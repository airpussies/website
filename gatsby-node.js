const _ = require(`lodash`);
const path = require("path");
const { slash } = require(`gatsby-core-utils`);

// The modular Firebase JS SDK (v9+) ships conditional builds per package: a `node`
// build, a `browser` build, etc. Our static site is a pure client-side app
// (Firebase Auth + Firestore in the browser). When webpack resolves with the
// `node` condition active it picks the Node ESM build of `@firebase/auth`
// (and friends), which pulls in `undici` and then imports `node:*` builtins —
// a scheme webpack can't bundle. By preferring the `browser` condition and
// dropping `node`, webpack always bundles the web build.
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      conditionNames: ["browser", "import", "module", "default"],
    },
  });
};

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