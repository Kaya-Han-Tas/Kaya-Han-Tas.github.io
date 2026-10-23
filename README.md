# Kaya Han Taş: Portfolio

**Live site: [kaya-han-tas.github.io](https://kaya-han-tas.github.io/)**

Personal portfolio of Kaya Han Taş, a data scientist and astrophysicist based in Amsterdam. The site is built around my MSc research: the discovery of **TOI-2431 b**, an Earth-sized lava world with a 5.4-hour orbit, published as a first-author paper in [*Astronomy & Astrophysics* 707, A238 (2026)](https://doi.org/10.1051/0004-6361/202556365).

## What's on the site

- **Discovery:** how TOI-2431 b was found, from TESS candidate to peer-reviewed paper, with figures from the paper and photos from five nights observing on La Palma
- **Media:** videos from the University of Amsterdam and NOVA, plus coverage in Het Parool, AD, The Sun, Phys.org, Universe Today and more
- **Awards:** the KHMW Young Talent Graduation Prize for Astronomy and the API Best MSc Thesis Prize (both 2025)
- **Projects:** [ExoMUSE](https://github.com/Kaya-Han-Tas/ExoMUSE), a facial emotion recognition CNN and [Light Curve Modelling](https://github.com/Kaya-Han-Tas/Light-Curve-Modelling)
- **Experience, education, skills and contact details**, plus a downloadable CV

## How it's built

A single static page with plain HTML, CSS and a little JavaScript. There are no frameworks and no build step, and it's hosted on GitHub Pages.

```
index.html            the whole page
assets/css/style.css  styles (dark "deep space" theme)
assets/js/site.js     menu, starfield, image lightbox, click-to-play videos
images/web/           optimised images used by the page
cv/                   downloadable CV (PDF)
```

## Run it locally

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080. The Instagram videos only load on the live site, not from a local file.

## Credits

Figures in the discovery section are from Taş et al. (2026), *A&A* 707, A238. Photos are from our observing trip to La Palma. Video thumbnails come from the University of Amsterdam and NOVA (AstronomieNL) posts linked on the page. Press logos in the "Featured in" strip belong to their respective owners and are sourced from Wikimedia Commons.
