import React, {useState} from "react";
import firebase from "gatsby-plugin-firebase";
import generateUserDocument from "../../lib/firebase_user";
import {Link} from "gatsby";

function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);

  const createUserWithEmailAndPasswordHandler = async (event, email, password) => {
    event.preventDefault();
    setError('');
    try {
      const {user} = await firebase.auth().createUserWithEmailAndPassword(email, password);
      generateUserDocument(user, {displayName})

    } catch (error) {
      console.log("Error signing up with email and password.", error);
      setError("Error signing up with email and password.");
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
      {error !== null && (
        <div className="error">{error}</div>
      )}
      <form className="">
        <label htmlFor="displayName">Display Name:</label>
        <input type="text"
               name="displayName"
               value={displayName}
               placeholder="pickup"
               id="displayName"
               onChange={event => onChangeHandler(event)}
        />
        <label htmlFor="userEmail">Email:</label>
        <input type="email"
               name="userEmail"
               value={email}
               placeholder="pickup@example.com"
               id="userEmail"
               onChange={event => onChangeHandler(event)}
        />
        <label htmlFor="userPassword">Password:</label>
        <input type="password"
               name="userPassword"
               value={password}
               placeholder="your password ••••••"
               id="userPassword"
               onChange={event => onChangeHandler(event)}
        />
        <button
          onClick={event => {
            createUserWithEmailAndPasswordHandler(event, email, password)
          }}>
          Sign up
        </button>
      </form>

      <Link
        to="/signin"
        className=""
      >Einloggen</Link>
    </>
  )
}

export default SignupForm;