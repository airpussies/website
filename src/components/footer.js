import {Link} from 'gatsby'
import React from 'react'
import logo from "../../static/disc.png";

const Footer = () => (
  <footer className="site-footer">
    <div className="container">
      <div className="columns">
        <div className="column is-5">
          <p className="footer-brand"><img src={logo} width="28" height="28" alt=""/> air pussies</p>
          <p>Ultimate Frisbee in Berlin-Wedding: die Ultimate-Frisbee-Abteilung des TSV Berlin-Wedding 1862 e.V.</p>
          <p className="mt-3">
            <a href="https://www.instagram.com/airpussies/">
              <span className="icon"><i className="fab fa-instagram" aria-hidden="true"/></span> Instagram
            </a>
          </p>
        </div>
        <nav className="column" aria-label="Mitmachen">
          <p className="footer-heading">Mitmachen</p>
          <ul>
            <li><Link to="/mitspielen/">Mitspielen</Link></li>
            <li><Link to="/was_ist_ultimate/">Was ist Ultimate?</Link></li>
            <li><Link to="/turniere/">Turniere</Link></li>
            <li><Link to="/news/">News</Link></li>
          </ul>
        </nav>
        <nav className="column" aria-label="Verein">
          <p className="footer-heading">Verein</p>
          <ul>
            <li><Link to="/kontakt/">Kontakt</Link></li>
            <li><Link to="/links/">Links</Link></li>
            <li><a href="https://tsv-wedding.de">TSV Berlin-Wedding</a></li>
          </ul>
        </nav>
        <nav className="column" aria-label="Rechtliches">
          <p className="footer-heading">Rechtliches</p>
          <ul>
            <li><Link to="/impressum/">Impressum</Link></li>
            <li><Link to="/datenschutz/">Datenschutz</Link></li>
          </ul>
        </nav>
      </div>
      <p className="footer-bottom">air pussies · Berlin Ultimate</p>
    </div>
  </footer>
)

export default Footer
