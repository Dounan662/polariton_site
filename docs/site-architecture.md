# Site architecture and deployment

Last verified: 2026-10-18. This document owns the docs-side deployment details.
Update it when routing, hosting, or build ownership changes. Check actual config
and deployment state before assuming this dated record is still current.

## Two repositories, two builds

| Responsibility | Repository | Hosting |
| --- | --- | --- |
| Personal website, header, public-domain routing | [dounan-du-com](https://github.com/Dounan662/dounan-du-com) | Existing Next.js Vercel project serving dounan-du.com |
| Documentation content, theme, search, diagrams | [polariton_site](https://github.com/Dounan662/polariton_site) | Vercel project `polariton-site` |
| Polariton application and upstream documentation | [polariton-agent-space](https://github.com/Dounan662/polariton-agent-space) | Independent of these website builds |

The public documentation address is https://dounan-du.com/polariton/.
The stable docs origin is https://polariton-site.vercel.app.
These are separate repositories, dependency trees, lockfiles, and deployments;
the docs are not copied into the Next.js app. The personal header opens the docs
in a new tab. No additional DNS record is needed for this path-based arrangement.
Keep dounan-du.com attached to the personal website project.

## Request flow and configuration ownership

```text
Visitor: dounan-du.com/polariton/guides/checkpoints
  -> personal website next.config.ts external rewrite (preserves path)
  -> polariton-site.vercel.app/polariton/guides/checkpoints
  -> docs vercel.json strips /polariton prefix
  -> static VitePress page /guides/checkpoints
```

- `site-paths.json` sets `/polariton/`; `.vitepress/config.mts` and the built-link
  checker consume it. VitePress applies the base to navigation and asset URLs.
- `.vitepress/config.mts` owns sidebar groups, local search, and theme settings.
- `.vitepress/theme/` owns appearance and diagrams.
- `polariton_documentation_website/` owns publishable Markdown; its handoff README
  is excluded. Repository-level `docs/` contains maintenance notes, not site pages.
- `vercel.json` uses framework `null` (Other), `npm ci`, `npm run build`, and output
  `.vitepress/dist`. It enables clean URLs and maps both `/polariton` and
  `/polariton/` to `/`; nested requests map to `/:path*`.
- The personal Vercel project has `POLARITON_DOCS_ORIGIN` set to
  `https://polariton-site.vercel.app` for Production and Preview. It is an origin
  only, without `/polariton/`. The docs project does not require this variable.
  Changes to it require a new personal-site build. Never use dounan-du.com as
  this origin: that would route requests back to themselves.
- Use the stable production origin, not a per-deployment URL. It must be publicly
  accessible without Vercel authentication for the proxy to work.

For personal-site implementation details, see
[its integration guide](https://github.com/Dounan662/dounan-du-com/blob/main/docs/polariton-integration.md).

## Local development

Run `npm ci` when installing dependencies. See `.nvmrc` and `package.json` for
Node requirements; do not assume the personal repo uses the same runtime.

For docs-only editing, run `npm run dev` here and open
http://localhost:5173/polariton/.

For integrated preview, run `npm run build` then `npm run preview` here (port
4173), and `npm run dev` in the personal repo (port 3000). Open
http://localhost:3000/polariton/. Rebuild docs after edits. The personal dev
server defaults to the docs static preview origin. Do not proxy the Vite dev
server: Next.js normalizes its query strings and can break CSS module requests.

## Updates and release checks

Pushes to `main` trigger the corresponding project's Vercel deployment. A docs
content/theme update normally needs only a docs build and deployment; the personal
site needs rebuilding when its header, rewrite, or origin configuration changes.
Do not push or deploy solely because this guide describes the process; obtain
user authorization for the current work.

Before shipping docs changes, run `npm run build`. It checks supplied Markdown
hashes, diagram source mappings, and built links/anchors/assets. Preserve content
ownership and the reviewed import process described in the repository README.

After deployment, test the origin and public path in a fresh browser load:

- `/polariton/` and `/polariton`: HTTP 200 after any redirect, with introduction
  text in the server HTML and after client hydration.
- A nested page opened directly and refreshed, sidebar and pager navigation.
- Search and a result with a heading fragment.
- All five SVG illustrations, both themes, and mobile overflow/navigation.

The 2026-10-18 live check verified all 14 pages, search result navigation, nested
reloads, and all five diagrams. This is a dated result, not a guarantee for later
changes. The exact upstream Polariton source commit/mappings and the live research
tutorial remain unverified; keep the visible qualification notices accurate.
Canonical URL and sitemap setup remain follow-up work; do not infer completion
from successful deployment.

## Known routing regression

The first deployment used `/index.html` as the homepage rewrite destination while
`cleanUrls: true` was enabled. Vercel returned a 404 document for the docs homepage;
client hydration showed the shell without the introduction. Client-side navigation
back to Introduction could conceal the failure. Commit `9c2b14a` fixed this by
mapping both homepage spellings to `/`. Do not restore `/index.html` here.
A VitePress local preview does not execute Vercel rewrites, so a passing local
build alone cannot detect this regression. Check the deployed HTTP status and
fresh-page content, not only client-side navigation.
