AGENTS.md — Build a 37signals‑inspired “Bible Study for Hackers” site with Astro 5

Role: You are OpenAI Codex acting as a senior front‑end engineer + UX copy editor.
Objective: Implement a fast, minimalist marketing + content site using Astro v5 with visual inspiration from 37signals.com (big type, generous white space, tight copy, sparing color, simple layout, no gimmicks). Ship production‑ready code.

⸻

0) Guardrails & Constraints
	•	Design vibe: uncompromisingly simple. Large headlines, short paragraphs, single accent color. No carousels; minimal client JS.
	•	Performance: Lighthouse 95+ across the board. Shipped JS on most pages ≤ 0–20 KB.
	•	Typography: system stack by default (fast). One optional self‑hosted display font later.
	•	Color: black on warm off‑white; single accent red.
	•	A11y: WCAG AA. Landmarks, focus, alt text, contrast.
	•	Licensing: Use inspiration only—no copied 37signals assets/copy.

⸻

1) Tech Stack (Astro 5‑ready)
	•	Astro v5 (Node ≥ 18.14).
	•	Content: astro:content collections for posts & studies.
	•	Styling: vanilla CSS with custom properties (no Tailwind by default).
	•	Images: @astrojs/image (sharp) or astro:assets. Use @astrojs/image here.
	•	Markdown/MDX: Markdown for content; add @astrojs/mdx, remark-smartypants, rehype-slug.
	•	Analytics: placeholder script slot.
	•	Deploy: Vercel or Netlify. Output: static.

Astro 5 notes
	•	Pages live in src/pages (not project root).
	•	Prefer getEntry() over getEntryBySlug().
	•	Import global CSS at the component script level (import '../styles/globals.css').

⸻

2) Packages & Setup

Run if missing; otherwise verify.

pnpm add -D @astrojs/mdx @astrojs/rss @astrojs/sitemap @astrojs/image sharp remark-smartypants rehype-slug
mkdir -p src/content/{studies,posts} src/components src/layouts src/styles src/pages public/img

astro.config.mjs (Astro 5):

import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import image from '@astrojs/image'

export default defineConfig({
  site: 'https://example.com', // ← update
  integrations: [mdx(), sitemap(), image()],
  image: { serviceEntryPoint: '@astrojs/image/sharp' },
})


⸻

3) Project Structure (Astro 5)

src/
  components/
    Header.astro
    Footer.astro
    Container.astro
    Button.astro
    Hero.astro
    Section.astro
    FeatureList.astro
    PostCard.astro
    StudyCard.astro
  layouts/
    Base.astro
    Home.astro
    PostLayout.astro
    StudyLayout.astro
  styles/
    globals.css
    prose.css
  content/
    config.ts
    posts/
      hello-world.md
    studies/
      matthew-16-17-20.md
  pages/
    index.astro
    about.astro
    studies/
      index.astro
      [...slug].astro
    posts/
      index.astro
      [...slug].astro
    404.astro
public/
  favicon.svg
  img/
    social-card.png


⸻

4) Design Tokens & Global CSS

src/styles/globals.css

