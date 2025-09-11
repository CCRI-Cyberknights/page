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

- `cybersmith.webp` — header and home hero, social sharing image
- `cyberknight-welder.webp` — club page hero
- `favicon.ico` — site favicon
- `map-rm4080-optimized.webp` — Warwick campus Room 4080 map (optimized)
- `map-rm4080-original.png` — Warwick campus Room 4080 map (original)

## Map Images

Campus map images follow this optimization process:

```bash
convert map-{campus}-{room}-original.png -quality 85 -strip -resize 1200x800 map-{campus}-{room}-optimized.webp
```

- **Format**: WebP for better compression
- **Quality**: 85% for optimal size/quality balance
- **Size**: 1200x800px maximum
- **Metadata**: Stripped to reduce file size
