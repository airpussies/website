import {graphql} from "gatsby"
import React from "react"
import Layout from "../../components/layout";
import EntriesByYear from "../../components/reports/EntriesByYear";
import {group_by} from "../../lib/util"

export function Head() {
  return (
    <>
      <body className={'has-navbar-fixed-top'}></body>
      <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"/>
    </>
  )
}

export default function NewsByYears({data}) {
  const nodes = group_by('year', data.allContentfulTurnierbericht.edges
    .map(edge => edge['node'])
    .map(node => {
      // parse date: str -> date
      node['date'] = new Date(node['date']);
      return node;
    })
    .sort((a, b) => a['date'] < b['date'] ? 1 : -1)
  );
  return (
    <Layout>
      <h1 className="is-1 title">Turnierhistorie</h1>
      {nodes.groups.sort().reverse().map((year, i) =>
        <EntriesByYear type={"report"} year={year} items={nodes.entries[year]} key={i}/>
      )}
    </Layout>
  )
}

export const pageQuery = graphql`query {
  allContentfulTurnierbericht(limit: 500) {
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