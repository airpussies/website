import React from "react"
import Layout from "../components/layout";
import {graphql, Link} from "gatsby"
import team from "../../static/team.jpg"
import {rhythm} from "../utils/typography"
import {css} from "@emotion/core"

export default function Home({data}) {
    return (
        <Layout>
            <div className="content">
                <h1 className="title is-1">Willkommen bei den air pussies</h1>
                <img src={team} alt="Teamfoto"/>
                <p className="content">Die air pussies sind ein Ultimate-Frisbee-Team aus Berlin-Wedding.
                    Unsere Heimat ist die
                    Frisbee-Abteilung des <a href="http://tsv-wedding.de">TSV Berlin-Wedding 1862 e.V.</a>.
                </p>
            </div>

            <div className="content">
                <h2 className="subtitle is-2">Training / Aktuelles</h2>
                <h4 className="title is-4">ab 1. Oktober (bis Ende März)</h4>
                <p>
                    Montags von 19:00 bis 21:30 Uhr und
                    Freitags von 18:00 bis 21:30 Uhr Indoor-Training - Stralsunder Straße 56, U8 zwischen U
                    Bernauer
                    Straße und U Voltastraße - Eingang der Halle über das Schulgelände

                </p>
                <h4 className="title is-4">ab April 2019</h4>
                <p>
                    Mittwoch ab 18:30 Uhr und
                    Freitag ab 18:00 Uhr Hanne-Sobek-Sportanlage Osloer Str. 42, U8/U9/M13/T50 Osloer Str.
                </p>
            </div>

            <div className="content">
                <h2 className="subtitle is-2">Webseite und Kontakt</h2>
                <ul>
                    <li>die air pussies <Link to="https://de-de.facebook.com/airpussie/">bei facebook</Link></li>
                    <li>Bei Fragen zum Team oder zu Ultimate (in Berlin) könnt ihr euch gerne per Mail an smorg /at/
                        posteo.de wenden.
                    </li>
                    <li>Wer einen Account für die Turnierverwaltung der Pussies möchte, schickt bitte ebenfalls eine
                        Mail an smorg /at/ posteo.de
                    </li>
                    <li>Die alte und länger nicht mehr aktuailisierte Webseite der Pussies unter www.airpussies.de
                        ist leider nicht mehr erreichbar.
                    </li>
                </ul>
            </div>

            <div className="content">
                <h2 className="subtitle is-2">For english speaking guests <span role="img">🇬🇧</span></h2>

                <ul>
                    <li>we are a mixed ultimate team</li>
                    <li>we welcome guests at our practice</li>
                    <li>
                        practice times:<br/>
                        <ul>
                            <li>during Summer (April - September, outdoor practice): Wednesdays and Fridays (exact
                                times / locations see above)
                            </li>
                            <li>during Winter (October - March, indoor practice): Mondays and Fridays (exact times /
                                locations see above)
                            </li>
                        </ul>
                    </li>
                    <li>if you have any questions, contact Skander (smorg /at/ posteo.de) or any other pussy you
                        know
                        some information in english are also available at our facebook page:
                        https://de-de.facebook.com/airpussie/
                    </li>
                </ul>
            </div>

            <h3 className="title is-3">{data.allMarkdownRemark.totalCount} Turnierberichte</h3>
            <div className="tile is-ancestor">
                <div className="tile is-parent wrapped">
                    {data.allMarkdownRemark.edges.map(({node}) => (
                        <div className="tile is-child box is-4" key={node.id}>
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

                </div>
            </div>

        </Layout>
    )
}

export const query = graphql`
query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
        totalCount
        edges {
            node {
                id
                excerpt
                frontmatter {
                    title
                    date(formatString: "DD MMMM, YYYY")
                }
                fields {
                    slug
                }
            }
        }
    }
}
`