import type { Plugin } from 'vite'
import { resume } from '../src/data/resume.ts'
import { site } from '../src/data/site.ts'

const escape = (value: string) => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
const name = `${resume.firstName} ${resume.lastName}`
const absolute = (path: string) => new URL(path, site.url).href

function readablePortfolio() {
  const paragraphs = (items: string[]) => items.map(p => `<p>${escape(p)}</p>`).join('')
  return `<main class="static-portfolio">
    <header id="hero"><h1>${escape(name)}</h1><p>${escape(resume.role)} · ${escape(resume.location)}</p><p>${escape(resume.tagline)}</p></header>
    <nav aria-label="Sections"><a href="#about">About</a><a href="#skills">Stack</a><a href="#experience">Experience</a><a href="#projects">Work</a><a href="#contact">Contact</a></nav>
    <section id="about"><h2>About ${escape(resume.firstName)}</h2><p>${escape(resume.about.lead)} ${escape(resume.about.leadAccent)}</p>${paragraphs(resume.about.body)}
      <ul>${resume.about.stats.map(s => `<li>${escape(`${s.prefix || ''}${s.value}${s.suffix || ''} ${s.label}`)}</li>`).join('')}</ul></section>
    <section id="skills"><h2>Skills and technology</h2>${resume.stack.map(layer => `<article><h3>${escape(layer.name)}</h3><p>${escape(layer.blurb)}</p><ul>${layer.skills.map(skill => `<li>${escape(skill.name)} — ${escape(skill.note)}</li>`).join('')}</ul></article>`).join('')}</section>
    <section id="experience"><h2>Experience and education</h2>${resume.experience.map(job => `<article><h3>${escape(job.role)} — ${escape(job.org)}</h3>${job.period ? `<p>${escape(job.period)}</p>` : ''}${job.orgNote ? `<p>${escape(job.orgNote)}</p>` : ''}${paragraphs(job.points)}</article>`).join('')}</section>
    <section id="projects"><h2>Selected projects</h2>${resume.projects.map(project => `<article><h3>${escape(project.title)}</h3><p>${escape(project.kind)}</p><p>${escape(project.blurb)}</p><a href="${escape(project.href)}">Visit ${escape(project.linkLabel)}</a></article>`).join('')}</section>
    <section id="contact"><h2>Contact ${escape(resume.firstName)}</h2><p><a href="mailto:${escape(resume.email)}">${escape(resume.email)}</a></p>${resume.links.map(link => `<p><a href="${escape(link.href)}">${escape(link.label)} — ${escape(link.handle)}</a></p>`).join('')}</section>
  </main>`
}

function structuredData() {
  const personId = absolute('#person')
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Person', '@id': personId, name, alternateName: 'ayush-init', url: site.url,
        description: resume.tagline, jobTitle: resume.role, email: resume.email,
        sameAs: resume.links.map(link => link.href),
        knowsAbout: [...new Set(resume.stack.flatMap(layer => layer.skills.map(skill => skill.name)))],
        homeLocation: { '@type': 'Place', name: resume.location },
      },
      { '@type': 'WebSite', '@id': absolute('#website'), url: site.url, name: `${name} Portfolio`, inLanguage: 'en', publisher: { '@id': personId } },
      { '@type': 'ProfilePage', '@id': absolute('#profile'), url: site.url, name: site.title,
        description: site.description, inLanguage: 'en', isPartOf: { '@id': absolute('#website') },
        mainEntity: { '@id': personId },
        hasPart: resume.projects.map(project => ({ '@type': 'CreativeWork', name: project.title, url: project.href, description: project.blurb })),
      },
    ],
  }).replace(/</g, '\\u003c')
}

function markdownPortfolio() {
  return `# ${name}\n\n${resume.role} | ${resume.location}\n\n${resume.tagline}\n\nPortfolio: ${site.url}\n\n## About\n\n${resume.about.body.join('\n\n')}\n\n## Skills\n\n${resume.stack.map(layer => `### ${layer.name}\n\n${layer.blurb}\n\n${layer.skills.map(skill => `- ${skill.name}: ${skill.note}`).join('\n')}`).join('\n\n')}\n\n## Experience and education\n\n${resume.experience.map(job => `### ${job.role} — ${job.org}\n\n${job.period || ''}\n\n${job.points.map(point => `- ${point}`).join('\n')}`).join('\n\n')}\n\n## Projects\n\n${resume.projects.map(project => `### ${project.title}\n\n${project.blurb}\n\n${project.href}`).join('\n\n')}\n\n## Contact\n\n- Email: ${resume.email}\n${resume.links.map(link => `- ${link.label}: ${link.href}`).join('\n')}\n`
}

export function portfolioSeo(): Plugin {
  const files: Record<string, { type: string; source: string }> = {
    'robots.txt': { type: 'text/plain', source: `User-agent: *\nAllow: /\n\nSitemap: ${absolute('sitemap.xml')}\n` },
    'sitemap.xml': { type: 'application/xml', source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(site.url)}</loc></url></urlset>\n` },
    'portfolio.md': { type: 'text/plain; charset=utf-8', source: markdownPortfolio() },
    'llms.txt': { type: 'text/plain; charset=utf-8', source: `# ${name}\n\n> ${resume.tagline}\n\n## Portfolio\n\n- [Portfolio](${site.url}): About, skills, experience, projects and contact.\n- [Profile in Markdown](${absolute('portfolio.md')}): Readable details from the same data used on the website.\n\n## Profiles\n\n${resume.links.map(link => `- [${link.label}](${link.href})`).join('\n')}\n` },
  }
  return {
    name: 'portfolio-seo',
    transformIndexHtml: {
      order: 'pre',
      handler: html => ({
        html: html.replace('<!-- portfolio-content -->', readablePortfolio()),
        tags: [
          { tag: 'title', children: site.title, injectTo: 'head' },
          ...[
            ['name', 'description', site.description], ['name', 'author', name],
            ['name', 'robots', 'index, follow, max-image-preview:large'],
            ['property', 'og:type', 'website'], ['property', 'og:site_name', `${name} Portfolio`],
            ['property', 'og:title', site.title], ['property', 'og:description', site.description],
            ['property', 'og:url', site.url], ['property', 'og:locale', 'en_IN'],
            ['property', 'og:image', absolute(site.image)], ['property', 'og:image:secure_url', absolute(site.image)],
            ['property', 'og:image:type', 'image/png'], ['property', 'og:image:width', '1200'],
            ['property', 'og:image:height', '630'], ['property', 'og:image:alt', site.imageAlt],
            ['name', 'twitter:card', 'summary_large_image'], ['name', 'twitter:title', site.title],
            ['name', 'twitter:description', site.description], ['name', 'twitter:image', absolute(site.image)],
            ['name', 'twitter:image:alt', site.imageAlt],
          ].map(([attr, key, content]) => ({ tag: 'meta', attrs: { [attr]: key, content }, injectTo: 'head' as const })),
          { tag: 'link', attrs: { rel: 'canonical', href: site.url }, injectTo: 'head' },
          { tag: 'script', attrs: { type: 'application/ld+json' }, children: structuredData(), injectTo: 'head' },
        ],
      }),
    },
    generateBundle() {
      for (const [fileName, file] of Object.entries(files)) this.emitFile({ type: 'asset', fileName, source: file.source })
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = 'url' in req && typeof req.url === 'string' ? req.url.split('?')[0] : ''
        const file = files[pathname.slice(1)]
        if (!file) return next()
        res.setHeader('Content-Type', file.type)
        res.end(file.source)
      })
    },
  }
}
