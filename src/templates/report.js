import React from "react";
import * as PropTypes from "prop-types"
import Layout from "../components/layout";
import {graphql} from "gatsby";
import ReportTags from "../components/reports/reportTags";

const propTypes = {
  data: PropTypes.object.isRequired,
}


class ReportTemplate extends React.Component {

  render() {
    const news = this.props.data.contentfulTurnierbericht;
    const {
      title,
      date,
      description,
      report,
      fieldType,
      division,
      location
    } = news

    let maybeReport;
    if (null !== report && null !== report.childMarkdownRemark && null !== report.childMarkdownRemark.html && report.childMarkdownRemark.html !== '') {
      maybeReport = <div>
        <h2 className="subtitle is-2">Turnierberichte</h2>
        <div dangerouslySetInnerHTML={{__html: report.childMarkdownRemark.html}}/>
      </div>;
    }
    let maybeDescription;
    if (description !== null && description.childMarkdownRemark.html !== '') {
      maybeDescription = <div>
        <h2 className="subtitle is-2">Turnierbeschreibung</h2>
        <div dangerouslySetInnerHTML={{__html: description.childMarkdownRemark.html}}/>
      </div>;
    }
    return (
      <Layout>
        <h1 className="is-1 title">{title}</h1>
        <ReportTags date={date} location={location} fieldType={fieldType} division={division}/>

        <div className="wrapper">
          {maybeDescription}
          {maybeReport}
        </div>
      </Layout>
    )
  }
}

ReportTemplate.propTypes = propTypes
export default ReportTemplate

export const pageQuery = graphql`
  query ReportBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    contentfulTurnierbericht(slug: {eq: $slug}) {
      date(formatString: "DD.MM.YYYY")
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
`