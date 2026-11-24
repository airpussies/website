import React from "react";
import * as PropTypes from "prop-types";
import {GatsbyImage, getImage, getSrc} from "gatsby-plugin-image";
import Layout from "../components/layout";
import {graphql} from "gatsby";
import {formatDate, toDescription} from "../utils/helpers";
import Seo, {JsonLd, SITE_URL, team} from "../components/seo";

export function Head({location, data}) {
  const {headline, author, publicationDate, updatedAt, teaser, body} = data.contentfulNews;
  // remark's excerpt is empty for articles written as raw HTML
  const description = body.childMarkdownRemark.excerpt || toDescription(body.childrenMarkdownRemark[0].rawMarkdownBody);
  const image = teaser ? getSrc(teaser) : undefined;
  const url = `${SITE_URL}${location.pathname}`;
  return (
    <Seo title={`News — ${headline}`} description={description} pathname={location.pathname} image={image} type="article">
      <JsonLd data={{
        "@type": "NewsArticle",
        headline,
        description,
        ...(image && {image: [image]}),
        datePublished: publicationDate.slice(0, 10), // the date shown on the page, see formatDate
        dateModified: updatedAt,
        author: {"@type": "Person", name: author},
        publisher: team,
        mainEntityOfPage: url,
      }}/>
    </Seo>
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
      maybeTeaser = <figure className="image teaser article-teaser">
        <GatsbyImage image={dynamicImage} alt={teaser.description || teaser.title || ""}/>
        {teaser.description && <figcaption>{teaser.description}</figcaption>}
      </figure>;
    }

    const formattedDate = formatDate(publicationDate);

    let timeToRead = body.childrenMarkdownRemark[0].timeToRead;
    return (
      <Layout bc={[
        {label: "Home", href: '/'},
        {label: "News", href: '/news/'},
        {label: headline, href: '#'}
      ]}>
        <article>
          <h1 className="is-1 title">{headline}</h1>

          <p className="meta-row">
            <span><span className="icon"><i className="fas fa-user" aria-hidden="true"/></span>{author}</span>
            <span><span className="icon"><i className="far fa-calendar-alt" aria-hidden="true"/></span>{formattedDate}</span>
            <span><span className="icon"><i className="far fa-clock" aria-hidden="true"/></span>{timeToRead} {timeToRead > 1 ? 'Minuten' : 'Minute'} Lesezeit</span>
          </p>

          {maybeTeaser}

          <section className={"pt-5"}>
            <div className="columns is-centered">
              <div className="column is-full-mobile is-four-fifths-tablet is-three-quarters-desktop">
                <div className="content cms-body" dangerouslySetInnerHTML={{__html: body.childMarkdownRemark.html}}/>
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
          excerpt(pruneLength: 155)
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