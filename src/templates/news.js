import React from "react";
import * as PropTypes from "prop-types"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import { graphql } from 'gatsby'

export function Head({ location, params, data, pageContext }) {
  return (
    <>
      <title>{`air pussies — ${data.contentfulNews.headline}`}</title>
      <meta name="twitter:url" content={`https://www.airpussies.berlin${location.pathname}`} />
      <meta property="og:title" content={`air pussies — ${data.contentfulNews.headline}`} />
      <meta property="og:url" content={`https://www.airpussies.berlin${location.pathname}`} />
      <body className={'has-navbar-fixed-top'}></body>
      <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"/>
    </>
  )
}

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
    console.log(teaser)
    if (teaser !== null) {
      const dynamicImage = getImage(teaser)
      maybeTeaser = <figure className={"image"}>
        <GatsbyImage image={dynamicImage} alt={teaser.title} title={teaser.title}/>
        <figcaption><em>{teaser.title}</em> {teaser.description}</figcaption>
      </figure>
    }

    const formattedDate = new Intl.DateTimeFormat('de', {
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    }).format(new Date(publicationDate))

    return (

      <Layout>
        <article>
          <h1 className="is-1 title">{headline}</h1>
          <span className="tag is-info is-medium">von {author}, {formattedDate}</span>
          {maybeTeaser}
          <section className={"pt-5"}>
            <div className="columns is-centered">
              <div className="column is-full-mobile is-two-thirds-desktop">
                <div dangerouslySetInnerHTML={{__html: body.childMarkdownRemark.html}}/>
              </div>
            </div>

          </section>

        </article></Layout>
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
          gatsbyImageData(
            layout: FULL_WIDTH
            placeholder: BLURRED
            formats: [AUTO, WEBP, AVIF]
          )
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