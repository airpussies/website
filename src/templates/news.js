import React from "react";
import Layout from "../components/layout"
import {graphql} from "gatsby";
import Img from 'gatsby-image'
import get from "lodash/get"

class NewsTemplate extends React.Component {
    render() {
        const news = get(this.props, 'data.contentfulNews')

        return (
            <Layout>
                <h1 className="is-1 title">News: {news.headline}</h1>

                <Img alt={news.headline}
                     fluid={news.teaser.fluid}
                />

                <div className="wrapper">
                    <h1 className="section-headline">{news.headline}</h1>
                    <p
                        style={{
                            display: 'block',
                        }}
                    >
                        {news.publicationDate}
                    </p>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: news.body.childMarkdownRemark.html,
                        }}
                    />
                </div>

            </Layout>


        )

    }
}
export default NewsTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    contentfulNews(slug: { eq: $slug }) {
      headline
      publicationDate(formatString: "MMMM Do, YYYY")
      teaser {
        fluid(maxWidth: 1180, background: "rgb:000000") {
          ...GatsbyContentfulFluid_tracedSVG
        }
      }
      body {
        childMarkdownRemark {
          html
        }
      }
    }
  }
`