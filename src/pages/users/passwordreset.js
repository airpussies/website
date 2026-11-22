import React from "react";
import PasswordResetForm from "../../components/auth/password_reset_form";
import Layout from "../../components/layout";

export function Head() {
  return (
    <>
      <title>{`air pussies — Users: Passwort zurücksetzen`}</title>
      <body className={'has-navbar-fixed-top'}></body>
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css"/>
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