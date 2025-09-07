# QR Codes (Per‑page, dynamic)

The site generates QR codes dynamically in the footer for each page. No YAML, SVG, or build step.

## How it works

- Offline encoder (vendored) at `js/vendor/qrcode.min.js` renders to a `<canvas>`.
- If needed, it falls back to a Google Chart image drawn onto the canvas.
- The input box lets you change the encoded text; defaults to the current page URL.
- Buttons:
  - Copy URL: copies the current text
  - Download PNG: saves a raster image of the QR

## Linking directly to pages

Append a query param:

- `?page=home`
- `?page=cybersecurity`
- `?page=linux`
- `?page=calendar`
