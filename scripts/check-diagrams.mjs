import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import manifest from '../.vitepress/diagram-manifest.json' with { type: 'json' }
import { illustration } from '../.vitepress/theme/illustrations.ts'
const normalize = text => text.replace(/<br\s*\/?\s*>/gi, ' ').replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().toLowerCase()
for (const [hash, entry] of Object.entries(manifest)) {
  const markdown = await readFile(new URL(`../polariton_documentation_website/${entry.source}`, import.meta.url), 'utf8')
  const source = [...markdown.matchAll(/```mermaid\n([\s\S]*?)```/g)].map(m => m[1]).find(s => createHash('sha256').update(s).digest('hex') === hash)
  if (!source) throw Error(`Review illustration after source change: ${entry.source} (${entry.kind})`)
  const svg = illustration(entry.kind, 'check')
  if (!svg) throw Error(`Missing illustration: ${entry.kind}`)
  const rendered = normalize(svg)
  const labels = [...source.matchAll(/(?:\w+\("|subgraph\s+\w+\[")([\s\S]*?)(?:"\)|"\])/g)].map(m => m[1])
  labels.push(...[...source.matchAll(/\|([^|]+)\|/g)].map(m => m[1]))
  for (const label of labels) {
    if (!rendered.includes(normalize(label))) throw Error(`Missing label in ${entry.kind}: ${label}`)
  }
  const expectedArrows = (source.match(/-->|-\.->/g) || []).length
  if ((svg.match(/marker-end=/g) || []).length !== expectedArrows) throw Error(`Arrow count differs in ${entry.kind}`)
}
console.log('All five illustrations match their source hashes, labels, and directed-edge counts.')
