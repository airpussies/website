import React from 'react'
import { Link } from 'gatsby'
import logo from '../../static/disc.jpg'
import { Helmet } from 'react-helmet'

const NavbarItem = props => (
    <Link className="navbar-item" to={props.page}>
        {props.pagename}
    </Link>
)
const NavbarBurger = props => (
    <div
        onClick={props.toggleMenu}
        className={`navbar-burger burger ${props.active ? 'is-active' : ''}`}
    >
        <span />
        <span />
        <span />
    </div>
)

export default class Navbar extends React.Component {
    state = {
        activeMenu: false,
    }
    toggleMenu = () => {
        this.setState({
            activeMenu: !this.state.activeMenu,
        })
    }
    render() {
        return (
            <nav className="navbar is-fixed-top has-shadow is-primary">
                <div className="container">
                    <div className="navbar-brand">
                        <Link className="navbar-item" to="/">
                            <img src={logo} height="28" width="28" alt="logo" style={{ marginBottom: '0' }} />
                            &nbsp;<span className="is-4">air pussies online</span>
                        </Link>
                        <NavbarBurger
                            active={this.state.activeMenu}
                            toggleMenu={this.toggleMenu}
                        />
                    </div>
                    <div
                        className={`navbar-menu ${this.state.activeMenu ? 'is-active' : ''}`}
                    >
                        <div className="navbar-end">
                            <NavbarItem page="/" pagename="Home" />
                            <NavbarItem page="/turnierberichte/" pagename="Turniere" />
                            <NavbarItem page="/turnierberichte/" pagename="Berichte" />
                            <NavbarItem page="/links/" pagename="Links" />
                            <NavbarItem page="/was_ist_ultimate/" pagename="Was ist Ultimate Frisbee" />
                            <NavbarItem page="/turnierberichte/" pagename=".ber Ultimate" />
                        </div>
                    </div>
                </div>
                <Helmet
                    bodyAttributes={{
                        class: 'has-navbar-fixed-top'
                    }}
                />
            </nav>
        )
    }
}