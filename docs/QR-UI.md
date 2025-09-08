# Footer QR UI

## Purpose

Provide a built-in generator for page-specific QR codes with minimal friction and no external services.

## Behavior

- Defaults to the current page URL (hash route included)
- Live preview rendered to `<canvas>` via `qrcode.min.js`
- Error handling: shows an encoder error line if creation fails

## Controls

- Error Correction Level (ECL): `L → M → Q → H` via − / + buttons
- Version/size readout: `QR Version N (WxW)` displayed above preview
- Length line: shown next to the URL helper copy
- Download PNG: exports a larger raster (default 512px width) using the current ECL

## Implementation Notes

- Renderer and controls live in `updateFooterQr()` within `index.html`
- Uses `QRCode.create()` to compute version for the info line, then `QRCode.toCanvas()` to draw
- Export path renders to a temporary canvas and triggers an `<a download>` click

## UX Layout Guidelines

- Information order: URL input → helper/length → settings (ECL + version) → preview → action
- Keep the panel compact (≈500px max) with comfortable spacing
- Hide copy-to-clipboard; rely on user’s manual copy if needed
