import React from "react";
import Layout from "../../components/layout";
import SignupForm from "../../components/auth/sign_up_form";
import Seo from "../../components/seo"

export function Head({ location }) {
  return <Seo title="Users: Registrierung" pathname={location.pathname} noindex/>
}

function Signup() {
  return (
    <Layout>
      <SignupForm/>
    </Layout>
  )
}

export default Signup;