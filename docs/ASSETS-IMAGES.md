# Image Assets and Optimization

## Policy

- Prefer WebP for raster images.
- Strip metadata and target visually lossless quality (≈85).
- Keep filenames lowercase with hyphens.

## Commands (ImageMagick)

```
convert source.png -strip -quality 85 -define webp:method=6 output.webp
```

- Update references in `index.html` after converting.
- Remove old PNGs once WebP is working.

## Current Assets

- `cybersmith.webp` — header and home hero
- `cyberknight-welder.webp` — club page hero
