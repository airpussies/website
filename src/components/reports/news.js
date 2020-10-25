import React from "react";
import {Link} from "gatsby"

export default class News extends React.Component {
  render() {
    const news = this.props.news
    console.log('news template')
    console.log(this.props)
    const {
      headline,
      year,
      slug,
      publicationDate
    } = news
    const formattedDate = new Intl.DateTimeFormat('de', {
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    }).format(publicationDate)
    return (
      <div className={"box"}>
        <dt><Link to={`/news/${year}/${slug}`}><h3 className={"subtitle"}>{headline}</h3></Link></dt>
        <dd>vom {formattedDate}</dd>
      </div>
    );
  }
}