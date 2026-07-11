# 👶 Baby Announcement — baby.gauravwankar.com

A lightweight, mobile-first single-page baby announcement. Pure HTML/CSS/JS — no build step, no backend, no dependencies.

## Project structure

```
├── index.html            # Page structure, OG metadata, music controls
├── css/style.css         # Design tokens + all styling (tokens at the top)
├── js/main.js            # Sky, particles, confetti, characters, scenes, audio
├── assets/
│   ├── images/
│   │   ├── baby.svg      # Placeholder baby illustration (replaceable)
│   │   ├── og-image.png  # Link-preview image (1200×630)
│   │   └── favicon-*.png
│   └── audio/            # Put music.mp3 here
├── CNAME                 # Custom domain for GitHub Pages
└── .nojekyll             # Tells GitHub Pages to serve files as-is
```

## 1. Replace the baby image

1. Add your image to `assets/images/` — e.g. `baby.png` or `baby.jpg` (a square image ≥ 600×600 looks best; it's shown inside a circle).
2. In `index.html`, change one line:

```html
<img src="assets/images/baby.png" ... />
```

If your file is missing or fails to load, the page automatically falls back to the built-in `baby.svg`.

Also consider regenerating `og-image.png` with your own photo so shared links show it (any 1200×630 image works — just overwrite the file).

## 2. Add the music

1. Pick a soft, royalty-free track (gentle piano / lullaby / music box). Good sources: [Pixabay Music](https://pixabay.com/music/), [Free Music Archive](https://freemusicarchive.org/), [YouTube Audio Library](https://studio.youtube.com/) — check the license allows web use.
2. Save it as `assets/audio/music.mp3`.

That's it. The music starts only after the visitor taps **"Tap to Reveal the Surprise"** (this is required by browser autoplay policies), loops during the celebration, and can be paused, muted or volume-adjusted from the control dock in the corner. If no file is present the site still works, just silently.

Tip: compress the MP3 to ≤ 1–2 MB (128 kbps is plenty) so the page stays fast on mobile data.

## 3. Deploy on GitHub Pages

1. Create a new GitHub repository, e.g. `baby-announcement`.
2. Push this folder to it:

```bash
cd baby-announcement
git init
git add .
git commit -m "Baby announcement site"
git branch -M main
git remote add origin https://github.com/<your-username>/baby-announcement.git
git push -u origin main
```

3. In the repository: **Settings → Pages**
   - **Source:** "Deploy from a branch"
   - **Branch:** `main`, folder `/ (root)` → **Save**
4. Wait ~1 minute. The site is live at `https://<your-username>.github.io/baby-announcement/`.

All asset paths in this project are **relative** (`assets/...`, `css/...`), so the site works at any URL — the github.io subpath *and* the custom subdomain — without changes. The only absolute URLs are the Open Graph tags, which already point to `https://baby.gauravwankar.com/`.

## 4. Custom domain: baby.gauravwankar.com

### a) The CNAME file (already included)

This repo already contains a `CNAME` file with a single line:

```
baby.gauravwankar.com
```

GitHub Pages reads this file to bind the domain. If you ever change the domain, edit this file (or set the domain in **Settings → Pages → Custom domain**, which rewrites the file for you — don't do both with different values).

### b) GoDaddy DNS configuration

1. Log in to GoDaddy → **My Products** → next to `gauravwankar.com` click **DNS** (Manage DNS).
2. Click **Add New Record** and create:

| Type  | Name  | Value                        | TTL     |
|-------|-------|------------------------------|---------|
| CNAME | baby  | `<your-username>.github.io`  | 1 Hour  |

   - **Name** is just `baby` (GoDaddy appends the domain automatically).
   - **Value** is your GitHub Pages hostname **without** the repository name and **without** `https://` — e.g. `gauravwankar.github.io`.
   - If a record named `baby` already exists, edit it instead of adding a duplicate.
3. Save. DNS usually propagates in minutes but can take up to 48 hours.

### c) Connect it in GitHub

1. Repo → **Settings → Pages → Custom domain** → enter `baby.gauravwankar.com` → **Save**.
2. GitHub runs a DNS check. Once it passes, tick **Enforce HTTPS** (the certificate is issued automatically; if the checkbox is greyed out, wait a bit and refresh).

Verify from a terminal:

```bash
dig baby.gauravwankar.com +short
# should print <your-username>.github.io. and then GitHub's IPs
```

## 5. Customizing the experience

- **Names, date, messages** — all copy lives in `index.html` in plain text.
- **Colors & fonts** — edit the design tokens at the top of `css/style.css` (`:root { --blush: ... }`). Everything derives from them.
- **The character crowd** — edit the `CAST` array at the top of section 5 in `js/main.js`. Each entry sets a label, skin/outfit/hair colors, and flags: `wave`, `dance`, `small` (child-sized), `glasses`, `bun`.
- **Timing** — the celebration scene runs 11 s before the finale; change `celebrationLength` in `js/main.js`.
- **Reduced motion** — visitors with "reduce motion" enabled get the full story without particles/confetti automatically.

## Performance notes

- No frameworks, no libraries; ~30 KB of code total (before the music file).
- Confetti and particles run on `<canvas>` with capped particle counts scaled to screen width.
- Fonts load from Google Fonts with `display=swap`; the audio uses `preload="none"` so nothing heavy loads before the tap.
