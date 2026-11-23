import React from "react";
import {Link} from "gatsby"
import Division from "./division";
import {dayAndMonth, FIELD_TYPES} from "../../utils/helpers";

// tournament card with a date badge; withYear for lists that span several years (home page)
export default function Report({report, withYear}) {
  const {title, slug, date, year, fieldType, division, location} = report;
  const {day, month} = dayAndMonth(date);
  return (
    <Link className="event-card" to={`/turniere/${year}/${slug.toLowerCase()}`}>
      <span className="event-date">
        <span className="event-day">{day}</span>
        <span className="event-month">{month}</span>
        {withYear && <span className="event-year">{year}</span>}
      </span>
      <span className="event-body">
        <span className="event-title is-block">{title}</span>
        <span className="event-meta is-block">
          <span className="icon is-small mr-1"><i className="fas fa-map-marker-alt" aria-hidden="true"/></span>{location}
        </span>
        <span className="tags">
          <span className="tag is-primary is-light">{FIELD_TYPES[fieldType] || fieldType}</span>
          <span className="tag is-light"><Division division={division}/>&nbsp;{division}</span>
        </span>
      </span>
    </Link>
  );
}
