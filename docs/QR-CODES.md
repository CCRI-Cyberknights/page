# QR Codes Registry

Data lives in `qr-codes/qr-codes.yaml`. The site loads it at runtime and renders cards at `?page=listofqrcodes`.

## YAML format

```
items:
  - id: 4wd4vt2k            # TinyURL slug and SVG filename (no extension)
    label: Linux Guide       # Human-readable label
    route_url: https://<pages-url>/?page=linux
    tiny_url: https://tinyurl.com/4wd4vt2k
    svg_path: qr-codes/4wd4vt2k.svg
    notes: Optional notes
```

## Workflow

1. Create the TinyURL for the target route
2. Generate the SVG QR code named `<slug>.svg` and place under `qr-codes/`
3. Add a new entry to `qr-codes/qr-codes.yaml`
4. Commit and push; verify at `?page=listofqrcodes`
