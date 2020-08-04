import React from "react"
import {graphql} from "gatsby"
import Layout from "../components/layout"

export default function MyFiles({data}) {
    console.log(data)
    return (
        <Layout>
            <div>My Site's Files</div>
            <table>
                <thead>
                <tr>
                    <th>relative Path</th>
                    <th>pretty Size</th>
                    <th>extension</th>
                    <th>birthTime</th>
                </tr>
                </thead>
                <tbody>
                {data.allFile.edges.map(({node}, index) => (
                    <tr key={index}>
                        <td>{node.relativePath}</td>
                        <td>{node.prettySize}</td>
                        <td>{node.extension}</td>
                        <td>{node.birthTime}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </Layout>
    )
}

export const query = graphql`
  query {
    allFile {
      edges {
        node {
          relativePath
          prettySize
          extension
          birthTime(fromNow: true)
        }
      }
    }
  }
`
