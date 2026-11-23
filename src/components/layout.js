import React from 'react'
import PropTypes from 'prop-types'
import Header from './header'
import './layout.scss'
import Footer from "./footer";
import UserProvider from "../context/UserProvider";
import {JsonLd, SITE_URL} from "./seo";

const Home = <span className="icon is-small"><i className="fas fa-home" aria-hidden="true"></i></span>;

// hero: a full-width element above the content (home page). Pages with a hero lay out their own
// sections; all others get a container with the breadcrumb.
// Bulma's .content typography is not applied here: wrap CMS/Markdown HTML in className="content".
const Layout = ({children, bc, hero}) => {
  let breadcrumb = <></>;
  if (bc && bc.length > 1) {
    breadcrumb = bc.map((item, i) => <li key={item.label} className={i + 1 === bc.length ? 'is-active' : ''}>{'Home' === item.label ? Home : <></>}<a href={item.href}>{item.label}</a></li>)
    breadcrumb = <nav className="breadcrumb has-bullet-separator" aria-label="breadcrumbs">
      <ul>
        {breadcrumb}
      </ul>
      <JsonLd data={{
        "@type": "BreadcrumbList",
        // href '#' marks the current page, which schema.org lists without an item URL
        itemListElement: bc.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.label,
          ...(item.href !== '#' && {item: `${SITE_URL}${item.href}`}),
        })),
      }}/>
    </nav>;
  }
  return <UserProvider>
    <Header/>
    {hero
      ? <main>{hero}{children}</main>
      : <main className="section site-main">
        <div className="container">
          {breadcrumb}
          {children}
        </div>
      </main>}
    <Footer/>
  </UserProvider>;
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  hero: PropTypes.node,
}

export default Layout
