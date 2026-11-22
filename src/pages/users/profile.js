import React from "react";
import Layout from "../../components/layout";
import ProfileForm from "../../components/auth/profile_form";
import Seo from "../../components/seo"

export function Head({ location }) {
  return <Seo title="Users: Mein Profil" pathname={location.pathname} noindex/>
}

const Profile = () => {
  return (
    <Layout>
      <ProfileForm/>
    </Layout>
  );
}

export default Profile;