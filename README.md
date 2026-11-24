# Lina El Yacoubi: portfolio

My portfolio site, in a palette I call **Cherry Chrome**: deep plum, cherry red, blush, lilac and chrome.

The background is a particle knot you can drag to spin (click for a ripple). As you scroll it morphs into a new shape for each section.

Sections: hero, a short about me, experience (each job has its own look), projects (Airchestra, Squishy, Movement Atlas and Dino Valley 360, each with an interactive preview, plus a list of older projects), leadership, skills and contact.

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build into dist/
npm run preview   # serve dist/
npm run lint
```

Node 20.19+ (or 22.12+).

## Deploy (Netlify)

`netlify.toml` already sets `npm run build` → `dist/`. Connect the repo in Netlify, or run `npx netlify deploy --prod --dir=dist`.

The canonical URL, share image, `robots.txt` and `sitemap.xml` assume **https://linaelyacou.netlify.app/**. If the domain is different, search-and-replace it in `index.html`, `public/robots.txt` and `public/sitemap.xml`.

## Stack

- React 19 + TypeScript + Vite
- Three.js: one `ShaderMaterial`, seven shapes stored as vertex attributes and blended on the GPU. It loads after the page shows up (`src/three/`).
- GSAP + ScrollTrigger for scroll animations, Lenis for smooth scrolling
- Plain CSS (`src/styles.css`)

## Where things are

```
src/
  data/content.ts        all the text on the site
  three/                 particle shapes + renderer
  lib/motion.ts          GSAP/Lenis setup and helpers
  components/
    World.tsx            background colours + particle canvas
    Hero, About, Experience, Projects, Leadership, Skills, Contact
    rooms/               the four project previews
    ProjectDialog.tsx    "How it works" popup (link: /?project=atlas)
    EasterEggs.tsx
public/media/            screenshots
assets-src/              original images (not deployed)
```

## Accessibility and fallbacks

- The site works without WebGL. If it's missing (or Save-Data is on) you get an animated gradient instead.
- `prefers-reduced-motion` turns off smooth scrolling and scroll animations, and the particles stay still.
- Every preview works with a keyboard (note buttons, snacks, toss/pet, Atlas tabs, arrow keys on the cylinder).
- Placeholders in `content.ts` that start with `TODO` are hidden until filled in.
- The popup uses the native `<dialog>`, so focus is trapped and Escape closes it.

## Easter eggs

Type `squishy`. Try the Konami code. Click empty space. Open the console.
=======
# Lina El Yacoubi — portfolio
>>>>>>> 087cf6fe8bbda4100b2b3fbbd35750ce2f0635b6
