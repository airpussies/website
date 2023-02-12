import PropTypes from 'prop-types'
import React from 'react'
import Navbar from "./navbar";

const Header = ({ siteTitle }) => (
    <Navbar/>
)

Header.propTypes = {
    siteTitle: PropTypes.string,
}

Header.defaultProps = {
    siteTitle: '',
}

export default Header