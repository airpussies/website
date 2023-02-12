import React from "react"
import Layout from "../components/layout";
import {graphql} from "gatsby"
import DefaultPage from "../components/defaultPage";

export function Head() {
  return (
    <>
      <title>{`air pussies — Kontakt`}</title>
      <body className={'has-navbar-fixed-top'}></body>
      <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"/>
    </>
  )
}

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
    contentfulPages(slug: { eq: "contact" }) {
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