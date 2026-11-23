import React from "react"
import Layout from "../components/layout";
import {graphql} from "gatsby"
import DefaultPage from "../components/defaultPage";
import Seo from "../components/seo";
import {Cta, Facts} from "../components/pageParts";

// ponytail: only facts that don't change live in code; times and places stay in Contentful
const intro = <>
  <p className="subtitle is-4">Dein erstes Training bei den air pussies: so einfach geht's.</p>
  <Facts facts={[
    { icon: "fa-seedling", value: "0", label: "Vorkenntnisse nötig" },
    { icon: "fa-envelope", value: "1", label: "kurze Mail vorher genügt" },
    { icon: "fa-venus-mars", value: "Mixed", label: "Frauen und Männer in einem Team" },
    { icon: "fa-language", value: "DE · EN", label: "wir sprechen Deutsch und Englisch" },
  ]}/>
</>;

const outro = <Cta title="Bereit für dein erstes Training?" text="Schreib uns kurz, wann du kommen willst. Dann sagen wir dir Bescheid, falls das Training ausfällt.">
  <a className="button is-white is-medium" href="mailto:training@airpussies.berlin?subject=Probetraining">E-Mail schreiben</a>
</Cta>;

export function Head({ location, data }) {
  const page = data.contentfulPages;
  return <Seo title={page.headline} description="Ultimate Frisbee ausprobieren bei den air pussies in Berlin-Wedding: Trainingszeiten, Orte, was du mitbringen solltest und wie du zum Probetraining kommst." pathname={location.pathname}/>;
}

export default function Mitspielen({data}) {
    return (
        <Layout bc={[
          {label: "Home", href: '/'},
          {label: "Mitspielen", href: '#'},
        ]}>
            <div className="page-mitspielen">
              <DefaultPage data={data} intro={intro} outro={outro}/>
            </div>
        </Layout>
    )
}


export const pageQuery = graphql`
  query {
    contentfulPages(slug: { eq: "mitspielen" }) {
      headline
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
