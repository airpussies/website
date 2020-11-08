import React from "react";
import Img from "gatsby-image/index";

export default function DefaultPage({data}) {
  const page = data.contentfulPages;

  // teaser is optional
  let teaser;
  if (page !== null && page.teaser !== null) {
    teaser = <div className="columns">
      <figure className="column is-three-fifths is-offset-one-fifth image">
        <Img alt={page.teaser.title + " : " + page.teaser.description} fluid={page.teaser.fluid}/>
        <figcaption>{page.teaser.title + " : " + page.teaser.description}</figcaption>
      </figure>
    </div>
  }

  return (
    <>
      <h1 className="is-1 title">{page.headline}</h1>
      {teaser}
      <p className="is-small">letzte Aktualisierung {page.publicationDate} </p>
      <div dangerouslySetInnerHTML={{
        __html: page.body.childMarkdownRemark.html,
      }}
      />
    </>
  )
}