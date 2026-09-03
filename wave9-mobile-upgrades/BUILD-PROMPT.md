# Sunday Drive wave 9 mobile upgrades — Grok Build (draft PR only)

Repo: `andrewkittridge/sunday-drive` · Base: `main` @ `958547a`  
Branch: `wave/9-mobile-upgrades`  
Bar: `wave9-mobile-upgrades/VISUAL-BAR.md` + `mood-sheet-390.png`, `mood-sheet-short.png`  
Product: `wave9-mobile-upgrades/product-notes.md`  
Live: https://sunday-drive-ten.vercel.app

## Thesis
When The car is open, **buy wins**. Taller sheet, whole-row buy targets, affordable vs locked contrast, scroll without Drive theft. Hold w7/w8. No FOMO.

## One draft PR — build order
1. Taller open max-height — ≥2–3 upgrade rows at 390×844; ≥2 on ~667. Collapsed default stays short.
2. Whole-row buy targets (≥48px; prefer ~72px+ open); cost gold/obvious; name+meta readable.
3. Affordable vs locked contrast (not opacity-only).
4. Scroll containment + gap before Drive; don’t disable Drive.
5. Hide header-only verify.

## Hold / hard no
w7 safe-area/landscape/type; w8 Menu + Drive primary when closed; clip-safe, mute, Less motion, Larger type, audio. No FOMO, no comfort ghosts, **no merge/deploy**.

## Evidence
`wave9-mobile-upgrades/evidence/before|after/`: phone-390-sheet, phone-short-667; optional locked vs buyable.  
Write `wave9-mobile-upgrades/RESULT.md`. `npm run build` must pass.

## Deliver
Draft PR titled like “Wave 9: mobile upgrade sheet — taller + whole-row buy”. Do not merge or deploy.
