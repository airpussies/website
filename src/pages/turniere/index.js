import {graphql} from "gatsby"
import React from "react"
import Layout from "../../components/layout";
import EntriesByYear from "../../components/reports/EntriesByYear";
import {group_by} from "../../lib/util"
import Seo from "../../components/seo";

export function Head({ location }) {
  return (
    <Seo
      title="alle Turniere"
      description="Alle Ultimate-Frisbee-Turniere der air pussies aus Berlin-Wedding: Termine, Orte, Divisionen und Turnierberichte."
      pathname={location.pathname}
    />
  )
}

export default function NewsByYears({data}) {
  const nodes = group_by('year', data.allContentfulTurnierbericht.edges
    .map(edge => edge['node'])
    // ISO date strings ("2026-11-07T…") sort chronologically as plain strings
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