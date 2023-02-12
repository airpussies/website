import React from "react";
import {GatsbyImage, getImage} from "gatsby-plugin-image";

export default function DefaultPage({data}) {
  const page = data.contentfulPages;

  // teaser is optional
  let teaser;
  if (page !== null && page.teaser !== null) {
    const dynamicImage = getImage(page.teaser)
    teaser = <figure className={"image"}>
      <GatsbyImage image={dynamicImage} alt={""}/>
      <figcaption><em>{page.teaser.title}</em> — {page.teaser.description}</figcaption>
    </figure>
  }

  return (
    <>
      <h1 className="is-1 title">{page.headline}</h1>
      {teaser}

      <section className={"pt-5"}>
        <div className="columns is-centered">
          <div className="column is-full-mobile is-four-fifths-desktop">
            <div dangerouslySetInnerHTML={{
              __html: page.body.childMarkdownRemark.html
            }} />
          </div>
        </div>
      </section>
    </>
  )
}