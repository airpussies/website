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
      body,
      author
    } = news;

    let maybeTeaser;
    if (teaser !== null) {
      const {
        fluid,
        title,
        description
      } = teaser;
      maybeTeaser = <figure className={"image"}>
        <Img alt={headline} fluid={fluid}/>
        <figcaption><em>{title}</em> — {description}</figcaption>
      </figure>;
    }

    const formattedDate = new Intl.DateTimeFormat('de', {
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    }).format(new Date(publicationDate))

    return (

      <Layout>
        <h1 className="is-1 title">{headline}</h1>
        <label className={"label"}>von {author}, {formattedDate}</label>
        <div className="wrapper">

          {maybeTeaser}
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
      author
      publicationDate
      teaser {
        fluid(maxWidth: 1180, background: "rgb:000000") {
          ...GatsbyContentfulFluid_tracedSVG
        }
        description
        title
      }
      body {
        childMarkdownRemark {
          html
        }
      }
    }
  }
`