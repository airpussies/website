import {graphql} from "gatsby"
import React from "react"
import Layout from "../../components/layout";
import EntriesByYear from "../../components/reports/EntriesByYear";
import {group_by} from "../../lib/util"

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
    <Layout>
      <h1 className="is-1 title">Turnierhistorie</h1>
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
        id
        headline
        slug
        author
      }
    }
  }
}
`