import React from "react";
import * as PropTypes from "prop-types";
import Layout from "../components/layout";
import {graphql} from "gatsby";
import ReportTags from "../components/reports/reportTags";
import Turnierverwaltung from "../components/tv/turnierverwaltung";

export function Head({ location, data }) {
  const news = data.contentfulTurnierbericht;
  const {
    title,
    date,
    fieldType,
    division
  } = news;
  return (
    <>
      <title>{`air pussies —  Turnier — ${title}`}</title>
      <meta name="description" content={`Ultimate Turnier ${title} am ${date} auf ${fieldType} in ${news.location}, Division ${division}`}/>
      <meta name="twitter:url" content={`https://www.airpussies.berlin${location.pathname}`} />
      <meta property="og:title" content={`air pussies — Turnier — ${data.contentfulTurnierbericht.title}`} />
      <meta property="og:url" content={`https://www.airpussies.berlin${location.pathname}`} />
      <body className={'has-navbar-fixed-top'}></body>
      <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"/>
    </>
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
      maybeReport = <div>
        <h2 className="subtitle is-2">Turnierberichte</h2>
        <div dangerouslySetInnerHTML={{__html: report.childMarkdownRemark.html}}/>
      </div>;
    }
    let maybeDescription;
    if (description !== null && description.childMarkdownRemark.html !== '') {
      maybeDescription = <section className={"pt-5"}>
        <div className="columns is-centered">
          <div className="box column is-full-mobile is-four-fifths-desktop">
            <div className="title">Turnierbeschreibung</div>
            <p dangerouslySetInnerHTML={{__html: description.childMarkdownRemark.html}}/>
          </div>
        </div>
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
        <hr/>
        <h2 className="is-2">Turnierverwaltung</h2>
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