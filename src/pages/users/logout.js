import React from "react";
import Layout from "../../components/layout"
import Seo from "../../components/seo"

export function Head({ location }) {
  return <Seo title="Users: Logout" pathname={location.pathname} noindex/>
}

function Signin() {
  return (
    <Layout>
      log out
    </Layout>
  )
}

export default Signin;