import React from "react";
import Report from "./report";
import News from "./news";

const EntriesByYear = (props) => {
  const year = props.year;
  const items = props.items;
  let content;
  if (props.type === "report") {
    content = items.map((item, i) => (
      <Report report={item} key={i}/>
    ))
  } else if (props.type === "news") {
    content = items.map((item, i) => (
      <News news={item} key={i}/>
    ))
  } else {
    content = <div>unknown entry type {props.type}</div>
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
export default EntriesByYear;