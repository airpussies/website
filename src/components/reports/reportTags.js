import React from "react";
import Division from "./division";

const ReportTags = (props) => {

  const date = props.date;
  const location = props.location;
  const fieldType = props.fieldType;
  const division = props.division;

  return (
    <div className="field is-grouped is-grouped-multiline">
      <div className="control">
        <div className="tags has-addons">
          <span className="tag is-dark">Datum</span>
          <span className="tag is-primary">{date}</span>
        </div>
      </div>
      <div className="control">
        <div className="tags has-addons">
          <span className="tag is-dark">Ort</span>
          <span className="tag is-primary">{location}</span>
        </div>
      </div>
      <div className="control">
        <div className="tags has-addons">
          <span className="tag is-dark">Untergrund</span>
          <span className="tag is-primary">{fieldType}</span>
        </div>
      </div>
      <div className="control">
        <div className="tags has-addons">
          <span className="tag is-dark">Division</span>
          <span className="tag is-primary"><Division division={division}/>&nbsp;{division}</span>
        </div>
      </div>
    </div>);
}

export default ReportTags;