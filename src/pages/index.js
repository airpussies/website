import React from "react"
import {graphql, Link} from "gatsby"
import Container from "../components/container"
import {rhythm} from "../utils/typography"
import {css} from "@emotion/core"

export default function Home({data}) {
    return (
        <div style={{color: `pink`}}>
            <h1>Willkommen bei den {data.site.siteMetadata.title}s</h1>

            <p>Die air pussies sind ein Ultimate-Frisbee-Team aus Berlin-Wedding. Unsere Heimat ist die
                Frisbee-Abteilung des <a href="http://tsv-wedding.de">TSV Berlin-Wedding 1862 e.V.</a>.</p>

            <Container>
                <h2>Training/Aktuelles</h2>
                <p>
                    ab 1. Oktober (bis Ende März)

                    Montags von 19:00 bis 21:30 Uhr und
                    Freitags von 18:00 bis 21:30 Uhr Indoor-Training - Stralsunder Straße 56, U8 zwischen U Bernauer Straße und U Voltastraße - Eingang der Halle über das Schulgelände

                    ab April 2019

                    Mittwoch ab 18:30 Uhr und
                    Freitag ab 18:00 Uhr Hanne-Sobek-Sportanlage Osloer Str. 42, U8/U9/M13/T50 Osloer Str.
                </p>
            </Container>

            <Link to="/imprint/">Impressum</Link>

            <Container>
                <h1>About CSS Modules</h1>
                <p>CSS Modules are cool</p>
            </Container>

            <Container>
                <h3>{data.allMarkdownRemark.totalCount} Turnierberichte</h3>
                {data.allMarkdownRemark.edges.map(({node}) => (
                    <div key={node.id}>
                        <Link
                        to={node.fields.slug}
                        css={css`
                            text-decoration: none;
                            color: inherit;
                        `}
                        >
                        <h4
                            css={css`
                            margin-bottom: ${rhythm(1 / 4)};
                            `}
                        >
                            {node.frontmatter.title}{" "}
                            <span
                                css={css`
                                  color: #bbb;
                                `}
                            >
                                - {node.frontmatter.date}
                            </span>
                        </h4>
                        <p>{node.excerpt}</p>
                        </Link>
                    </div>
                ))}
            </Container>
        </div>
    )
}

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
          }
          fields {
            slug
          }
          excerpt
        }
      }
    }
  }
`