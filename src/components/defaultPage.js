import React from "react";
import {GatsbyImage, getImage} from "gatsby-plugin-image";

// intro: rendered under the headline, outro: after the CMS body (both optional)
export default function DefaultPage({data, intro, outro}) {
  const page = data.contentfulPages;

  // teaser is optional
  let teaser;
  if (page !== null && page.teaser !== null) {
    const dynamicImage = getImage(page.teaser)
    teaser = <figure className="image teaser">
      <GatsbyImage image={dynamicImage} alt={page.teaser.description || page.teaser.title || ""}/>
      <figcaption>{page.teaser.description || page.teaser.title}</figcaption>
    </figure>
  }

  return (
    <>
      <h1 className="is-1 title">{page.headline}</h1>
      {intro}
      {teaser}

      <section className={"pt-5"}>
        <div className="columns is-centered">
          <div className="column is-full-mobile is-four-fifths-desktop">
            <div className="content cms-body" dangerouslySetInnerHTML={{
              __html: page.body.childMarkdownRemark.html
            }} />
            {outro}
          </div>
        </div>
      </section>
    </>
  )
}
