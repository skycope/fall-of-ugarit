# The Fall of Ugarit

Landing page for *The Fall of Ugarit*, a novella by Michael Cope, published by Vanity Press (2025).

**Live site:** https://fallofugarit.com

## About the Book

*The Fall of Ugarit* weaves together two narratives: a contemporary story set in False Bay, Cape Town during a plague, and an ancient tale from Ugarit, a Bronze Age port in Northern Canaan circa 1200 BCE. The novella features illuminations by the author.

## Tech Stack

- **Framework:** [Astro](https://astro.build/) - Static site generator
- **3D Graphics:** [Three.js](https://threejs.org/) - Interactive 3D book cover
- **Styling:** Inline CSS (no Tailwind in production build)
- **Fonts:** Joanna (primary), Crimson Text, EB Garamond (fallbacks)
- **Hosting:** [Vercel](https://vercel.com/) - Auto-deploys from GitHub

## Project Structure

```
├── public/
│   ├── assets/           # Images: book covers, author photo, decorative illustrations
│   └── fonts/            # Joanna font file
├── src/
│   ├── pages/
│   │   └── index.astro   # Main (only) page - contains all HTML, CSS, and JS
│   └── styles/
│       └── global.css    # Legacy styles (not actively used)
├── CLAUDE.md             # AI assistant instructions
└── README.md             # This file
```

## Key Features

### Interactive 3D Book
- Custom Three.js implementation with realistic paperback rendering
- Metallic gold shader effect on cover text (detects yellow pixels, applies gold specular)
- Drag-to-rotate interaction with momentum
- Responsive - works on mobile and desktop

### Design Elements
- **Primary blue:** `#10265f`
- **Gold accent:** `#ffb102` (matches book cover)
- **Decorative illustrations:** White silhouettes from author's artwork (tern, ibis, crow, asherah, shells, lyre, wheelchair)

### Page Sections
1. **Hero** - Title, author, synopsis, buy options
2. **From the Book** - Two extracts (False Bay + Ugarit narratives)
3. **Praise** - Reviews from Karin Schimke and Finuala Dowling
4. **About the Author** - Bio and other published works
5. **Footer** - Copyright

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

The site auto-deploys to Vercel when changes are pushed to the `main` branch.

```bash
# Quick deploy workflow
git add -A && git commit -m "your message" && git push
```

## Assets

All decorative illustrations are original artwork by Michael Cope. The book cover textures are in `public/assets/`:
- `book-front.png` - Front cover
- `book-back.png` - Back cover
- `book-spine.png` - Spine

## Buy Options

Currently configured with:
- **Paperback:** R400 (links to email order)
- **E-book:** Coming soon (disabled)

Payment integration TBD - considering Yoco, PayFast, or similar SA payment providers.

## Other Works

Links to Michael Cope's other book *Concerning the Work*:
- [Thin Ice Press](https://www.thinicepress.org/concerning-the-work) - Special hand-made edition (York, UK)
- [River Press](https://www.riverpress.co.za) - Paperback trade edition (Cape Town)

## Credits

- **Author:** Michael Cope
- **Illustrations:** Michael Cope
- **Publisher:** Vanity Press, 2025
- **Website:** Sky Cope

## License

Content and artwork © 2025 Michael Cope. All rights reserved.
