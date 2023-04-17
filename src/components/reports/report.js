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
    return (
      <div className={"box"}>
        <dt><Link to={`/turniere/${year}/${slug.toLowerCase()}`}><h3 className={"subtitle"}>{title}</h3></Link></dt>
        <dd><ReportTags date={date} location={location} fieldType={fieldType} division={division}/></dd>
      </div>
    );

  }
}