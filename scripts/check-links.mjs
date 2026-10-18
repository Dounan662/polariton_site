import { readFile, readdir, access } from 'node:fs/promises'
import path from 'node:path'
const root = path.resolve('.vitepress/dist')
const files = (await readdir(root, { recursive: true })).filter(p => p.endsWith('.html'))
const contents = new Map(await Promise.all(files.map(async p => [p, await readFile(path.join(root, p), 'utf8')])))
const errors = []
for (const [file, html] of contents) {
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (/^(?:[a-z]+:|\/\/)/i.test(href)) continue
    const url = new URL(href.replaceAll('&amp;', '&'), `https://local.invalid/${file}`)
    let target = decodeURIComponent(url.pathname).slice(1)
    if (!target || target.endsWith('/')) target += 'index.html'
    else if (!path.extname(target)) target += '.html'
    try { await access(path.join(root, target)) } catch { errors.push(`${file}: missing ${href}`); continue }
    if (url.hash && contents.has(target)) {
      const id = decodeURIComponent(url.hash.slice(1))
      if (!contents.get(target).includes(`id="${id}"`)) errors.push(`${file}: missing anchor ${href}`)
    }
  }
}
if (contents.has('README.html')) errors.push('Handoff README was published')
if (errors.length) throw Error(errors.join('\n'))
console.log(`Built links and heading anchors verified across ${files.length} HTML pages; handoff README excluded.`)
