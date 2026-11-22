import React from "react";
import PasswordResetForm from "../../components/auth/password_reset_form";
import Layout from "../../components/layout";
import Seo from "../../components/seo"

export function Head({ location }) {
  return <Seo title="Users: Passwort zurücksetzen" pathname={location.pathname} noindex/>
}

const PasswordReset = () => {
  return (
    <Layout>
      <PasswordResetForm/>
    </Layout>
  )
}
export default PasswordReset;