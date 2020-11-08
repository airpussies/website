import {Link} from 'gatsby'
import React from 'react'

const Footer = () => (
    <footer className="footer">
        <div className="container">
            <div className="content has-text-centered">
                <p>
                    <strong>air pussies</strong> Berlin Ultimate
                </p>
            </div>
            <div className="columns">
                <div className="column is-4 has-text-centered">
                    <Link to="/impressum/">Impressum</Link>
                </div>
                <div className="column is-4 has-text-centered">
                    <Link to="/datenschutz/">Datenschutz</Link>
                </div>
                <div className="column is-4 has-text-centered">
                    <Link to="/kontakt/">Kontakt</Link>
                </div>
            </div>
        </div>
    </footer>
)

export default Footer