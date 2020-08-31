import React from "react";
import Img from "gatsby-image/index";

export default function DefaultPage({data}) {
    const page = data.contentfulPages;

    // teaser is optional
    let teaser;
    if (page !== null && page.teaser !== null) {
        teaser = <div className="columns">
            <div className="column is-three-fifths is-offset-one-fifth">
                <Img alt={page.headline} fluid={page.teaser.fluid}/>
            </div>
        </div>
    }

    return (
        <>
            <h1 className="is-1 title">{page.headline}</h1>
            {teaser}
            <p style={{display: 'block'}}> {page.publicationDate} </p>
            <div dangerouslySetInnerHTML={{
                __html: page.body.childMarkdownRemark.html,
            }}
            />
        </>
    )
}