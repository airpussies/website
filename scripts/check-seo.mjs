// SEO check over the built site: `npm run build && npm run check:seo`.
// Fails (exit 1) on missing/duplicate titles, missing descriptions or
// canonicals, broken JSON-LD, or a sitemap that doesn't match the pages.
import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"

const SITE = "https://www.airpussies.berlin"
const files = readdirSync("public", { recursive: true }).filter(f => f.endsWith("index.html"))
const errors = []
const titles = new Map()
const indexable = new Set()

for (const file of files) {
  const path = "/" + file.replace(/index\.html$/, "")
  const html = readFileSync(join("public", file), "utf8")
  const fail = msg => errors.push(`${path}: ${msg}`)
  const noindex = /<meta name="robots" content="noindex"/.test(html)

  if (!/<html[^>]* lang="de"/.test(html)) fail("missing <html lang=\"de\">")
  const pageTitles = [...html.matchAll(/<title[^>]*>([^<]*)<\/title>/g)].map(m => m[1])
  if (pageTitles.length !== 1 || !pageTitles[0].trim()) fail(`expected one non-empty <title>, got ${JSON.stringify(pageTitles)}`)
  if (/\s{2}|\s$/.test(pageTitles[0] ?? "")) fail(`title has stray whitespace: "${pageTitles[0]}"`)
  for (const [, json] of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(json) } catch (e) { fail(`invalid JSON-LD: ${e.message}`) }
  }

  if (path.startsWith("/users/") || path.startsWith("/404")) {
    if (!noindex) fail("should be noindex")
    continue
  }
  if (noindex) fail("unexpected noindex")
  indexable.add(path)
  const dupe = titles.get(pageTitles[0])
  if (dupe) fail(`same <title> as ${dupe}`)
  titles.set(pageTitles[0], path)
  const description = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1]
  if (!description?.trim()) fail("missing meta description")
  if (!html.includes(`<link rel="canonical" href="${SITE}${path}"`)) fail("missing or wrong canonical")
  if (!/<meta property="og:image" content="https?:\/\//.test(html)) fail("missing og:image")
}

const sitemap = new Set([...readFileSync("public/sitemap-0.xml", "utf8").matchAll(/<loc>([^<]*)<\/loc>/g)].map(m => m[1].replace(SITE, "")))
for (const p of indexable) if (!sitemap.has(p)) errors.push(`${p}: not in sitemap`)
for (const p of sitemap) if (!indexable.has(p)) errors.push(`${p}: in sitemap but not an indexable page`)

console.log(`${files.length} pages, ${indexable.size} indexable, ${sitemap.size} in sitemap`)
if (errors.length) {
  console.error(errors.join("\n"))
  process.exit(1)
}
console.log("SEO check passed")