:root{
  --bg:#fffaf7;           /* warm off-white */
  --fg:#111;              /* almost black */
  --muted:#555;           /* secondary text */
  --accent:#e1463a;       /* 37signals-esque red */
  --link:#0a66c2;         /* subtle link color */
  --radius:14px;
  --maxw:72rem;           /* 1152px */
  --lh:1.5;
}
*{box-sizing:border-box}
html{color-scheme:light}
html,body{padding:0;margin:0;background:var(--bg);color:var(--fg);font:16px/var(--lh) ui-sans-serif, -apple-system, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Apple Color Emoji","Segoe UI Emoji"}
img{max-width:100%;height:auto}
a{color:var(--fg);text-underline-offset:2px}
a:hover{color:var(--accent)}

/* Type scale */
h1{font-size:clamp(2.2rem, 4vw, 3.6rem);line-height:1.1;letter-spacing:-0.02em;margin:0 0 0.75em}
h2{font-size:clamp(1.6rem, 2.5vw, 2.2rem);line-height:1.15;letter-spacing:-0.01em;margin:2.2rem 0 0.5rem}
h3{font-size:1.25rem;margin:1.8rem 0 0.4rem}

p{margin:0 0 1rem}
.lead{font-size:1.25rem;color:var(--muted)}
.small{font-size:.875rem;color:var(--muted)}
.mono{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace}

/* Layout */
.container{max-width:var(--maxw);padding:0 1rem;margin:0 auto}
.stack>*+*{margin-top:var(--space,1rem)}
.pad{padding:clamp(2rem, 5vw, 4rem) 0}

/* UI */
.btn{display:inline-block;border:1px solid var(--fg);border-radius:999px;padding:.65rem 1rem;text-decoration:none}
.btn:hover{background:var(--fg);color:var(--bg)}
.btn--accent{border-color:var(--accent);color:var(--accent)}
.btn--accent:hover{background:var(--accent);color:white}

.card{border:1px solid #e7e2dd;border-radius:var(--radius);padding:1.25rem;background:#fff}

hr{border:0;border-top:1px solid #e7e2dd;margin:2rem 0}

Optionally add src/styles/prose.css for long‑form tweaks.

⸻

5) Layouts & Components (Astro 5‑compliant)

src/layouts/Base.astro

---
import '../styles/globals.css'
const { title = 'Bible Study for Hackers', description = 'Text-first, data-friendly scripture studies.', ogImage = '/img/social-card.png' } = Astro.props
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <link rel="icon" href="/favicon.svg" />
  </head>
  <body>
    <slot />
  </body>
</html>

src/components/Header.astro

<header class="pad">
  <div class="container" style="display:flex;align-items:center;justify-content:space-between;gap:1rem">
    <a href="/" class="mono" style="font-weight:700">BSH</a>
    <nav aria-label="primary">
      <a href="/studies/" class="mono" style="margin-right:1rem">Studies</a>
      <a href="/posts/" class="mono" style="margin-right:1rem">Posts</a>
      <a href="/about/" class="mono btn btn--accent">About</a>
    </nav>
  </div>
</header>

src/components/Footer.astro

<footer class="pad">
  <div class="container small" style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:1rem">
    <div>© {new Date().getFullYear()} Bible Study for Hackers</div>
    <div>
      <a href="/rss.xml">RSS</a>
    </div>
  </div>
</footer>

src/components/Hero.astro

---
const { kicker = 'Bible Study for Hackers', title = 'Read scripture like a builder.', lead = 'Minimal, reproducible, peer‑reviewed notes and diagrams.', ctaHref = '/studies/', ctaLabel = 'Explore studies' } = Astro.props
---
<section class="pad">
  <div class="container">
    <p class="mono small" style="color:var(--accent);margin:0 0 .5rem">{kicker}</p>
    <h1>{title}</h1>
    <p class="lead" style="max-width:65ch">{lead}</p>
    <div style="margin-top:1.25rem">
      <a class="btn btn--accent" href={ctaHref}>{ctaLabel}</a>
    </div>
  </div>
</section>

src/components/Section.astro

---
const { title, lead } = Astro.props
---
<section class="pad">
  <div class="container stack" style="--space:1rem">
    {title && <h2>{title}</h2>}
    {lead && <p class="lead">{lead}</p>}
    <slot />
  </div>
</section>

src/components/FeatureList.astro

---
const { items = [] } = Astro.props
---
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem">
  {items.map((it) => (
    <article class="card stack" style="--space:.5rem">
      <h3 style="margin:0">{it.title}</h3>
      <p class="small">{it.body}</p>
    </article>
  ))}
</div>

src/components/PostCard.astro

---
const { href, title, excerpt, date } = Astro.props
---
<a href={href} class="card" style="display:block;text-decoration:none">
  <h3 style="margin-top:0">{title}</h3>
  <p class="small">{excerpt}</p>
  <p class="small mono">{date}</p>
</a>

src/components/StudyCard.astro

---
const { href, title, tags = [], passage, date } = Astro.props
---
<a href={href} class="card" style="display:block;text-decoration:none">
  <p class="mono small" style="color:var(--accent);margin:0">{passage}</p>
  <h3 style="margin:.25rem 0 0">{title}</h3>
  <p class="small mono">{tags.join(', ')} · {date}</p>
</a>


⸻

6) Content Collections

src/content/config.ts

import { defineCollection, z } from 'astro:content'

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    published: z.boolean().default(true),
    date: z.string(),
  })
})

const studies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    passage: z.string(),
    tags: z.array(z.string()).default([]),
    date: z.string(),
    diagram: z.string().optional(), // raw Mermaid or ASCII
    summary: z.string().optional()
  })
})

export const collections = { posts, studies }

Example content

src/content/posts/hello-world.md

---
title: Hello, world
description: Why this site exists.
date: 2025-10-02
---
We read like builders and think like scholars.

