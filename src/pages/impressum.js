import React from "react"
import Layout from "../components/layout";
import {graphql} from "gatsby"
import DefaultPage from "../components/defaultPage";
import Seo from "../components/seo";

export function Head({ location, data }) {
  const page = data.contentfulPages;
  return <Seo title={page.headline} description="Impressum der air pussies: Anbieterkennzeichnung des TSV Berlin-Wedding 1862 e.V. mit Vertretung, Kontakt und Vereinsregistereintrag." pathname={location.pathname}/>;
}

export default function Home({data}) {
    return (
        <Layout>
            <DefaultPage data={data} />
        </Layout>
    )
}


export const pageQuery = graphql`
  query {
    contentfulPages(slug: { eq: "imprint" }) {
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
  }
`