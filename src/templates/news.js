import React from "react";
import * as PropTypes from "prop-types";
import {GatsbyImage, getImage} from "gatsby-plugin-image";
import Layout from "../components/layout";
import {graphql} from "gatsby";

export function Head({location, params, data, pageContext}) {
  const news = data.contentfulNews;
  const {
    headline,
    body,
    author
  } = news;
  let description = body.childrenMarkdownRemark[0].rawMarkdownBody.match(/^(.*?)[.?!]\s/);
  const schemaData = JSON.stringify({
    "@context": "https://schema.org/",
    "@type": "NewsArticle",
    "name": headline,
    "author": {
      "@type": "Person",
      "name": author
    },
    "headline": `air pussies — Turniere — ${headline}`,
    "genre": "ultimate frisbee club",
    "keywords": "ultimate frisbee berlin",
    "datePublished": data.contentfulNews.createdAt,
    "dateCreated": data.contentfulNews.createdAt,
    "dateModified": data.contentfulNews.updatedAt,
    "description": description ? description[0] : headline
  }, null, 2);
  return (
    <>
      <title>{`air pussies — News — ${data.contentfulNews.headline}`}</title>
      <meta name="twitter:url" content={`https://www.airpussies.berlin${location.pathname}`}/>
      <meta property="og:title" content={`air pussies — News — ${data.contentfulNews.headline}`}/>
      <meta property="og:url" content={`https://www.airpussies.berlin${location.pathname}`}/>
      <body className={'has-navbar-fixed-top'}></body>
      <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"/>
      <script type="application/ld+json">{schemaData}</script>
    </>
  );
}

const propTypes = {
  data: PropTypes.object.isRequired
};

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
      const dynamicImage = getImage(teaser);
      maybeTeaser = <figure className={"image"}>
        <GatsbyImage image={dynamicImage} alt={teaser.title} title={teaser.title}/>
        <figcaption><em>{teaser.title}</em> {teaser.description}</figcaption>
      </figure>;
    }

    const formattedDate = new Intl.DateTimeFormat('de', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(publicationDate));

    let timeToRead = body.childrenMarkdownRemark[0].timeToRead;
    return (
      <Layout bc={[
        {label: "Home", href: '/'},
        {label: "News", href: '/news/'},
        {label: headline, href: '#'}
      ]}>
        <article>
          <h1 className="is-1 title">{headline}</h1>

          <div className="field is-grouped is-grouped-multiline">

            <div className="control">
              <div className="tags are-medium has-addons">
                <span className="tag">von</span>
                <span className="tag is-success is-light">{author}</span>
              </div>
            </div>

            <div className="control">
              <div className="tags are-medium has-addons">
                <span className="tag">veröffentlicht am</span>
                <span className="tag is-success is-light">{formattedDate}</span>
              </div>
            </div>

            <div className="control">
              <div className="tags are-medium has-addons">
                <span className="tag">Lesezeit </span>
                <span className="tag is-success is-light">{timeToRead} {timeToRead > 1 ? 'Minuten' : 'Minute'}</span>
              </div>
            </div>
          </div>

          {maybeTeaser}

          <section className={"pt-5"}>
            <div className="columns is-centered">
              <div className="column is-four-fifths-mobile is-two-thirds-tablet">
                <div dangerouslySetInnerHTML={{__html: body.childMarkdownRemark.html}}/>
              </div>
            </div>
          </section>
        </article>
      </Layout>
    );
  }
}

NewsTemplate.propTypes = propTypes;
export default NewsTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    contentfulNews(slug: { eq: $slug }) {
      headline
      author
      publicationDate
      updatedAt
      createdAt
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
        childrenMarkdownRemark {
          wordCount {
            paragraphs
            sentences
            words
          }
          timeToRead
          rawMarkdownBody
        }
      }
    }
  }
  `;