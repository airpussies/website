import React, {useState} from "react";
import firebase from "gatsby-plugin-firebase";
import {Link, navigate} from "gatsby"

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
          navigate("/")
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
      <h1 className="is-1 title">Einloggen</h1>
      {error !== null && <div className="error">{error}</div>}
      <form className="">
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
            <span className="icon is-left">
              <i className="fas fa-envelope"/>
            </span>
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
            <span className="icon is-left">
              <i className="fas fa-lock"/>
            </span>
          </p>
        </div>
        <div className="field">
          <p className="control">
            <button
              className="button is-success"
              onClick={(event) => signInWithEmailAndPasswordHandler(event, email, password)}
            >
              Sign in
            </button>
          </p>
        </div>

      </form>
      <p><Link className="" to="/passwordreset">Passwort vergessen?</Link> Oder noch keinen Account? <Link className="" to="/signup">Registrieren</Link></p>
    </>
  );
};

export default SignInForm;