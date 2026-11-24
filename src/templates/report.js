import React from "react";
import * as PropTypes from "prop-types";
import Layout from "../components/layout";
import {graphql} from "gatsby";
import ReportTags from "../components/reports/reportTags";
import Turnierverwaltung from "../components/tv/turnierverwaltung";
import Seo, {JsonLd, SITE_URL, team} from "../components/seo";
import {FIELD_TYPES, formatDate} from "../utils/helpers";



export function Head({ location, data }) {
  const {title, year, date, fieldType, division, location: place} = data.contentfulTurnierbericht;
  // recurring tournaments share their name across years — the year keeps titles unique
  const clean = title.replace(/\s+/g, " ").trim();
  const name = clean.includes(year) ? clean : `${clean} ${year}`;
  const divisions = division.split(";").join(", ");
  return (
    <Seo
      title={`Turnier — ${name}`}
      description={`Ultimate-Frisbee-Turnier ${name} am ${formatDate(date)} in ${place} (${FIELD_TYPES[fieldType] || fieldType}, Division ${divisions}) — mit den air pussies aus Berlin.`}
      pathname={location.pathname}
    >
      <JsonLd data={{
        "@type": "SportsEvent",
        name,
        startDate: date.slice(0, 10), // the date as entered, see formatDate
        sport: "Ultimate Frisbee",
        url: `${SITE_URL}${location.pathname}`,
        location: {"@type": "Place", name: place, address: {"@type": "PostalAddress", addressLocality: place}},
        competitor: team,
      }}/>
    </Seo>
  );
}

const propTypes = {
  data: PropTypes.object.isRequired
};

class ReportTemplate extends React.Component {

  render() {
    const news = this.props.data.contentfulTurnierbericht;
    const {
      year,
      slug,
      title,
      date,
      description,
      report,
      fieldType,
      division,
      location
    } = news;

    let maybeReport;
    if (null !== report && null !== report.childMarkdownRemark && null !== report.childMarkdownRemark.html && report.childMarkdownRemark.html !== '') {
      maybeReport = <section className="box">
        <h2 className="title is-4">Turnierbericht</h2>
        <div className="content" dangerouslySetInnerHTML={{__html: report.childMarkdownRemark.html}}/>
      </section>;
    }
    let maybeDescription;
    if (description !== null && description.childMarkdownRemark.html !== '') {
      maybeDescription = <section className="box">
        <h2 className="title is-4">Turnierbeschreibung</h2>
        {/* div, not p: the markdown HTML is itself <p>s, and <p> in <p> is invalid HTML that breaks hydration */}
        <div className="content" dangerouslySetInnerHTML={{__html: description.childMarkdownRemark.html}}/>
      </section>;
    }
    return (
      <Layout bc={[
        {label: "Home", href: '/'},
        {label: "Turniere", href: '/turniere/'},
        {label: title, href: '#'}
      ]}>
        <h1 className="is-1 title">{title}</h1>
        <ReportTags date={date} location={location} fieldType={fieldType} division={division}/>
        <div className="wrapper">
          {maybeDescription}
          {maybeReport}
        </div>
        <h2 className="title is-3 mt-6">Turnierverwaltung</h2>
        <Turnierverwaltung event_id={`${year}_${slug}`}/>
      </Layout>
    );
  }
}

ReportTemplate.propTypes = propTypes;
export default ReportTemplate;

export const pageQuery = graphql`
  query ReportBySlug($slug: String!) {
    contentfulTurnierbericht(slug: {eq: $slug}) {
      year: date(formatString: "Y")
      slug
      date
      fieldType
      location
      title
      division
      description {
        childMarkdownRemark {
          html
        }
      }
      report {
        childMarkdownRemark {
          html
        }
      }
    }
  }
`;