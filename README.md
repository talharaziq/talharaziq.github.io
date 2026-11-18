# Talha Raziq — Sketchbook Portfolio

A single-page, static portfolio made with plain HTML, CSS and JavaScript. No build step, framework, package manager or backend is required. All sketch effects, project illustrations, social icons and paper treatments are editable in the source.

## Run locally

Open `index.html` in a browser. For a local server, run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

1. Create or open the repository you want to use for this portfolio. For the account homepage, the repository name should be `talharaziq.github.io`.
2. Add `index.html`, `styles.css`, `script.js` and this `README.md` to the repository root.
3. Push the files to the `main` branch.
4. In the repository, open **Settings → Pages**. Choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
5. GitHub Pages will publish the static site. No build command is needed.

## Editing the site

- **Text and links:** edit the content directly in `index.html`.
- **Colors, typography, spacing, sketch shadows and hover effects:** edit the CSS variables at the top of `styles.css`, then adjust the component styles below.
- **Social profiles:** search for `social-link` in `index.html` and change the `href` and SVG as needed.
- **Portrait:** the hero has an editable SVG placeholder. Search for `PORTRAIT PLACEHOLDER` in `index.html` and replace the SVG with your own image, for example:

  ```html
  <img class="portrait-photo" src="assets/talha.jpg" alt="Portrait of Talha Raziq">
  ```

  Add the image under an `assets/` folder and add `.portrait-photo { width: 100%; height: 355px; object-fit: cover; }` to `styles.css`.
- **Website cards:** edit the three `.website-note` articles and their descriptions/links in `index.html`.
- **GitHub projects:** edit the three `.project-card` articles, including their repository links and labels.
- **Illustrations:** every illustration is inline SVG in `index.html`. Change its paths, strokes and labels directly; no image editor is needed.
- **Social hover:** edit `.social-link:hover` and `.social-link::after` in `styles.css`.
- **Interactions:** `script.js` controls the scroll reveal, copy-email button and footer year.

## Notes

- The typography uses Google Fonts (`Caveat`, `Kalam` and `Patrick Hand`). A system cursive fallback is included, but the visual style is closest when the fonts can load.
- The design is responsive and includes reduced-motion support.
- This is a static GitHub Pages site. The email button opens an email client; the copy button copies the address where the browser permits it.
