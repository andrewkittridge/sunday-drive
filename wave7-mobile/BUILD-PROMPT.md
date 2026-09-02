# Sunday Drive wave 7 mobile — Grok Build (draft PR only)

Repo: `andrewkittridge/sunday-drive` · Base: `main` @ `8c12073`  
Branch: `wave/7-mobile`  
Bar: `wave7-mobile/VISUAL-BAR.md` + moods `mood-phone-390.png`, `mood-phone-short.png`, `mood-phone-landscape.png`  
Product: `wave7-mobile/product-notes.md`  
Live: https://sunday-drive-ten.vercel.app

## Thesis
Thumb-first calm on phone. Not desktop atmosphere squeezed narrow. Cookie/deer deferred.

## One draft PR — build order
1. **Safe-area + home-indicator** — Drive/miles/chrome clear of notch + home indicator via `env(safe-area-inset-*)`. ≥48px targets.
2. **Short-phone sheet (~667)** — Open The car leaves wagon/horizon + full Drive; shorter max / harder scroll if needed; Hide in header; collapsed default.
3. **Landscape thumb path** — Two-column calm; Drive reachable; upgrades don’t cover road; safe-area L/R.
4. **Mobile type hierarchy** — destination → miles → Drive → upgrades; Larger type doesn’t wrap Drive or crowd postcard.
5. **Calm mobile perf** — only if hitchy (cap DPR/shadows); skip if ~60 holds.

## Hold / hard no
Clip-safe, mute, Less motion, Larger type, audio. No FOMO, no new destinations, no cookie/deer as ship-now, no bloom soup, **no merge/deploy**.

## Evidence
`wave7-mobile/evidence/before|after/`: phone-390-sheet, phone-short-667, phone-landscape. Optional Larger-type 390.  
Write `wave7-mobile/RESULT.md`. `npm run build` must pass.

## Deliver
Draft PR titled like “Wave 7: mobile safe-area, short sheet, landscape, type”. Do not merge or deploy.
