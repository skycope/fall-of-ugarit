# The Fall of Ugarit - Landing Page

## Project Overview
Landing page for "The Fall of Ugarit" by Michael Cope, a novella published by Vanity Press (2025).

**Live site:** https://fallofugarit.com
**Maintainer:** Sky Cope
**Author:** Michael Cope (Sky's dad)

## Tech Stack
- **Framework:** Astro
- **3D:** Three.js (vanilla, inline script)
- **Styling:** Inline CSS (no Tailwind)
- **Hosting:** Vercel (auto-deploys from GitHub)
- **Repo:** https://github.com/skycope/fall-of-ugarit

## Key Files
- `src/pages/index.astro` - Main (only) page, contains all HTML, CSS, and JS
- `public/assets/` - Book cover textures, author photo, decorative illustrations

## Design Notes
- **Primary blue:** `#10265f`
- **Gold accent:** `#ffb102` (matches book cover)
- **Fonts:** Crimson Text (headings), EB Garamond (body)
- **3D book:** Custom shader applies metallic gold effect to yellow pixels on cover textures
- **Decorative illustrations:** White silhouettes from author's assets

## Pending / TBD
- [ ] Payment integration (considering Yoco payment links)
- [ ] Stock management approach
- [ ] Collection vs delivery options (R400 collect, R500 delivered)
- [ ] Future features (blog, other content) - undecided

## Important Rules
- **No AI-generated copy** - Ask before adding any new text content
- **Assets from author** - All illustrations are from Michael Cope, don't add new ones without checking
- **Design is flexible** - Nothing is set in stone, but maintain the premium book-cover aesthetic

## Local Development
```bash
npm install
npm run dev    # runs on localhost:4321
```

## Deployment
Push to `main` branch - Vercel auto-deploys.

```bash
git add -A && git commit -m "message" && git push
```
