import React from "react";
import Layout from "../components/layout";
import {graphql, Link} from "gatsby";
import DefaultPage from "../components/defaultPage";
import News from "../components/reports/news";
import Report from "../components/reports/report";

export function Head({location, params, data, pageContext}) {
  const schemaData = JSON.stringify({
    "@context": "https://schema.org/",
    "@type": "WebPage",
    "name": "air pussies — Berlin Ultimate Frissbee club",
    "headline": "air pussies — Berliner Ultimate Frisbee Verein — Startseite",
    "genre": "ultimate frisbee club",
    "keywords":"ultimate frisbee berlin",
    "datePublished": data.contentfulPages.createdAt,
    "dateCreated": data.contentfulPages.createdAt,
    "dateModified": data.contentfulPages.updatedAt,
    "description": "Web Site der air pussies, Ultimate Frisbee in Berlin."
  }, null, 2);

  return (
    <>
      <title>air pussies — Berlin Ultimate Frisbee </title>
      <meta name="description" content="Web Site der air pussies, Berlin Ultimate Frisbee."/>
      <meta name={'keywords'} content={'air pussies, berlin, ultimate frisbee, sport team'}/>
      <link rel="canonical" href="https://www.airpussies.berlin/" />
      <meta property="og:title" content="air pussies Berlin Ultimate"/>
      <body className={'has-navbar-fixed-top'}></body>
      <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"/>
      <script type="application/ld+json">{schemaData}</script>
    </>
  );
}

export default function Home({data}) {
  const news = data.allContentfulNews.edges.map(edge => edge['node'])
    .map(node => {
      // parse date: str -> date
      node['publicationDate'] = new Date(node['publicationDate']);
      return node;
    });
  const reports = data.allContentfulTurnierbericht.edges.map(edge => edge['node'])
    .map(node => {
      // parse date: str -> date
      node['date'] = new Date(node['date']);
      return node;
    });
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