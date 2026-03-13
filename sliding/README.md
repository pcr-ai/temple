# 🖼️ sliding/

This folder contains the images used in the **Hero Slideshow** on the Gallery page (`gallery.html`).

## How to Add / Change Slides

1. **Place your image files** in this folder.  
   Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`  
   Recommended size: **1400 × 500 px** or wider (landscape).

2. **Register each image** in `gallery.html` by editing the `SLIDES` array in the slideshow script (near the bottom of the file):

```js
var SLIDES = [
  { src: 'sliding/slide1.jpg',  caption: 'Rameswar — Ramanathaswamy Temple, Tamil Nadu' },
  { src: 'sliding/slide2.jpg',  caption: 'Jagannath Temple, Puri — Odisha' },
  { src: 'sliding/slide3.jpg',  caption: 'Badrinath Temple — Garhwal Himalayas' },
  { src: 'sliding/slide4.jpg',  caption: 'Dwarkadhish Temple — Dwaraka, Gujarat' },
  // Add more entries here...
];
```

3. **`caption`** is optional — leave it as `''` to show no caption.

## Current Expected Files

| File | Used for |
|------|----------|
| `slide1.jpg` | Rameswar slide |
| `slide2.jpg` | Jagannath slide |
| `slide3.jpg` | Badrinath slide |
| `slide4.jpg` | Dwaraka slide |

> **Fallback:** If a local image file is missing, the slideshow automatically skips it and shows only the slides that successfully load (including the built-in Unsplash fallback images).

## Slideshow Settings

These can be changed inside the `SLIDES` script block in `gallery.html`:

| Setting | Default | Description |
|---------|---------|-------------|
| `INTERVAL` | `4000` ms | Time each slide is shown |
| `FADE_MS`  | `1200` ms | Crossfade transition speed |

## Controls

- **Auto-play** — advances every 4 seconds
- **Arrows** — ‹ › buttons on left/right of hero
- **Dots** — click any dot to jump to that slide
- **Hover** — pauses auto-play while hovering
- **Keyboard** — ← → arrow keys to navigate
