import React from "react"
import Layout from "../components/layout";
import {graphql} from "gatsby"
import DefaultPage from "../components/defaultPage";

export default function Home({data}) {
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
    contentfulPages(slug: { eq: "privacy" }) {
      headline
      publicationDate(formatString: "MMMM Do, YYYY")
      teaser {
        fluid(maxWidth: 1180, background: "rgb:000000") {
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