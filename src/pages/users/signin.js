import React from "react";
import Layout from "../../components/layout"
import SignInForm from "../../components/auth/sign_in_form"
import Seo from "../../components/seo"

export function Head({ location }) {
  return <Seo title="Users: Login" pathname={location.pathname} noindex/>
}

function Signin() {
  return (
    <Layout>
      <SignInForm/>
    </Layout>
  )
}

export default Signin;