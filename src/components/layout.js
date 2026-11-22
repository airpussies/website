import React from 'react'
import PropTypes from 'prop-types'
import Header from './header'
import './layout.scss'
import Footer from "./footer";
import UserProvider from "../context/UserProvider";
import {JsonLd, SITE_URL} from "./seo";

const Home = <span className="icon is-small"><i className="fas fa-home" aria-hidden="true"></i></span>;

const Layout = ({children, bc}) => {
  let breadcrumb = <></>;
  if (bc) {
    breadcrumb = bc.map((item, i) => <li key={item.label} className={i + 1 === bc.length ? 'is-active' : ''}>{'Home' === item.label ? Home : <></>}<a href={item.href}>{item.label}</a></li>)
    breadcrumb = <nav className="breadcrumb has-bullet-separator" aria-label="breadcrumbs">
      <ul>
        {breadcrumb}
      </ul>
      {bc.length > 1 && <JsonLd data={{
        "@type": "BreadcrumbList",
        // href '#' marks the current page, which schema.org lists without an item URL
        itemListElement: bc.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.label,
          ...(item.href !== '#' && {item: `${SITE_URL}${item.href}`}),
        })),
      }}/>}
    </nav>;
  }
  return <UserProvider>
    <Header/>
    <section className="section">
      <div className="container">
        {breadcrumb}
        <div className="content">
          {children}
        </div>
      </div>
    </section>
    <Footer/>
  </UserProvider>;
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout