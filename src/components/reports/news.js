import React from "react";
import {Link} from "gatsby"
import {formatDate} from "../../utils/helpers";

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
    const formattedDate = formatDate(publicationDate)
    return (
      <div className={"box"}>
        <dt><Link to={`/news/${year}/${slug.toLowerCase()}`}><h3 className={"subtitle"}>{headline}</h3></Link></dt>
        <dd>von {author}, {formattedDate}</dd>
      </div>
    );
  }
}