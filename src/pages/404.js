import Layout from '../components/layout';
import React from 'react';

export default function Page({data}) {
  return (
    <>
      <body className={'has-navbar-fixed-top'}></body>
      <Layout bc={[
        {label: "Home", href: '/'},
        {label: "404 — Not found", href: '#'}
      ]}>
        <h1 className="is-1 title">Oops da ist etwas schief gelaufen :(</h1>

        <h2 className={"is-2"}><code>Http/404 Not Found</code></h2>

        <section className="pt-5">
          <div className="columns is-centered">
            <div className="column is-full-mobile is-four-fifths-desktop">
              <div>
                <p>Die Seite die Sie suchen existiert leider nicht (mehr). <a href="/">Hier gelangen Sie zurück zur Startseite.</a>
                Falls hier doch etwas sein müsste, wenden Sie sich bitte vertrauensvoll an den <a href="/kontakt/">Admin</a>.</p>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}