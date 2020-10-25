import React from "react";
import {Link} from "gatsby"

export default class News extends React.Component {
  render() {
    const news = this.props.news
    const {
      headline,
      year,
      slug,
      publicationDate,
      author
    } = news
    const formattedDate = new Intl.DateTimeFormat('de', {
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    }).format(publicationDate)
    return (
      <div className={"box"}>
        <dt><Link to={`/news/${year}/${slug}`}><h3 className={"subtitle"}>{headline}</h3></Link></dt>
        <dd>von {author}, {formattedDate}</dd>
      </div>
    );
  }
}