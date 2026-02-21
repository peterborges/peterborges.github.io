# Portfolio – Claude Project Notes

## Project Overview

Static HTML/CSS/JS portfolio site for Peter Borges, a product designer. No build framework — everything is vanilla HTML, CSS, and JavaScript. Hosted on GitHub Pages at `peterborges.github.io` (also mapped to `peterborges.com`).

**Remote:** `https://github.com/peterborges/peterborges.github.io.git`

---

## File Structure

```
portfolio/
├── index.html                        # Home page
├── govwell-plan-review.html          # Case study pages
├── viam-machine-configuration.html
├── viam-teleop.html
├── arcbest-transportation-management.html
├── auto-ar-pilot.html
├── heb-assortment-optimizer.html
├── manage-my-money.html
├── about.html
├── 404.html
│
├── styles.css                        # Source stylesheet (edit this)
├── styles.min.css                    # Minified — regenerate after every CSS change
│
├── case-study-template.js            # Source JS for case study renderer (edit this)
├── case-study-template.min.js        # Minified — regenerate after every JS change
│
├── side-rail.js                      # Source JS for side-rail TOC nav (edit this)
├── side-rail.min.js                  # Minified — regenerate after every JS change
│
├── partials/
│   ├── header.html                   # Site nav, loaded via fetch() on every page
│   └── footer.html                   # Footer with theme switcher, loaded via fetch()
│
├── case-studies/
│   ├── govwell-plan-review.json      # Case study content (JSON, consumed by template)
│   ├── viam-machine-configuration.json
│   ├── viam-teleop.json
│   ├── arcbest-transportation-management.json
│   ├── auto-ar-pilot.json
│   ├── heb-assortment-optimizer.json
│   └── manage-my-money.json
│
├── images/                           # Static images, organized by page/section
├── videos/                           # Static videos
├── files/                            # Downloadable files (e.g. resume PDF)
└── favicon.svg
```

---

## Minification Pipeline

**Always edit the source files (`.css`, `.js`), then regenerate the `.min` versions.**

All case study HTML pages reference the `.min` versions. Never edit `.min` files directly.

### CSS
```bash
npx clean-css-cli -o styles.min.css styles.css
```

### JavaScript
```bash
# case-study-template.js
npx terser case-study-template.js -o case-study-template.min.js --compress --mangle

# side-rail.js
npx terser side-rail.js -o side-rail.min.js --compress --mangle
```

---

## Case Study Architecture

Case studies are data-driven. Each case study page (e.g. `govwell-plan-review.html`) is a thin shell that:
1. Loads `partials/header.html` and `partials/footer.html` via `fetch()`
2. Instantiates `CaseStudyRenderer` from `case-study-template.js`
3. The renderer fetches the corresponding JSON from `case-studies/` and builds the full DOM

**Side rail navigation** (`side-rail.js`) is initialized after `caseStudyRendered` fires. It:
- Scans all `h2` headings inside `.case-study`
- Builds a sticky table-of-contents sidebar
- Uses `scrollIntoView` + `scroll-margin-top` (dynamic, measured from actual navbar height) for scroll-to-section

---

## Partial HTML System

Header and footer are loaded dynamically on every page:
```js
function includeHTML(selector, url, callback) {
  fetch(url)
    .then(r => r.text())
    .then(data => {
      document.querySelector(selector).innerHTML = data;
      if (callback) callback();
    });
}

includeHTML('#site-header', 'partials/header.html');
includeHTML('#site-footer', 'partials/footer.html', function() {
  // Theme switcher initialization goes here
});
```

After loading the footer partial, each page re-initializes the theme switcher (light/dark/system) from `localStorage`.

---

## Theme System

- Three modes: `light`, `dark`, `system` (follows `prefers-color-scheme`)
- Saved in `localStorage` under key `theme`
- Applied via `data-theme` attribute on `<html>`
- Early-apply script in `<head>` prevents flash of wrong theme

---

## Performance Decisions

- **No Font Awesome** — all icons are inline SVGs in `case-study-template.js`. Do not re-add Font Awesome.
- **Preconnect hints** on all pages for `fonts.googleapis.com` and `fonts.gstatic.com`
- **Preload** for above-fold hero image on index (`borges-headshot.jpeg`)
- **Lazy loading**: City popover images and non-first project card images are `loading="lazy" decoding="async"`. First card image is `loading="eager" decoding="sync"`.
- **Grid pattern cap**: Index page grid is capped at `MAX_SQUARES = 150`. The `IntersectionObserver` stops the pulse interval and nulls the `squares` array when the header scrolls out of view (prevents memory leak).
- **Videos**: Hero videos use `preload="metadata"`, feature/secondary videos use `preload="none"`.
- **No geolocation fetch** — the ipapi.co "last visitor from" footer was removed.

---

## Security Notes

- `case-study-template.js` sanitizes all JSON fields before injecting into HTML attribute slots using `escAttr()`. Do not bypass this for `src`, `href`, or `alt` attributes.
- SRI is not applied to Google Fonts or Google Analytics (their responses are dynamic and not SRI-compatible).

---

## Fonts

Two families loaded from Google Fonts:
- **Inter** (400, 600) — body text
- **DM Serif Display** (400) — site title / hero headline (`h1.site-title`)

Font URL pattern:
```
https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;600&display=swap
```

---

## Git Workflow

- Work happens in a Claude worktree at `.claude/worktrees/<branch-name>/`
- Merge completed work to `main`, then push to remote
- Remote may have diverged — always pull before pushing: `git pull origin main --no-rebase`
- Remote URL (GitHub Pages): `https://github.com/peterborges/peterborges.github.io.git`
