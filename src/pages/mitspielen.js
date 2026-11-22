import React from "react"
import Layout from "../components/layout";
import {graphql} from "gatsby"
import DefaultPage from "../components/defaultPage";
import Seo from "../components/seo";

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
            <DefaultPage data={data}/>
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
