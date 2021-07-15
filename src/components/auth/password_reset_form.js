import React, {useState} from "react";
import {Link} from "gatsby";

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

  }
  return (
    <div>
      <h1>Reset your Password</h1>
      <form action="">
        {emailHasBeenSent && (
          <div className="">
            An email has been sent to you!
          </div>
        )}
        {error !== null && (
          <div className="py-3 bg-red-600 w-full text-white text-center mb-3">
            {error}
          </div>
        )}
        <label htmlFor="userEmail" className="w-full block">
          Email:
        </label>
        <input
          type="email"
          name="userEmail"
          id="userEmail"
          value={email}
          placeholder="Input your email"
          onChange={onChangeHandler}
          className=""
        />
        <button
          className=""
        >
          Send me a reset link
        </button>
      </form>
      <Link
        to="/signin"
        className=""
      >
        &larr; back to sign in page
      </Link>
    </div>
  )
}

export default PasswordResetForm;
