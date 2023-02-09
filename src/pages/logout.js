import React from "react";
import Layout from "../components/layout"

export function Head() {
  return (
    <>
      <body className={'has-navbar-fixed-top'}></body>
      <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"/>
    </>
  )
}

function Signin() {
  return (
    <Layout>
      log out
    </Layout>
  )
}

export default Signin;