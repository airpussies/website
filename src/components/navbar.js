import React from 'react'
import {Link, navigate} from 'gatsby'
import logo from '../../static/disc.jpg'
import {Helmet} from 'react-helmet'

function NavbarItem(props) {
  return (
    <Link
      className={"navbar-item " + (props.active ? 'is-active' : 'not-active')}
      onClick={props.onClick}
      to={props.page}>
      {props.pagename}
    </Link>
  )
}

function NavbarBurger(props) {
  return (
    <div
      onClick={props.toggleMenu}
      className={`navbar-burger burger ${props.active ? 'is-active' : ''}`}
    >
      <span/>
      <span/>
      <span/>
    </div>
  )
}

class Navbar extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      activeMenu: false
    }
  }

  toggleMenu = () => {
    this.setState({
      activeMenu: !this.state.activeMenu,
    })
  }

  render() {
    const currentNav = this.state.currentNav;
    const navItems = ([
      {label: "Home", path: '/'},
      {label: "News", path: '/news/'},
      {label: "Turniere", path: '/turniere/'},
      {label: "Was ist Ultimate Frisbee", path: '/was_ist_ultimate/'},
    ]).map((entry, i) => {
      return <NavbarItem
        key={i}
        page={entry.path}
        pagename={entry.label}
      />
    })

    return (
      <nav className="navbar is-fixed-top has-shadow is-primary">
        <div className="container">
          <div className="navbar-brand">
            <Link className="navbar-item" to="/">
              <img src={logo} height="28" width="28" alt="logo" style={{marginBottom: '0'}}/>
              &nbsp;<span className="is-4">air pussies online</span>
            </Link>
            <NavbarBurger
              active={this.state.activeMenu}
              toggleMenu={this.toggleMenu}
            />
          </div>
          <div className={`navbar-menu ${this.state.activeMenu ? 'is-active' : ''}`}>
            <div className="navbar-end">
              {navItems}
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

export default Navbar;