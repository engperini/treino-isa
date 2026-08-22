# Treino da Isa 🏋️‍♀️🏃‍♀️

🌐 **[Leia em Português](README.md)**

A personal workout app, built for **100% offline** use on a phone. It brings
together strength training (gym and home, glute-focused), running (a 4-week
plan), and optional weight/measurement tracking — no server, no account, no
ads. All data stays on the device it's used on.

## 📲 Install (for any user)

No need to clone anything to use it — the app is already published and ready:

**👉 https://engperini.github.io/treino-isa/**

### Android (Chrome, Edge, Brave, Samsung Internet)
1. Open the link above.
2. Tap the **⋮** menu in the top-right corner.
3. Tap **"Install app"** (or wait for the banner that shows up on its own).
4. Done — the icon appears in the app drawer, just like an app downloaded
   from a store. It opens full screen, with no browser bar, and works
   without internet after the first time it's opened.

### iPhone (Safari)
1. Open the link above **in Safari** (required — other browsers on iOS
   don't offer this option, even Chrome).
2. Tap the **share** icon (the square with an arrow pointing up), in the
   bottom bar.
3. Scroll through the options and tap **"Add to Home Screen"**.
4. Confirm the name and tap **"Add"**.

On iPhone the end result is the same (its own icon, full screen, offline),
just the way to install it is different — Apple doesn't offer the automatic
"Install" button that Android has. Two small Safari limitations: vibration
and "keep screen awake" during the guided run don't work (the app keeps
working normally, just without those two notifications). Because of that,
it's worth making a habit of using the backup in **Settings** if you're on
an iPhone.

## Features

**Strength**
- Gym and Home plans, workouts A through D, with sets, reps and tips.
- Every exercise has an **SVG animation** (a moving stick figure), with
  slow motion and pause — no external images needed.
- Set-by-set checking, with **automatic rest** between them (a timer that
  vibrates when it ends, on Android).
- A load field (kg) per exercise, saved for the next session.

**Running**
- A 4-week plan with fartlek, intervals, tempo runs, a pyramid, long runs
  and a recovery run.
- **Full-screen guided workout**: a timer per block, intensity (Z2–Z5),
  a preview of the next block, vibration on the switch.
- Logging distance, time and perceived effort (RPE 1–10), with
  **pace calculated automatically**.

**Measurements** *(optional)*
- Free-form logging of weight and body measurements (waist, hips, bust,
  arms, thighs) — fill in only what you want in each entry.
- **Automatic comparison** between the first and the latest measurement.
- A simple chart of weight over time.
- Full history, with the option to delete individual entries.

**General**
- Progress tab: day streak, workouts this week, history, total km and
  average pace.
- Backup and restore via a `.json` file (includes strength, running and
  measurements).
- Installable as a **PWA** — works without internet after the first time
  it's opened.
- **Three languages**: Portuguese, English and Spanish, with a selector in
  the Settings tab. All the content (exercise names, tips, the running plan)
  is translated, not just the menus.
- **Customizable name**: when logging a measurement, you can enter the name
  of whoever is using the app — from then on, the home screen shows
  "{name}'s Workout" (or the equivalent in the chosen language). It's
  optional; without a name, the app shows a generic title.

## For developers

### Clone and run locally

```bash
git clone https://github.com/engperini/treino-isa.git
cd treino-isa
npx serve .
```

Any static server works (`npx serve .`, `python3 -m http.server`, Netlify
Drop, Vercel, Cloudflare Pages…). What matters is serving over HTTPS (or
`localhost`) for the Service Worker to work — a file opened directly from
disk (`file://`) doesn't enable the offline cache or the "Install app"
button.

This repository is already published via **GitHub Pages**
(Settings → Pages → branch `main`, folder `/`), so any change pushed to
`main` updates the install link automatically.

### Single file (optional)

To generate a version with everything embedded in a single `.html` file —
handy for sending over WhatsApp/email without needing a link:

```bash
python3 build.py
```

This creates `treino-isa.html` in the root folder (git-ignored). That
version doesn't support the Service Worker (since it runs as `file://`), so
it doesn't get automatic offline caching or install as a real app — it's
just a quick shortcut for testing or sharing.

## Project structure

```
├── index.html      # page markup
├── app.css         # all visual styling
├── i18n.js         # translations (PT/EN/ES) — interface and content
├── data.js         # strength plan (exercises, sets, tips)
├── poses.js        # animation engine: SVG poses for each exercise
├── corrida.js      # running plan (weeks, blocks, RPE)
├── medidas.js      # weight and body measurements (logging, chart, history)
├── app.js          # app logic, screens, navigation and local storage
├── manifest.json   # PWA metadata
├── sw.js           # service worker (offline cache)
├── icone.svg       # app icon
└── build.py        # generates the single-file version (optional)
```

No external dependencies, no required build step. It's plain HTML/CSS/JS —
`build.py` is just an optional utility.

## Customize

- **Change strength exercises**: edit the `PLANO` object in `data.js`.
- **Change the running plan**: edit the `CORRIDA` object in `corrida.js`.
  Each workout is a list of blocks, by time or distance:
  ```js
  { i: "forte", s: 120, t: "Tiro forte" }   // 120 seconds, hard
  { i: "leve",  m: 400, t: "Trote" }        // 400 meters, easy
  ```
- **Change measurement fields**: edit `CAMPOS_MEDIDA` in `medidas.js` — each
  entry automatically becomes a form field and a comparison line.
- **Add or review translations**: edit `i18n.js`. `UI` holds the fixed
  interface text (menus, buttons); `CONTEUDO` translates content text
  (exercise names, tips) using the original Portuguese as the key — text
  without a registered translation simply shows up in Portuguese, without
  breaking the app.
- **New exercise animation**: add an entry to `ARTES` (`poses.js`) with two
  poses (`a` and `b`) — the app interpolates between them.
- **Colors and typography**: variables at the top of `app.css` (`:root`).

After editing, commit and push to the `main` branch — GitHub Pages updates
the install link on its own within 1–2 minutes.

## Privacy

All progress (checked sets, weights, runs, measurements, history) is saved
in the browser's `localStorage` — nothing is sent to any server. Backup and
restore are done manually, via file, in the Settings tab.

## License

Personal, free use. Adapt it however you like for your own workout.
