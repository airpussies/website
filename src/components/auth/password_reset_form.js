import React, {useState} from "react";
import {Link} from "gatsby";
import firebase from "gatsby-plugin-firebase";

const PasswordResetForm = () => {
  const [email, setEmail] = useState('');
  const [emailHasBeenSent, setEmailHasBeenSent] = useState('');
  const [error, setError] = useState(null);

  const onChangeHandler = (event) => {
    const {name, value} = event.currentTarget;
    if (name === "userEmail") {
      setEmail(value);
    }
  }
  const sendResetEmail = (event) => {
    event.preventDefault();
    firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        setEmailHasBeenSent(true);
        setTimeout(() => {
          setEmailHasBeenSent(false)
        }, 5000);
      })
      .catch((error) => {
        console.log("Error resetting password.", error);
        setError("Error resetting password.");
      });
  }

  return (
    <div>
      <h1 className="is-1 title">Passwort zurücksetzen</h1>
      <form action="">
        {emailHasBeenSent && (
          <div className="help help is-success">
            An email has been sent to you! Check your inbox and/or spam folder.
          </div>
        )}
        {error !== null && <div className="help is-error">{error}</div>}
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
          <p className="control">
            <button
              className="button is-success"
              onClick={(event) => sendResetEmail(event)}>
              Send me a reset link
            </button>
          </p>
        </div>
      </form>
      <p><Link to="/users/signin" className="is-link">&larr; Zurück zum Login</Link></p>
    </div>
  )
}

export default PasswordResetForm;
