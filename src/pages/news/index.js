import {graphql} from "gatsby"
import React from "react"
import Layout from "../../components/layout";
import EntriesByYear from "../../components/reports/EntriesByYear";
import {group_by} from "../../lib/util"

export function Head({ location }) {
  return (
    <>
      <>
        <title>{`air pussies — alle News`}</title>
        <link rel="canonical" href={`https://www.airpussies.berlin${location.pathname}`}/>
        <meta name="twitter:url" content={`https://www.airpussies.berlin${location.pathname}`}/>
        <meta property="og:title" content={`air pussies — alle News`}/>
        <meta property="og:url" content={`https://www.airpussies.berlin${location.pathname}`}/>
        <body className={'has-navbar-fixed-top'}></body>
        <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"/>
      </>

    </>
  )
}
export default function NewsByYears({data}) {
  const nodes = group_by('year', data.allContentfulNews.edges
    .map(edge => edge['node'])
    .map(node => {
      // parse date: str -> date
      node['publicationDate'] = new Date(node['publicationDate']);
      return node;
    })
    .sort((a, b) => a['publicationDate'] < b['publicationDate'] ? 1 : -1)
  );
  return (
    <Layout bc={[
      {label: "Home", href: '/'},
      {label: "News", href: '#'},
    ]}>
      <h1 className="is-1 title">Berichte und Neuigkeiten</h1>
      {nodes.groups.sort().reverse().map((year, i) =>
        <EntriesByYear type={"news"} year={year} items={nodes.entries[year]} key={i}/>
      )}
    </Layout>
  )
}

export const pageQuery = graphql`query {
  allContentfulNews(limit: 500) {
    edges {
      node {
        year: publicationDate(formatString: "YYYY")
        publicationDate
        slug
        headline
        author
      }
    }
  }
}
`