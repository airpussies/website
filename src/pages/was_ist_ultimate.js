import React from "react"
import Layout from "../components/layout";
import {graphql} from "gatsby"
import DefaultPage from "../components/defaultPage";

export default function Home({data}) {
    console.log("privacy" + JSON.stringify(data));
    return (
        <Layout>
            <DefaultPage data={data}/>
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
    contentfulPages(slug: { eq: "ultimate" }) {
      headline
      publicationDate(formatString: "Do. MMMM, YYYY")
      teaser {
        fluid(maxWidth: 800, background: "rgb:000000") {
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
  }
`