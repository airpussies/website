import React from "react";
import Layout from "../components/layout";
import {graphql, Link} from "gatsby";
import DefaultPage from "../components/defaultPage";
import News from "../components/reports/news";
import Report from "../components/reports/report";
import Seo, {JsonLd, SITE_URL, team} from "../components/seo";

export function Head({location}) {
  return (
    <Seo
      title="Berlin Ultimate Frisbee"
      description="Startseite der air pussies, Ultimate Frisbee Team aus Berlin Wedding. (Anfänger-)Training, Spielregeln und vieles mehr zur Teamsportart Ultimate."
      pathname={location.pathname}
    >
      <JsonLd data={{
        "@graph": [
          {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url: `${SITE_URL}/`,
            name: "air pussies",
            inLanguage: "de-DE",
            publisher: {"@id": team["@id"]},
          },
          team,
        ],
      }}/>
    </Seo>
  );
}

export default function Home({data}) {
  const news = data.allContentfulNews.edges.map(edge => edge['node']);
  const reports = data.allContentfulTurnierbericht.edges.map(edge => edge['node']);
  return (
    <Layout bc={[
      {label: "Home", href: '#'},
    ]}>
      <DefaultPage data={data}/>

      <div className="columns">
        <div className="column">
          <section className="section">
            <Link to={"/news"}><h3 className={"subtitle"}>Neueste Neuigkeiten</h3></Link>
            {news.map((item, i) => (
              <News news={item} key={i}/>
            ))}

            <Link to={"/news"}>Alle News</Link>
          </section>
        </div>
        <div className="column">
          <section className="section">
            <Link to={"/turniere"}><h3 className={"subtitle"}>Neueste Turniere</h3></Link>
            {reports.map((item, i) => (
              <Report report={item} key={i}/>
            ))}

            <Link to={"/turniere"}>Alle Turniere</Link>
          </section>
        </div>
      </div>
    </Layout>
  );
}


export const pageQuery = graphql`
  query {
    contentfulPages(slug: { eq: "home" }) {
      headline
      publicationDate: updatedAt(formatString: "MMMM Do, YYYY")
      updatedAt
      createdAt
      teaser {
          gatsbyImageData(
            layout: FULL_WIDTH
            placeholder: BLURRED
            formats: [AUTO, WEBP, AVIF]
          )
        description
        title
      }
      body {
        childMarkdownRemark {
          html
        }
      }
    }
    
    # n news, ordered by pub date (newest first)
    allContentfulNews(limit: 5, sort: {publicationDate: DESC}) {
      edges {
        node {
          year: publicationDate(formatString: "YYYY")
          publicationDate
          slug
          id
          headline
          slug
          author
        }
      }
    }
    
    # n reports, ordered by date (newest first)
    allContentfulTurnierbericht(limit: 5, sort: {date: DESC}) {
    edges {
      node {
        year: date(formatString: "YYYY")
        date
        slug
        title
        division
        fieldType
        location
        }
      }
    }
  }
`;