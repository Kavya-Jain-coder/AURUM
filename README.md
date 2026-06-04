# AURUM — A Luxury Black & Gold Experience

A cinematic, full-scroll website that uses all 10 of your black-and-gold images as immersive section backgrounds.

---

## Setup

### Option A — Node.js (Recommended)
```bash
node server.js
# Open http://localhost:3000
```

### Option B — Python
```bash
python3 -m http.server 3000
# Open http://localhost:3000
```

### Option C — VS Code Live Server
Install the "Live Server" extension, right-click index.html → "Open with Live Server".

---

## Structure

```
gold-website/
├── index.html          ← Main website file (all HTML/CSS/JS)
├── server.js           ← Tiny Node.js dev server
└── public/
    └── images/         ← Your 10 gold images (copy them here)
        ├── autumn-leave-falling-down-black-surface.jpg
        ├── gold-glitter-particles-explosion-bokeh-background.jpg
        ├── golden-reflections-background.jpg
        ├── 5505783.jpg
        ├── 5506461.jpg
        ├── 5739638.jpg
        ├── 5802961.jpg
        ├── 6160399.jpg
        ├── 6209554.jpg
        └── 24783.jpg
```

---

## Features

- **Custom gold cursor** with magnetic ring
- **Cinematic loading screen** with animated progress bar
- **GSAP ScrollTrigger** animations (parallax, reveal-up, reveal-left, reveal-right, scale)
- **Floating particle system** (canvas-based gold particles)
- **Scroll progress bar** at the top
- **Animated counter** (5,000+ years counter)
- **Marquee text strip** between hero and sections
- **9 immersive full-screen sections** — one per image chapter
- **Magnetic nav links**
- **Glitch text effect** on hero title
- **Responsive design**

---

## Customization

Edit `index.html`:
- Change the site title/tagline in the `<title>` and `.hero-title`
- Swap section copy in each `<section>`
- Adjust `--gold` CSS variable to shift the gold tone
- Add your own Google Font by replacing the `@import` URL