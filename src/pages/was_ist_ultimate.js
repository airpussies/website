import React from "react"
import Layout from "../components/layout";
import {graphql, Link} from "gatsby"
import DefaultPage from "../components/defaultPage";
import Seo from "../components/seo";

// ponytail: key facts live in code, the explanations below them in Contentful
const FACTS = [
  { icon: "fa-users", value: "7", label: "Spieler:innen pro Team (Halle und Beach: 5)" },
  { icon: "fa-handshake", value: "0", label: "Schiedsrichter: Fairplay regeln die Teams selbst" },
  { icon: "fa-stopwatch", value: "10", label: "Sekunden Zeit zum Abwerfen" },
  { icon: "fa-venus-mars", value: "Mixed", label: "Frauen und Männer in einem Team" },
];

const intro = <>
  <p className="subtitle is-4">Die schnelle Teamsportart ohne Schiedsrichter, kurz erklärt.</p>
  <div className="facts">
    {FACTS.map(f => (
      <div className="fact" key={f.label}>
        <span className="icon is-medium"><i className={`fas ${f.icon} fa-lg`} aria-hidden="true"/></span>
        <strong className="fact-value">{f.value}</strong>
        <span className="fact-label">{f.label}</span>
      </div>
    ))}
  </div>
</>;

const outro = <div className="cta">
  <div>
    <h2 className="title is-4">Lust bekommen?</h2>
    <p>Einsteiger:innen sind bei uns jederzeit willkommen, Vorkenntnisse brauchst du keine.</p>
  </div>
  <Link className="button is-white is-medium" to="/mitspielen/">Zum Probetraining</Link>
</div>;

export function Head({ location, data }) {
  const page = data.contentfulPages;
  return <Seo title={page.headline} description="Was ist Ultimate Frisbee? Spielidee, Regeln, Spielfeld und Spirit of the Game – die schnelle Teamsportart ohne Schiedsrichter kurz erklärt." pathname={location.pathname}/>;
}

export default function Home({data}) {
    return (
        <Layout bc={[
          {label: "Home", href: '/'},
          {label: "Was ist Ultimate?", href: '#'},
        ]}>
            <div className="page-ultimate">
              <DefaultPage data={data} intro={intro} outro={outro}/>
            </div>
        </Layout>
    )
}


export const pageQuery = graphql`
  query {
    contentfulPages(slug: { eq: "ultimate" }) {
      headline
      publicationDate(formatString: "Do. MMMM, YYYY")
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
  }
`