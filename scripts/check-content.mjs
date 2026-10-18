import { readFile, readdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import manifest from '../content-manifest.json' with { type: 'json' }
const root = new URL('../polariton_documentation_website/', import.meta.url)
const actual = (await readdir(root, { recursive: true })).filter(p => p.endsWith('.md')).sort()
const expected = Object.keys(manifest.files).sort()
if (JSON.stringify(actual) !== JSON.stringify(expected)) throw Error('Content inventory differs from reviewed manifest')
for (const [path, entry] of Object.entries(manifest.files)) {
  const bytes = await readFile(new URL(path, root))
  if (createHash('sha256').update(bytes).digest('hex') !== entry.sha256) throw Error(`Content changed: ${path}. Review against its authoritative source before updating the manifest.`)
}
console.log('All 15 supplied Markdown files are byte-for-byte unchanged (14 publishable pages).')
if (!manifest.commit) console.log('Publication blocker: upstream commit and source mappings remain unverified.')
