import React from "react"
import Layout from "../components/layout";
import {graphql} from "gatsby"
import DefaultPage from "../components/defaultPage";

export function Head({ location, params, data, pageContext }) {
  return (
    <>
      <title>{`air pussies — ${data.contentfulPages.headline}`}</title>
      <link rel="canonical" href={`https://www.airpussies.berlin${location.pathname}`} />
      <meta name="twitter:url" content={`https://www.airpussies.berlin${location.pathname}`} />
      <meta property="og:title" content={`air pussies — ${data.contentfulPages.headline}`} />
      <meta property="og:url" content={`https://www.airpussies.berlin${location.pathname}`} />
      <body className={'has-navbar-fixed-top'}></body>
      <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"/>
    </>
  );
}

export default function Home({data}) {
    return (
        <Layout>
            <DefaultPage data={data}/>
        </Layout>
    )
}


export const pageQuery = graphql`
  query {
    contentfulPages(slug: { eq: "privacy" }) {
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