src/content/studies/matthew-16-17-20.md

---
title: Keys and Confession
passage: Matthew 16:17–20 (CSB)
tags: [gospel, confession, keys]
date: 2025-10-02
summary: Peter’s confession functions as revelation and commissioning.
diagram: |
  graph LR
    God--Reveals-->Peter[Peter: 'You are the Christ']
    Peter--Speaks-->Jesus
    Jesus--Blesses-->Peter
    Jesus--Gives-->Keys
    Keys-->Church[Bind/Loose]
---
Short notes and observations go here.


⸻

7) Pages (Astro 5)

src/layouts/Home.astro

---
import Base from './Base.astro'
import Header from '../components/Header.astro'
import Footer from '../components/Footer.astro'
import Hero from '../components/Hero.astro'
import Section from '../components/Section.astro'
import FeatureList from '../components/FeatureList.astro'

const features = [
  { title: 'Text‑first', body: 'Plain language, primary text, humble claims.' },
  { title: 'Data‑friendly', body: 'Lexical notes, cross‑refs, transparent sources.' },
  { title: 'Reproducible', body: 'Diagrams, notes, and citations in version control.' },
]
---
<Base title="Bible Study for Hackers" description="Read like a builder. Think like a scholar.">
  <Header />
  <Hero />
  <Section title="Principles" lead="A minimal method for careful readers.">
    <FeatureList items={features} />
  </Section>
  <Footer />
</Base>

src/pages/index.astro

---
import Home from '../layouts/Home.astro'
---
<Home />

src/pages/about.astro

---
import Base from '../layouts/Base.astro'
import Header from '../components/Header.astro'
import Footer from '../components/Footer.astro'
---
<Base title="About">
  <Header />
  <main class="container pad stack" style="--space:1rem;max-width:60ch">
    <h1>About</h1>
    <p>We’re a small project exploring scripture with builder discipline and scholarly care.</p>
  </main>
  <Footer />
</Base>

src/pages/studies/index.astro

---
import Base from '../../layouts/Base.astro'
import Header from '../../components/Header.astro'
import Footer from '../../components/Footer.astro'
import StudyCard from '../../components/StudyCard.astro'
import { getCollection } from 'astro:content'

const studies = (await getCollection('studies'))
  .sort((a,b)=> (a.data.date < b.data.date ? 1:-1))
---
<Base title="Studies">
  <Header />
  <main class="container pad stack">
    <h1>Studies</h1>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem">
      {studies.map(({ slug, data }) => (
        <StudyCard href={`/studies/${slug}/`} title={data.title} tags={data.tags} passage={data.passage} date={data.date} />
      ))}
    </div>
  </main>
  <Footer />
</Base>

src/pages/studies/[...slug].astro

---
import Base from '../../layouts/Base.astro'
import Header from '../../components/Header.astro'
import Footer from '../../components/Footer.astro'
import { getCollection, getEntry } from 'astro:content'

export async function getStaticPaths() {
  const entries = await getCollection('studies')
  return entries.map((e) => ({ params: { slug: e.slug } }))
}

const { slug } = Astro.params
const entry = await getEntry('studies', slug)
const { Content, data } = await entry.render()
---
<Base title={data.title} description={data.summary}>
  <Header />
  <main class="container pad" style="max-width:70ch">
    <p class="mono small" style="color:var(--accent);margin:0">{data.passage}</p>
    <h1 style="margin:.25rem 0 1rem">{data.title}</h1>
    {data.summary && <p class="lead">{data.summary}</p>}
    {data.diagram && (
      <figure class="card" style="margin:1rem 0">
        <pre class="mono small" aria-label="Diagram source">{data.diagram}</pre>
      </figure>
    )}
    <article class="stack" style="--space:1rem">
      <Content />
    </article>
  </main>
  <Footer />
</Base>

src/pages/posts/index.astro

---
import Base from '../../layouts/Base.astro'
import Header from '../../components/Header.astro'
import Footer from '../../components/Footer.astro'
import PostCard from '../../components/PostCard.astro'
import { getCollection } from 'astro:content'

const posts = (await getCollection('posts'))
  .sort((a,b)=> (a.data.date < b.data.date ? 1:-1))
---
<Base title="Posts">
  <Header />
  <main class="container pad stack">
    <h1>Posts</h1>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem">
      {posts.map(({ slug, data }) => (
        <PostCard href={`/posts/${slug}/`} title={data.title} excerpt={data.description} date={data.date} />
      ))}
    </div>
  </main>
  <Footer />
