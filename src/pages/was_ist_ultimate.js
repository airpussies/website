import React from "react"
import Layout from "../components/layout";
import {graphql} from "gatsby"
import DefaultPage from "../components/defaultPage";
import Seo from "../components/seo";

export function Head({ location, data }) {
  const page = data.contentfulPages;
  return <Seo title={page.headline} description={page.body.childMarkdownRemark.excerpt} pathname={location.pathname}/>;
}

export default function Home({data}) {
    return (
        <Layout bc={[
          {label: "Home", href: '/'},
          {label: "Was ist Ultimate?", href: '#'},
        ]}>
            <DefaultPage data={data}/>
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
          excerpt(pruneLength: 155)
        }
      }
    }
  }
`