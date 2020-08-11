import React from "react"
import {graphql} from "gatsby"
import Layout from "../components/layout"

export default function MyFiles({data}) {
    return (
        <Layout>
            <h1 className="title is-1">Turnierberichte</h1>
            {data.allMarkdownRemark.distinct.map( (node, index) => (
                <tr key={index}>
                    <td>{node}</td>
                </tr>
            ))}
        </Layout>
    )
}

export const query = graphql`
query {
  allMarkdownRemark(sort: {order: DESC, fields: frontmatter___date}) {
    distinct(field: frontmatter___year)
  }
}
`
