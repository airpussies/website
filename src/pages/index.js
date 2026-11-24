import React from "react";
import Layout from "../components/layout";
import {graphql, Link} from "gatsby";
import {GatsbyImage, getImage} from "gatsby-plugin-image";
import News from "../components/reports/news";
import Report from "../components/reports/report";
import Seo, {JsonLd, SITE_URL, team} from "../components/seo";

export function Head({location}) {
  return (
    <Seo
      title="Berlin Ultimate Frisbee"
      description="Startseite der air pussies, Ultimate Frisbee Team aus Berlin Wedding. (Anfänger-)Training, Spielregeln und vieles mehr zur Teamsportart Ultimate."
      pathname={location.pathname}
    >
      <JsonLd data={{
        "@graph": [
          {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url: `${SITE_URL}/`,
            name: "air pussies",
            inLanguage: "de-DE",
            publisher: {"@id": team["@id"]},
          },
          team,
        ],
      }}/>
    </Seo>
  );
}

export default function Home({data}) {
  const page = data.contentfulPages;
  const news = data.allContentfulNews.nodes;
  const reports = data.allContentfulTurnierbericht.nodes;
  // ponytail: the training times have one source, the quote on the Mitspielen page
  const trainingTimes = data.mitspielen?.body.childMarkdownRemark.html.match(/<blockquote>[\s\S]*?<\/blockquote>/)?.[0];

  const hero = <section className="home-hero">
    <GatsbyImage
      image={getImage(page.teaser)}
      alt={page.teaser.description || ""}
      style={{position: "absolute", inset: 0}}
      objectPosition="center 65%"
      loading="eager"
    />
    <div className="container home-hero-body">
      <p className="home-hero-kicker">Ultimate Frisbee in Berlin</p>
      <h1 className="title is-1">air pussies</h1>
      <p className="subtitle is-4">
        Wir sind ein Mixed-Team im TSV Berlin-Wedding 1862 e.V. Einsteiger:innen sind jederzeit willkommen.
      </p>
      <div className="buttons">
        <Link className="button is-primary is-medium" to="/mitspielen/">Zum Probetraining</Link>
        <Link className="button is-white is-outlined is-medium" to="/was_ist_ultimate/">Was ist Ultimate?</Link>
      </div>
    </div>
  </section>;

  return (
    <Layout hero={hero}>
      {trainingTimes && <section className="home-section">
        <div className="container">
          <div className="section-head">
            <h2 className="title is-3">Training</h2>
            <Link to="/mitspielen/">Alles zum Probetraining →</Link>
          </div>
          <div className="content cms-body training-times" dangerouslySetInnerHTML={{__html: trainingTimes}}/>
        </div>
      </section>}

      <section className="home-section is-surface">
        <div className="container">
          <div className="section-head">
            <h2 className="title is-3">Neuigkeiten</h2>
            <Link to="/news/">Alle News →</Link>
          </div>
          <div className="card-grid">
            {news.map(item => <News news={item} key={item.slug}/>)}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <div className="section-head">
            <h2 className="title is-3">Turniere</h2>
            <Link to="/turniere/">Alle Turniere →</Link>
          </div>
          <div className="event-grid">
            {reports.map(item => <Report report={item} key={item.slug} withYear/>)}
          </div>
        </div>
      </section>

      <section className="home-section is-surface">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-full-mobile is-four-fifths-desktop">
              <div className="content cms-body" dangerouslySetInnerHTML={{__html: page.body.childMarkdownRemark.html}}/>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}


export const pageQuery = graphql`
  query {
    contentfulPages(slug: { eq: "home" }) {
      teaser {
        gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
        description
      }
      body {
        childMarkdownRemark {
          html
        }
      }
    }

    mitspielen: contentfulPages(slug: { eq: "mitspielen" }) {
      body {
        childMarkdownRemark {
          html
        }
      }
    }

    # newest news first
    allContentfulNews(limit: 3, sort: {publicationDate: DESC}) {
      nodes {
        year: publicationDate(formatString: "YYYY")
        publicationDate
        slug
        headline
        author
        teaser {
          gatsbyImageData(layout: CONSTRAINED, width: 640, aspectRatio: 1.7778, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
        }
        body {
          childMarkdownRemark {
            excerpt(pruneLength: 140)
          }
        }
      }
    }

    # newest tournaments first (upcoming ones included)
    allContentfulTurnierbericht(limit: 6, sort: {date: DESC}) {
      nodes {
        year: date(formatString: "YYYY")
        date
        slug
        title
        division
        fieldType
        location
      }
    }
  }
`;
