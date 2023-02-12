import React from "react";
import PasswordResetForm from "../../components/auth/password_reset_form";
import Layout from "../../components/layout";

export function Head() {
  return (
    <>
      <title>{`air pussies — Users: Passwort zurücksetzen`}</title>
      <body className={'has-navbar-fixed-top'}></body>
      <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"/>
    </>
  )
}

const PasswordReset = () => {
  return (
    <Layout>
      <PasswordResetForm/>
    </Layout>
  )
}
export default PasswordReset;