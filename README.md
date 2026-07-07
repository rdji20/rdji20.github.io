# rdji20.github.io — personal research site

Personal website for Roberto Infante — cognitive computing / language-based AI research.
Static, no build step. Clean academic layout (Fraunces + Inter) with a restrained
Huginn-purple accent borrowed from the Hug&Mun Labs design system.

## Structure
```
index.html      # the whole page
styles.css      # styles
assets/
  roberto.jpg           # profile photo
  gentags-preprint.pdf  # ACL 2026 preprint
  favicon.svg           # raven-eye favicon
  cv.pdf                # ← ADD THIS (your CV) — index.html links to it
```

## Before it's fully live — fill these in
- **`assets/cv.pdf`** — drop your CV PDF here (the "CV" link points to it).
- **Scholar link** — replace `https://scholar.google.com/` in `index.html` with your profile URL.
- **Hug&Mun link** — `https://hugmun.com` is a placeholder; update if the URL differs.

## Local preview
```
python3 -m http.server 8000    # then open http://localhost:8000
```

## Deploy (GitHub Pages)
Pushed to `main` on `github.com/rdji20/website`. Enable Pages:
Repo → Settings → Pages → Source: **Deploy from a branch** → Branch: **main** / **/(root)**.
Site serves at `https://rdji20.github.io/website/`.
