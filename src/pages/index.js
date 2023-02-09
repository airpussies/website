import React from "react"
import Layout from "../components/layout";
import {graphql, Link} from "gatsby"
import DefaultPage from "../components/defaultPage";
import News from "../components/reports/news";
import Report from "../components/reports/report";

export function Head({ location, params, data, pageContext }) {
  return (
    <>
      <title>air pussies — Berliner Ultimate Frisbee Verein</title>
      <meta name="description" content="Ultimate Frisbee, Training, anfängerfreundlich, ambitioniert, Berlin, Spirit of the Game, Offen für alle"/>
      <meta property="og:title" content="air pussies Berlin Ultimate" />
      <body className={'has-navbar-fixed-top'}></body>
      <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"/>
    </>
  )
}

export default function Home({data}) {
  const news = data.allContentfulNews.edges.map(edge => edge['node'])
    .map(node => {
      // parse date: str -> date
      node['publicationDate'] = new Date(node['publicationDate']);
      return node;
    })
  const reports = data.allContentfulTurnierbericht.edges.map(edge => edge['node'])
    .map(node => {
      // parse date: str -> date
      node['date'] = new Date(node['date']);
      return node;
    })
  return (
    <Layout>
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
  )
}


export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    contentfulPages(slug: { eq: "home" }) {
      headline
      publicationDate(formatString: "MMMM Do, YYYY")
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
    allContentfulNews(limit: 65, sort: {fields: publicationDate, order: DESC}) {
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
    
    # n reportes, ordered by date (newest first)
    allContentfulTurnierbericht(limit: 5, sort: {fields: date, order: DESC}) {
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
`