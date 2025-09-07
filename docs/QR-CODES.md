# QR Codes (per‑page, dynamic)

The site generates QR codes dynamically in the footer for each page. There is no YAML registry, no SVGs checked in, and no build step. Everything runs locally in the browser.

## How it works

- Offline encoder (vendored) at `qrcode.min.js` renders to a `<canvas>`.
- The input box lets you change the encoded text; by default it uses the current page URL (including `?page=...`).
- Actions:
  - Download PNG: exports at higher resolution using the current settings
  - ECL Correction Level: controls to adjust error correction (L → M → Q → H)
- Info line shows the detected QR version and module size, plus the encoded length.

## Tips

- If a text is too long for the chosen ECL, lower the ECL to fit more data or shorten the text.
- Use shorter URLs (or URL shorteners) when you need higher correction levels.

## Linking directly to pages

Append a query param:

- `?page=home`
- `?page=cybersecurity`
- `?page=linux`
- `?page=calendar`
