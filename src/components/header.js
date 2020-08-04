import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import Navbar from "./navbar";

const Header = ({ siteTitle }) => (
    // <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
    //     <div className="navbar-brand">
    //         <Link className="navbar-item" to="/">
    //             {siteTitle}
    //         </Link>
    //     </div>
    // </nav>

    <Navbar/>
)

Header.propTypes = {
    siteTitle: PropTypes.string,
}

Header.defaultProps = {
    siteTitle: '',
}

export default Header