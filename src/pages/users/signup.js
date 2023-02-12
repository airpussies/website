import React from "react";
import Layout from "../../components/layout";
import SignupForm from "../../components/auth/sign_up_form";

export function Head() {
  return (
    <>
      <title>{`air pussies — Users: Registrierung`}</title>
      <body className={'has-navbar-fixed-top'}></body>
      <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"/>
    </>
  )
}

function Signup() {
  return (
    <Layout>
      <SignupForm/>
    </Layout>
  )
}

export default Signup;