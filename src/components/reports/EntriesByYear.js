import React from "react";
import Report from "./report";
import News from "./news";

const EntriesByYear = ({type, year, items}) => (
  <section className="year-section">
    <h2 className="title is-3">{year}</h2>
    {type === "news"
      ? <div className="card-grid">{items.map(item => <News news={item} key={item.slug}/>)}</div>
      : <div className="event-grid">{items.map(item => <Report report={item} key={item.slug}/>)}</div>}
  </section>
);

export default EntriesByYear;
