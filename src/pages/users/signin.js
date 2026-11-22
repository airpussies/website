import React from "react";
import Layout from "../../components/layout"
import SignInForm from "../../components/auth/sign_in_form"

export function Head() {
  return (
    <>
      <title>{`air pussies — Users: Login`}</title>
      <body className={'has-navbar-fixed-top'}></body>
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css"/>
    </>
  )
}

function Signin() {
  return (
    <Layout>
      <SignInForm/>
    </Layout>
  )
}

export default Signin;