import React from "react";
import Division from "./division";
import {FIELD_TYPES, formatDate} from "../../utils/helpers";

// meta line under a tournament headline
const ReportTags = ({date, location, fieldType, division}) => (
  <p className="meta-row">
    <span><span className="icon"><i className="far fa-calendar-alt" aria-hidden="true"/></span>{formatDate(date)}</span>
    <span><span className="icon"><i className="fas fa-map-marker-alt" aria-hidden="true"/></span>{location}</span>
    <span><span className="icon"><i className="fas fa-seedling" aria-hidden="true"/></span>{FIELD_TYPES[fieldType] || fieldType}</span>
    <span><span className="icon"><i className="fas fa-users" aria-hidden="true"/></span><Division division={division}/>&nbsp;{division}</span>
  </p>
);

export default ReportTags;
