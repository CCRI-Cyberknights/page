# QR Codes (per‑page, dynamic)

The site generates QR codes dynamically in the footer for each page. There is no YAML registry, no SVGs checked in, and no build step. Everything runs locally in the browser.

## Educational Document QR Integration ⭐ NEW

For educational documents like the Linux cheat sheet, we've implemented a **static QR code system** that embeds base64-encoded QR codes directly into HTML documents. This approach provides:

- **Reliability**: No JavaScript dependencies, works in any browser
- **Performance**: No external requests, instant loading
- **Customization**: Green background QR codes with black modules
- **Self-Contained**: All content in a single HTML file

See `document/README.md` for implementation details and `scripts/README.md` for QR code generation.

## How it works

- Offline encoder (vendored) at `js/qrcode.min.js` renders to a `<canvas>`.
- The input box lets you change the encoded text; by default it uses the current page URL (including `#/...`).
- Actions:
  - Download PNG: exports at higher resolution using the current settings
  - ECL Correction Level: controls to adjust error correction (L → M → Q → H)
- Info line shows the detected QR version and module size, plus the encoded length.
- Implementation uses the shared `QRCodeManager` class from `js/qr-code-manager.js` for consistent functionality across all pages.

## Tips

- If a text is too long for the chosen ECL, lower the ECL to fit more data or shorten the text.
- Use shorter URLs (or URL shorteners) when you need higher correction levels.

## Linking directly to pages

Use hash routes:

- `#/home`
- `#/cybersecurity`
- `#/linux`
- `#/calendar`
