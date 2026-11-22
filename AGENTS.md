# air pussies website

Website of the **air pussies** Ultimate Frisbee team (Berlin, Germany). Live at `https://www.airpussies.berlin`.

## Architecture

- **Content** lives in [Contentful CMS](https://www.contentful.com) (space `f8cmlwci71xg`, content types: `Pages`, `News`, `Turnierbericht`). All editable copy is written in German, fetched at build time via `gatsby-source-contentful`.
- **Static site generation** with Gatsby 5 (React 18, JS, no TypeScript). Page routes:
  - Hand-written pages in `src/pages/`: home, `/news/`, `/turniere/`, `/was_ist_ultimate/`, `/kontakt/`, `/links/`, `/datenschutz/`, `/impressum/`, `/users/*`
  - Programmatic pages created in `gatsby-node.js` from CMS data:
    - `/news/:year/:slug/` → `src/templates/news.js`
    - `/turniere/:year/:slug/` → `src/templates/report.js`
  - All URLs lowercased (Netlify requirement), redirects maintained in `static/_redirects` (Netlify format).
- **Turnierverwaltung** (tournament management): the authenticated part of the site. Firebase Auth + Firestore (project `trnrvtng`) via the modular `firebase` v12 SDK. A single app client is initialized in `src/lib/firebase.js` (exports `auth`, `db`); consumers import the modular functions directly (`signInWithEmailAndPassword`, `getDoc`, `collection`, ...). Event docs keyed `events/{year}_{slug}`, created lazily on first visit by signed-in users. Components in `src/components/tv/` (event, pussie=player, teams), auth forms in `src/components/auth/`, Firestore wrappers in `src/lib/` (`firebase_user.js`, `firebase_event.js`).
  - Firebase web config (project `trnrvtng`) is inlined in `src/lib/firebase.js` — public by design (readable from the deployed site).
  - `gatsby-node.js` sets `resolve.conditionNames` to prefer the `browser` build of the `@firebase/*` packages (avoids the `node` build that imports `undici`/`node:*` builtins, which webpack can't bundle).
- **Styling**: Bulma 0.9 (CSS framework) + one SCSS file (`src/components/layout.scss`), FontAwesome icon/font scripts loaded from CDN per page.
- **SEO**: per-page `Head` exports, JSON-LD on home, custom sitemap plugin config in `gatsby-config.js`.
- **Hosting**: Netlify (README) / also a GH-pages deploy script in `package.json`.

## Development

```bash
npm install
npm run develop      # gatsby develop
npm run build        # gatsby build
```

- Needs Node 20+ (firebase v12 requirement); tested on Node 22.
- Required env vars (see `.env`, **gitignored/local, contains secrets — see Security below**):
  - `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ACCESS_TOKEN` (both required for any `gatsby` command — build fails with `API.NODE.VALIDATION` if unset)
  - `CF_MGMT_TOKEN` (Contentful management token, used by `old_db/script.py`)
- `gatsby-config.js` calls `require("dotenv").config()` on load, so a plain `npm run build`/`develop` picks up `.env` automatically.
- Tests: `npm test` (Jest + Testing Library, jsdom). Firebase is mocked globally in `jest/setup.js` (in-memory Firestore in `jest/firestore-mock.js`), so tests never hit the real project — and don't prove the real SDK bundles; run `npm run build` for that. Babel presets live in `jest.config.js`, not `babel.config.js` (Gatsby would pick that up and drop `babel-preset-gatsby`).
- Format with `npm run format` (Prettier).

## Browser testing (Turnierverwaltung)

Unit tests mock Firebase, so changes to auth/Firestore code need a manual run against the real `trnrvtng` project:

1. `npm run build && npm run serve` → `http://localhost:9000/` (production build; `develop` hides SSR/hydration issues).
2. Signed out, open a tournament page (`/turniere/<year>/<slug>/`): the Turnierverwaltung shows "nur registrierten Nutzern".
3. Sign in at `/users/signin/` with the test account (see `CLAUDE.local.md`). **A human has to type the password**: Firebase Auth posts it to `identitytoolkit.googleapis.com`, which agents must not do. Sign in in the same localhost tab — the session is stored per origin.
4. `/users/profile/`: the user doc (Pussiename) and the team checkboxes load from Firestore.
5. A **past** tournament page (e.g. `/turniere/2026/wild-silver-wedding/`): teams and players load. Add the test user to a team via the "du bist noch nicht dabei" row → save, reload (persisted?), change status → save, delete → reload (roster back to before).
6. Navbar "Logout" → back on home, navbar shows "Login".

Gotchas:

- Every page writes to the live database. Opening a tournament page while signed in creates `events/{year}_{slug}` if missing. Always delete what you add.
- Don't click "Team hinzufügen" — there's no UI to remove a team from an event. Don't trigger password reset or sign-up (real emails / real accounts).
- The delete button calls `window.confirm`, which blocks browser automation. Run `window.confirm = () => true` on the page first.
- Player rows reuse `id="state"` / `id="sex"`, so accessibility-tree lookups grab the wrong row. Locate a row by its `input[name=name]` value inside the team's `.box` (team name is the box's `h4`).
- React errors #418/#423 in the console on every page are pre-existing hydration mismatches (live site has them too) — not a regression signal. Look for `FirebaseError` / "Operation fehlgeschlagen" instead.

## Repo layout

```
gatsby-config.js        site + plugins + sitemap config
gatsby-node.js          programmatic route creation (news + turniere) + webpack conditionNames fix
src/pages/              hand-written static pages + user auth pages
src/templates/          CMS-driven templates (news.js, report.js)
src/components/         layout, nav, reports (list items), tv/ (tournament mgmt), auth/
src/context/            UserProvider (Firebase auth state)
src/lib/                firebase.js (app/auth/firestore clients) + Firestore access helpers (firebase_event, firebase_user)
src/utils/              small helpers
src/**/*.test.js        Jest tests, next to the code they cover
jest.config.js, jest/   Jest config, global firebase mocks, gatsby stub
static/                 icons, _redirects (Netlify), robots.txt
docs/                   screenshots

# local only (gitignored)
old_db/   one-off migration from old MariaDB to Contentful (2020): SQL dump, docker-compose,
          Python script + its Pipfile/Pipfile.lock
CLAUDE.local.md   test account credentials
public/   build output (~160 dirs of generated site), regenerated by `npm run build`
.env      Contentful + management tokens — never commit
yarn-error.log, .cache/, .idea/   build/IDE noise
```

## Security notes

⚠️ `.env` (gitignored, local) contains real Contentful tokens — never commit it. `src/lib/firebase.js` **is committed** with the Firebase web API key / project id (`trnrvtng`) hardcoded (Firebase web config is semi-public by design, but move it to env vars in a modernization).

## Known issues / modernization candidates

- No CI; lockfile is `package-lock.json` (npm). `yarn.lock` was removed — don't reintroduce a second lockfile.
- Class components still around (`src/templates/report.js`, auth forms) alongside function components.
- `old_db/` (incl. its Pipfile) is a finished 2020 migration artifact — candidate for deletion.
- React hydration errors #418/#423 on every page (server HTML ≠ client render), so React re-renders client-side.
- Concurrent edits to one event overwrite each other: `updateEventDocument` writes back the whole team map from client state.
- `pathPrefix: "/website"` in config (GH-pages era) conflicts with Netlify root hosting; `npm run deploy` uses `--prefix-paths` but the `npm run build` (Netlify) path likely breaks.

## test account

Credentials for a Turnierverwaltung test account live in `CLAUDE.local.md` (gitignored, local only — never commit them; the repo is public).