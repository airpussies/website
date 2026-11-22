import React from "react";
import Layout from "../../components/layout"

export function Head() {
  return (
    <>
      <title>{`air pussies — Users: Logout`}</title>
      <body className={'has-navbar-fixed-top'}></body>
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css"/>
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