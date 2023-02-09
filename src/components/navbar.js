import React, {useContext, useState} from 'react'
import {Link, navigate} from 'gatsby'
import logo from '../../static/disc.png'
import {UserContext} from "../context/UserProvider";
import firebase from "gatsby-plugin-firebase";

function NavbarItem(props) {
  if (props.hide) {
    return (
      <></>
    )
  } else {
    return (
      <Link
        className={"navbar-item " + (props.active ? 'is-active' : 'not-active')}
        to={props.page}>
        {props.pagename}
      </Link>
    )
  }
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

function Navbar() {
  const {user} = useContext(UserContext);
  const [activeMenu, setActiveMenu] = useState(false);
  const isLoggedIn = user !== undefined;

  const toggleMenu = () => {
    setActiveMenu(!activeMenu)
  }

  const logout = async (event) => {
    event.preventDefault();
    console.log("logging out");
    await firebase.auth().signOut()
    navigate("/");
  }

  const items = [
    {label: "Home", path: '/'},
    {label: "News", path: '/news/'},
    {label: "Turniere", path: '/turniere/'},
    {label: "Was ist Ultimate Frisbee", path: '/was_ist_ultimate/'},
    {label: "Registrieren", path: '/signup/', hide: isLoggedIn},
    {label: "Einloggen", path: '/signin/', hide: isLoggedIn},
    {label: "Profil", path: '/profile/', hide: !isLoggedIn},
  ];

  const navItems = items.map((entry, i) => {
    return <NavbarItem
      key={i}
      page={entry.path}
      pagename={entry.label}
      hide={entry.hide}
      onClick={entry.onClick}
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
            active={activeMenu}
            toggleMenu={toggleMenu}
          />
        </div>
        <div className={`navbar-menu ${activeMenu ? 'is-active' : ''}`}>
          <div className="navbar-end">
            {navItems}
            <Link
              style={!isLoggedIn ? {display: 'none'} : {}}
              className="navbar-item"
              to="/"
              onClick={(event) => logout(event)}>Logout
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;