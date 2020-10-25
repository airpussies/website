import React from "react";
import Report from "./report";
import News from "./news";

export default class EntriesByYear extends React.Component {
  render() {
    const year = this.props.year;
    const items = this.props.items;
    let content;
    if (this.props.type === "report") {
      content = items.map((item, i) => (
          <Report report={item} key={i}/>
        ))
    } else if (this.props.type === "news") {
      content = items.map((item, i) => (
        <News news={item} key={i}/>
      ))
    } else {
      content = <div>unknown entry type {this.props.type}</div>
    }
    return (
      <section className="section">
        <div className="container">
          <h2 className={"subtitle"}>{year}</h2>
          <dl>
            {content}
          </dl>
        </div>
      </section>
    );
  }
}