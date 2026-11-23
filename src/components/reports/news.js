import React from "react";
import {Link} from "gatsby"
import {GatsbyImage, getImage} from "gatsby-plugin-image";
import {formatDate} from "../../utils/helpers";
import logo from "../../../static/disc.png";

// news card: teaser image (or a placeholder), date, author, headline, excerpt
export default function News({news}) {
  const {headline, year, slug, publicationDate, author, teaser, body} = news;
  const image = teaser && getImage(teaser);
  const excerpt = body?.childMarkdownRemark?.excerpt;
  return (
    <Link className="news-card" to={`/news/${year}/${slug.toLowerCase()}`}>
      <span className="news-card-image is-block">
        {image
          ? <GatsbyImage image={image} alt=""/>
          : <span className="news-card-placeholder"><img src={logo} alt=""/></span>}
      </span>
      <span className="news-card-body">
        <span className="news-card-meta">{formatDate(publicationDate)} · {author}</span>
        <span className="news-card-title">{headline}</span>
        {excerpt && <span className="news-card-excerpt">{excerpt}</span>}
      </span>
    </Link>
  );
}
