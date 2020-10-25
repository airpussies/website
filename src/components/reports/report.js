import React from "react";
import ReportTags from "./reportTags";
import {Link} from "gatsby"

export default class Report extends React.Component {
  render() {
    const report = this.props.report
    const {
      title,
      slug,
      date,
      year,
      fieldType,
      division,
      location
    } = report
    const formattedDate = new Intl.DateTimeFormat('de', {
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    }).format(date)
    return (
      <div className={"box"}>
        <dt><Link to={`/turnierberichte/${year}/${slug}`}><h3 className={"subtitle"}>{title}</h3></Link></dt>
        <dd><ReportTags date={formattedDate} location={location} fieldType={fieldType} division={division}/></dd>
      </div>
    );

  }
}