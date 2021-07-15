import React from 'react'
import PropTypes from 'prop-types'
import {graphql, StaticQuery} from 'gatsby'
import Header from './header'
import './layout.scss'
import Footer from "./footer";
import UserProvider from "../context/UserProvider";

const Layout = ({children}) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <UserProvider>
        <Header siteTitle={data.site.siteMetadata.title}/>
        <section className="section">
          <div className="container">
            <div className="content">
              {children}
            </div>
          </div>
        </section>
        <Footer/>
      </UserProvider>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout