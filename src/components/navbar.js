import React, { useContext, useState } from "react";
import { Link, navigate } from "gatsby";
import logo from "../../static/disc.png";
import { UserContext } from "../context/UserProvider";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

// a real <button> so keyboard and screen-reader users can open the mobile menu
// (Bulma resets the button styling for .navbar-burger)
function NavbarBurger(props) {
  return (
    <button
      type="button"
      onClick={props.toggleMenu}
      className={`navbar-burger burger ${props.active ? "is-active" : ""}`}
      aria-label="Menü"
      aria-expanded={props.active}
      aria-controls="navbar-menu"
    >
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </button>
  );
}

function Navbar() {
  const { user } = useContext(UserContext);
  const [activeMenu, setActiveMenu] = useState(false);
  const isLoggedIn = user !== undefined;

  const logout = async (event) => {
    event.preventDefault();
    await signOut(auth);
    navigate("/");
  };

  const items = [
    { label: "News", path: "/news/" },
    { label: "Turniere", path: "/turniere/" },
    { label: "Was ist Ultimate?", path: "/was_ist_ultimate/" },
    { label: "Kontakt", path: "/kontakt/" },
    isLoggedIn ? { label: "Profil", path: "/users/profile/" } : { label: "Login", path: "/users/signin/" },
  ];

  return (
    <nav className="navbar is-fixed-top has-shadow is-site" aria-label="Hauptnavigation">
      <div className="container">
        <div className="navbar-brand">
          <Link className="navbar-item" to="/">
            <img src={logo} height="28" width="28" alt="" style={{ marginBottom: "0" }} />
            air pussies
          </Link>
          <NavbarBurger active={activeMenu} toggleMenu={() => setActiveMenu(!activeMenu)} />
        </div>
        <div id="navbar-menu" className={`navbar-menu ${activeMenu ? "is-active" : ""}`}>
          <div className="navbar-end">
            {items.map(entry => (
              <Link
                key={entry.path}
                className="navbar-item"
                activeClassName="is-active"
                partiallyActive={true}
                to={entry.path}
                rel={entry.path.startsWith("/users/") ? "nofollow" : null}>
                {entry.label}
              </Link>
            ))}
            {isLoggedIn && <a className="navbar-item" href="/" onClick={logout}>Logout</a>}
            <div className="navbar-item">
              <Link className="button is-primary" to="/mitspielen/">Mitspielen</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
