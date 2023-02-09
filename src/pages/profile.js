import React from "react";
import Layout from "../components/layout";
import ProfileForm from "../components/auth/profile_form";

export function Head() {
  return (
    <>
      <body className={'has-navbar-fixed-top'}></body>
      <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"/>
    </>
  )
}

const Profile = () => {
  return (
    <Layout>
      <ProfileForm/>
    </Layout>
  );
}

export default Profile;