</Base>

src/pages/posts/[...slug].astro

---
import Base from '../../layouts/Base.astro'
import Header from '../../components/Header.astro'
import Footer from '../../components/Footer.astro'
import { getCollection, getEntry } from 'astro:content'

export async function getStaticPaths() {
  const entries = await getCollection('posts')
  return entries.map((e) => ({ params: { slug: e.slug } }))
}

const { slug } = Astro.params
const entry = await getEntry('posts', slug)
const { Content, data } = await entry.render()
---
<Base title={data.title} description={data.description}>
  <Header />
  <main class="container pad" style="max-width:70ch">
    <h1 style="margin:.25rem 0 1rem">{data.title}</h1>
    {data.description && <p class="lead">{data.description}</p>}
    <article class="stack" style="--space:1rem">
      <Content />
    </article>
  </main>
  <Footer />
</Base>

src/pages/404.astro

---
import Base from '../layouts/Base.astro'
---
<Base title="Not found">
  <main class="container pad" style="max-width:60ch">
    <h1>404</h1>
    <p>Page not found.</p>
  </main>
</Base>


⸻

8) RSS & Sitemap

src/pages/rss.xml.js

import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'

export async function GET(context){
  const posts = await getCollection('posts')
  return rss({
    title: 'Bible Study for Hackers',
    description: 'Notes and studies.',
    site: context.site,
    items: posts.map(p=>({ title: p.data.title, pubDate: new Date(p.data.date), description: p.data.description, link: `/posts/${p.slug}/` }))
  })
}

Sitemap is automatic via @astrojs/sitemap (ensure site is set in config).

⸻

9) Accessibility & SEO Checklist
	•	Headings in order; one h1 per page.
	•	Landmarks: <header>, <main>, <footer>.
	•	Contrast meets AA; accent red used sparingly.
	•	Alt text for images; aria-label where appropriate.
	•	Meta description via Base props per page.
	•	Canonical site set in config.

⸻

10) Commands for Codex (use verbatim cues)

Codex should: (1) reason briefly, (2) edit files, (3) output unified diffs or full files as needed, (4) summarize changes, (5) remind pnpm dev.
	•	“Create Astro 5 baseline structure” → scaffold files from sections 3–7 under src/.
	•	“Add a new study” slug title passage → create src/content/studies/slug.md with frontmatter {title, passage, tags:[], date: today} and placeholder body.
	•	“Add a blog post” slug title → create under src/content/posts.
	•	“Tighten type scale” → reduce heading sizes ~8% in globals.css.
	•	“Swap accent color to #COLOR” → update --accent token in globals.css only.
	•	“Make Home hero punchier” → edit Hero.astro copy to one-line headline.
	•	“Add ‘Methods’ page” → create src/pages/methods.astro using Base.
	•	“Configure Vercel/Netlify deploy” → add minimal config (below) + README note.

⸻

11) Deploy Notes

Netlify netlify.toml

[build]
  command = "pnpm run build"
  publish = "dist"

Vercel: framework preset = Astro; no extra config needed for basics.

⸻

12) Roadmap (post‑MVP)
	•	Mermaid rendering at build (e.g., @mermaid-js/mermaid-cli) to embed SVGs.
	•	Static search with Pagefind.
	•	Newsletter form (Buttondown/ConvertKit) + privacy page.
	•	Optional dark mode (class toggle with prefers-color-scheme).

⸻

13) Acceptance Criteria
	•	pnpm dev runs; Home, Studies index, Study detail, Posts index, Post detail, About render.
	•	Lighthouse ≥95 on Home (with placeholder images).
	•	No unnecessary client-side JS.
	•	HTML validates; headings & landmarks correct.

⸻

14) Quick Start (README snippet)

### Develop
pnpm i
pnpm dev

### Build
pnpm build

### Add content via prompts
# Study
pnpm dlx hygen new study --name matthew-16-17-20 --title "Keys and Confession" --passage "Matthew 16:17–20 (CSB)"
# Or ask Codex: "Add a new study matthew-16-17-20 'Keys and Confession' 'Matthew 16:17–20 (CSB)'"


⸻

15) Copy Tone Cheatsheet (37signals‑ish)
	•	Short, declarative, human.
	•	Avoid jargon; use simple verbs.
	•	One idea per paragraph.
	•	Prefer “We build ___.” over mission statements.

⸻

End of AGENTS.md (Astro 5). Codex: follow this spec precisely, keep diffs tight, avoid unnecessary dependencies.