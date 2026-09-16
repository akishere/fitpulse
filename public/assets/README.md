# FitPulse Brand Assets

Selected concept: **#2 — FP Monogram**

## Colors
- Charcoal: `#111318`
- FitPulse Green: `#18B87A`
- Optional neutral background: `#F5F7FA`

## Usage

The app serves everything from `/assets/…`. Wire via the `Logo` component:

```tsx
import { Logo } from "@/components/layout/logo";

<Logo />              // monogram + "FitPulse" wordmark, size md
<Logo variant="icon" size="lg" />
```

Or use a raw file directly:

```tsx
<Image src="/assets/fitpulse-fp-monogram.svg" alt="FitPulse" width={35} height={36} />
```

For favicon (already declared in `src/app/layout.tsx`):

```html
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg" />
```

SVG is the preferred source — scales cleanly on web and retina.

## Included

**Monogram (primary mark)**
- `fitpulse-fp-monogram.svg` — dark on transparent, viewBox 1000×1040
- `fitpulse-fp-monogram-white.svg` — light on transparent (dark backgrounds)
- `fitpulse-fp-monogram-{512,1024,2048}.png` — raster fallbacks
- `fitpulse-fp-monogram-white-1024.png`

**Favicons + app icons**
- `favicon.svg`, `favicon.ico`
- `icon-{16,32,48,64,128,180,192,256,512}.png`
- `apple-touch-icon.png` (180×180)

The `Logo` component composes the monogram with a text wordmark rather than
shipping a separate horizontal lockup — this keeps the wordmark crisp at any
size and lets us tweak type without regenerating assets.
