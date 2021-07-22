import React, {useState} from "react";
import firebase from "gatsby-plugin-firebase";
import {generateUserDocument} from "../../lib/firebase_user";
import {Link, navigate} from "gatsby";

function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);
  const [detail, setDetail] = useState(null);

  const createUserWithEmailAndPasswordHandler = async (event, email, password) => {
    event.preventDefault();
    setError(null);
    setDetail(null);
    try {
      const {user} = await firebase.auth().createUserWithEmailAndPassword(email, password);
      await generateUserDocument(user, {displayName})
      navigate("/profile");
    } catch (error) {
      const {code, message} = error;
      setError(`Error signing up with email and password. (${code})`);
      setDetail(message);
    }
    setEmail("");
    setPassword("");
    setDisplayName("");
  };

  const onChangeHandler = event => {
    const {name, value} = event.currentTarget;
    if (name === "userEmail") {
      setEmail(value)
    } else if (name === "userPassword") {
      setPassword(value);
    } else if (name === "displayName") {
      setDisplayName(value)
    }
  };

  return (
    <>
      <h1 className="is-1 title">Registrieren</h1>
      {error !== null && (
        <article className="message is-danger">
          <div className="message-header">
            <p style={{margin: 0}}>{error}</p>
            <button className="delete" aria-label="delete"
                    onClick={() => {
                      setError(null);
                      setDetail(null);
                    }}/>
          </div>
          <div className="message-body">{detail}</div>
        </article>
      )}
      <form className="">

        <div className="field">
          <p className="control has-icons-left">
            <input
              className="input"
              type="text"
              name="displayName"
              value={displayName}
              placeholder="pickup"
              id="displayName"
              onChange={event => onChangeHandler(event)}
            />
            <span className="icon is-small is-left"><i className="fas fa-user"/></span>
          </p>
        </div>

        <div className="field">
          <p className="control has-icons-left">
            <input type="email"
                   className="input"
                   name="userEmail"
                   value={email}
                   placeholder="pickup@example.com"
                   id="userEmail"
                   onChange={event => onChangeHandler(event)}
            />
            <span className="icon is-left"><i className="fas fa-envelope"/></span>
          </p>
        </div>

        <div className="field">
          <p className="control has-icons-left">
            <input type="password"
                   name="userPassword"
                   className="input"
                   value={password}
                   placeholder="your password ••••••"
                   id="userPassword"
                   onChange={event => onChangeHandler(event)}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-lock"/>
            </span>
          </p>
        </div>
        <div className="field">
          <p className="control">
            <button
              className="button is-success"
              onClick={event => {
                createUserWithEmailAndPasswordHandler(event, email, password)
              }}>
              Sign up
            </button>
          </p>
        </div>
      </form>
      <p>
        Bereits registriert? <Link to="/signin" className="">Einloggen</Link>
      </p>
    </>
  )
}

export default SignupForm;