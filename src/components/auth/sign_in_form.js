import React, {useState} from "react";
import firebase from "gatsby-plugin-firebase";
import {Link} from "gatsby"

const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const signInWithEmailAndPasswordHandler = (event, email, password) => {
      event.preventDefault();
      setError('');
      setEmail('');
      setPassword('');
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((data) => {
          console.log("success " + JSON.stringify(data.user), data);
          setError('success');
        })
        .catch(error => {
            setError("Error signing in with user and password")
            console.log("Error signing in with user and password", error);
          }
        );
    }
  ;

  const onChangeHandler = (event) => {
    const {name, value} = event.currentTarget;

    if (name === 'userEmail') {
      setEmail(value);
    } else if (name === 'userPassword') {
      setPassword(value);
    }
  };

  return (
    <>
      {error !== null && <div className="error">{error}</div>}
      <form className="">
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
          onClick={(event) => signInWithEmailAndPasswordHandler(event, email, password)}
        >
          Sign in
        </button>

      </form>
      <Link className="" to="/signup">Registrieren</Link>
    </>

  );
};

export default SignInForm;