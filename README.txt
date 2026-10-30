TALHA RAZIQ — TERMINAL / CINEMATIC PORTFOLIO (V3)
=================================================

CONTENTS
--------
index.html       Semantic, SEO-focused portfolio page and structured data
style.css        Responsive green-on-black terminal visual system and animations
script.js        Navigation, responsive portrait scan, interactions and optional UI tones
robots.txt       Crawler access rules and sitemap reference
sitemap.xml      XML sitemap for the portfolio homepage
assets/favicon.svg
assets/og-cover.png  Social sharing preview image
assets/profile.jpg  Copy your existing portrait here before publishing

IMPORTANT: ADD YOUR EXISTING PROFILE PHOTO
-----------------------------------------
The original portrait binary was not available in the working copy used to build
this archive. Before publishing, copy the existing file from your old repository:

  old repository: assets/profile.jpg
  new repository: assets/profile.jpg

The page already points to that exact path. The scanner works over the portrait
and falls back to a styled TR monogram if the file is missing. Add your real photo
to see the full portrait scan effect.

UPLOAD TO GITHUB PAGES
----------------------
1. Extract this ZIP.
2. Copy your existing assets/profile.jpg into the extracted assets/ folder.
3. Upload the CONTENTS of this folder to the ROOT of talharaziq.github.io.
   Keep index.html, style.css, script.js, robots.txt, sitemap.xml and assets/ together.
4. Commit to the main branch and allow GitHub Pages to publish from the repository root.

WHAT CHANGED IN V3
------------------
- Removed page-level zoom/scale behavior and any animation on the page background.
- Tightened the opening hero layout and reduced the empty space before About.
- Changed the main name to a bold display face while keeping terminal fonts for the rest.
- The green Q now rolls and bounces across the letters before dropping into RaziQ.
- The portrait scan runs for 5 seconds on desktop and 12 seconds on mobile/touch devices.
  The green beam moves quickly up and down while bright binary trails remain visible.
- Replaced each independent nav underline with one shared indicator that glides to
  the active section in sequence; it also previews hovered/focused desktop links.
- Clipped decorative overflow at small widths to prevent horizontal scrolling.
- The opening page remains responsive at phone, tablet and desktop widths.

ANIMATION / INTERACTION NOTES
-----------------------------
- The portrait scan starts on page load and ends with the black APPROVED stamp.
- The SOUND OFF control enables subtle generated interface tones only after a visitor
  explicitly turns sound on. There is no autoplay audio.
- Navigation tracks the current section; mobile navigation uses a hamburger menu.
- Cards use layered green borders and hover shape changes, without viewport zoom or
  pointer-driven tilt.
- Motion preferences are respected. Content remains readable with reduced motion.

SEO / CONTENT NOTES
-------------------
- Includes title and description, canonical URL, Open Graph and Twitter metadata,
  Person JSON-LD structured data, semantic headings, robots.txt and sitemap.
- Visible portfolio content retains the existing facts, projects, publication,
  skills, courses, membership, education and contact links.
- Future entry slots are inside HTML comments and do not render.
- Uses local/system fonts; no external font or animation library request is required.

No build step or package installation is required. This is a static GitHub Pages site.
