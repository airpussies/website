import React from "react";
import * as PropTypes from "prop-types"
import Img from "gatsby-image";
import Layout from "../components/layout"
import { graphql } from 'gatsby'

const propTypes = {
  data: PropTypes.object.isRequired,
}


class NewsTemplate extends React.Component {

  render() {
    const news = this.props.data.contentfulNews;
    const {
      headline,
      teaser,
      publicationDate,
      body
    } = news;

    let maybeTeaser;
    if (teaser !== null) {
      maybeTeaser = <Img alt={headline} fluid={teaser.fluid}/>;
    }
    return (

      <Layout>
        <h1 className="is-1 title">{headline}</h1>
        {maybeTeaser}
        <div className="wrapper">
          <p style={{display: 'block'}}>{publicationDate}</p>
          <div dangerouslySetInnerHTML={{__html: body.childMarkdownRemark.html}}/>
        </div>

      </Layout>
    )
  }
}

NewsTemplate.propTypes = propTypes
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
      publicationDate(formatString: "DD.MM.YYYY")
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