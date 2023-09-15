import {graphql} from "gatsby"
import React from "react"
import Layout from "../../components/layout";
import EntriesByYear from "../../components/reports/EntriesByYear";
import {group_by} from "../../lib/util"

export function Head({ location, params, data, pageContext }) {
  return (
    <>
      <>
        <title>{`air pussies — alle Turniere`}</title>
        <link rel="canonical" href={`https://www.airpussies.berlin${location.pathname}`}/>
        <meta name="twitter:url" content={`https://www.airpussies.berlin${location.pathname}`}/>
        <meta property="og:title" content={`air pussies — alle Turniere`}/>
        <meta property="og:url" content={`https://www.airpussies.berlin${location.pathname}`}/>
        <body className={'has-navbar-fixed-top'}></body>
        <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"/>
      </>

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
    <Layout bc={[
      {label: "Home", href: '/'},
      {label: "Turniere", href: '#'},
    ]}>
      <h1 className="is-1 title">Turniere</h1>
      <div>
        <p>
          Hier findest du eine Auflistung aller Turniere, an denen wir teilgenommen hatten — oder zumindest versucht
          haben, daran teilzunehmen. Hier findet ihr Informationen, die üblicherweise über die
          <a href="https://list.uni-koblenz.de/mailman/listinfo/wurfpost"> Wurfpost (Mailingliste für den Frisbeesport)</a>
          verbreitet werden. Der volle Funktionsumfang steht dir nach dem <a href={"/users/signin/"}>Login</a> zur Verfügung.
        </p>
        <p>Ältere Turniere, 2019 und früher, stammen zum Teil aus der archivierten, nicht mehr öffentlich
          zugänglichen <a href={'http://web.archive.org/web/20180412015104/https://ap.djdahlem.de/'}>Webseite</a> und wurden hierher migriert.</p>
      </div>
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