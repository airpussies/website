import {graphql} from "gatsby"
import React from "react"
import Layout from "../../components/layout";
import EntriesByYear from "../../components/reports/EntriesByYear";
import {group_by} from "../../lib/util"
import Seo from "../../components/seo";

export function Head({ location }) {
  return (
    <Seo
      title="alle News"
      description="Berichte und Neuigkeiten der air pussies, Ultimate-Frisbee-Team aus Berlin-Wedding: Turnierberichte, Trainingslager und Teamleben."
      pathname={location.pathname}
    />
  )
}
export default function NewsByYears({data}) {
  const nodes = group_by('year', data.allContentfulNews.edges
    .map(edge => edge['node'])
    // ISO date strings ("2026-11-07T…") sort chronologically as plain strings
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