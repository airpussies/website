import React from "react"
import Layout from "../components/layout";
import {graphql, Link} from "gatsby"
import DefaultPage from "../components/defaultPage";
import News from "../components/reports/news";
import Report from "../components/reports/report";

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
  console.log(reports)
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
            <Link to={"/turnierberichte"}><h3 className={"subtitle"}>Neueste Turniere</h3></Link>
            {reports.map((item, i) => (
              <Report report={item} key={i}/>
            ))}

            <Link to={"/turnierberichte"}>Alle Turniere</Link>
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
        fluid(maxWidth: 1180, background: "rgb:000000") {
          aspectRatio
          src
          srcSet
          sizes
          base64
          tracedSVG
          srcSetWebp
          srcSetWebp 
        }
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