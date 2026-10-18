import { defineConfig } from 'vitepress'
import { createHash } from 'node:crypto'
import diagrams from './diagram-manifest.json'
import { fileURLToPath } from 'node:url'
import manifest from '../content-manifest.json'

const groups = [
  { text: 'Start here', items: [
    { text: 'Introduction', link: '/' },
    { text: 'Installation and overview', link: '/start/installation' },
    { text: 'Getting started', link: '/start/getting-started' },
  ] },
  { text: 'Guides', items: [
    { text: 'Research project structure', link: '/guides/research-projects' },
    { text: 'Checkpoints and inheritance', link: '/guides/checkpoints' },
    { text: 'Research provenance', link: '/guides/provenance' },
    { text: 'Capabilities and environments', link: '/guides/tools' },
    { text: 'Storage and backups', link: '/guides/storage' },
    { text: 'Compare two research approaches', link: '/guides/research-example' },
  ] },
  { text: 'Reference', items: [
    { text: 'Command line', link: '/reference/cli' },
    { text: 'Capability and environment reference', link: '/reference/environments' },
    { text: 'Architecture', link: '/reference/architecture' },
    { text: 'Known limitations and troubleshooting', link: '/reference/limitations' },
    { text: 'Compatibility and verification scope', link: '/reference/compatibility' },
  ] },
]
export default defineConfig({
  title: 'Polariton',
  description: 'Persistent research workspaces for humans and AI agents. Learn about research graphs, workers, capabilities, checkpoints, and provenance.',
  srcDir: 'polariton_documentation_website',
  srcExclude: ['README.md'],
  cleanUrls: true,
  vite: {
    publicDir: fileURLToPath(new URL('../public', import.meta.url)),
    plugins: [{
      name: 'polariton:resolve-search-hmr',
      apply: 'serve',
      enforce: 'pre',
      resolveId(id) {
        // VitePress 1.6 accepts this resolved URL for search HMR, but its own
        // resolver only recognizes the bare ID. Resolve the HMR URL for Vite 6.
        if (id === '/@localSearchIndex') return id
      },
    }],
  },
  head: [['link', { rel: 'icon', href: '/polariton-logo.png', type: 'image/png' }]],
  themeConfig: {
    siteTitle: 'Polariton',
    logo: { src: '/polariton-logo.png', alt: '' },
    nav: [{ text: 'Documentation', link: '/' }],
    socialLinks: [{ icon: 'github', link: manifest.repository }],
    sidebar: groups,
    outline: { level: [2, 3], label: 'On this page' },
    search: { provider: 'local' },
    docFooter: { prev: 'Previous', next: 'Next' },
    externalLinkIcon: true,
  },
  markdown: {
    config(md) {
      const fence = md.renderer.rules.fence!
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        if (tokens[idx].info.trim() === 'mermaid') {
          const source = Buffer.from(tokens[idx].content).toString('base64')
          const hash = createHash('sha256').update(tokens[idx].content).digest('hex')
          const drawing = diagrams[hash as keyof typeof diagrams]
          return `<PolaritonDiagram source="${source}" kind="${drawing?.kind ?? ''}" />`
        }
        return fence(tokens, idx, options, env, self)
      }
    },
  },
})
