# Polariton documentation website

Independent VitePress website for Polariton. Local implementation only; no remote,
hosted deployment, or DNS changes have been made. `vercel.json` defines the future
static build and response headers; it does not create a Vercel project.

## Local use

Use Node 24.11.0 (see `.nvmrc`), then:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

`npm run build` checks the supplied content, builds the static site, and verifies
local links and heading fragments. Build output is `.vitepress/dist`.

## Content and ownership

`polariton_documentation_website/` contains the original supplied Markdown.
Its README is a handoff document and is excluded from routes and search. The
14 pages retain their original text, commands, headings, examples, and tables.
VitePress resolves Markdown links to clean routes. Mermaid presentation is handled
by the theme; original diagram source remains available in a disclosure.

The source manifest records byte hashes for all supplied files. These protect
against accidental edits; they do not prove correspondence to the public source.
The recorded release label comes from the installation page. The upstream commit
and file mappings are intentionally unset until verified.

The Polariton source repository owns the 12 reused pages. This site owns the
Introduction and research tutorial, plus its theme, navigation, and metadata.
Correct reused content upstream first. Do not maintain competing editorial copies.

## Reviewed documentation updates

1. Select and inspect an exact commit from the public Polariton repository.
2. Verify each upstream file path and record it in `content-manifest.json`.
3. Import reused pages from that commit; apply only reviewed link-destination
   transformations. Preserve headings, prose, examples, commands, and tables.
4. Review website-owned pages against that source version. Run the tutorial live
   before setting `tutorialLiveVerified` to true and updating its theme notice.
5. Review the content diff, update hashes and release/commit metadata together,
   and run the build plus browser checks in both themes and mobile layouts.
6. Submit the resulting snapshot as a reviewable website PR. Never fetch moving
   `main` during production builds. Later automation should open update PRs,
   not publish source changes directly.

Do not guess upstream paths or treat the adapted Harness revision mentioned in
compatibility documentation as the Polariton source commit. External links in the
handoff currently target `main`; verify and pin version-specific references during
source qualification. External link availability is not checked by the local build.

## Before publication

- Verify the documented Polariton commit and upstream mappings.
- Verify the research tutorial in live Polariton; retain an accurate visible notice
  until that work is complete.
- Check external links, Mermaid labels/relationships, keyboard use, search, both
  themes, and mobile code/table overflow.
- Set canonical URLs and sitemap for the confirmed production hostname.
- Create a separate Vercel project using `npm run build` and `.vitepress/dist`.
  Configure its subdomain and Cloudflare DNS only when publication is authorized.

The website has its own lockfile and no dependencies on the personal website.

## Dependency maintenance

VitePress is pinned to stable 1.6.4. Its Vite dependency is explicitly overridden
to patched 6.4.4; the resolved Vue plugin supports Vite 6. Keep this override until
a reviewed VitePress upgrade removes the need. Mermaid is pinned to 12.2.0.
The production build and browser checks have been exercised with these versions.
Recheck builds and diagrams when upgrading, and run `npm audit` periodically.
Mermaid is lazy-loaded; its large diagram chunks are not loaded by ordinary pages.

The dev-only `polariton:resolve-search-hmr` resolver handles VitePress 1.6.4’s
absolute search-index HMR ID under Vite 6. It delegates loading and index updates
to VitePress. Reassess this compatibility fix when upgrading VitePress.

## Diagram maintenance

The five supplied diagrams have compact SVG illustrations in
`.vitepress/theme/illustrations.ts`. `.vitepress/diagram-manifest.json` binds each
to its exact Mermaid source hash. The original Mermaid stays unchanged and is
available beneath each figure. New/unmatched diagrams use the Mermaid renderer.
The build rejects stale illustration mappings and checks preservation of labels
and directed-edge counts. Review actual endpoints and grouping visually when
updating a drawing; the automated count check does not prove graph equivalence.
Illustrations use CSS theme colors and server-rendered SVG. Mobile readers can
scroll each diagram horizontally without overflowing the page.
