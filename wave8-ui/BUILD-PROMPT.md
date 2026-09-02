# Sunday Drive wave 8 UI — Grok Build (draft PR only)

Repo: `andrewkittridge/sunday-drive` · Base: `main` @ `e79031f`  
Branch: `wave/8-ui-chrome`  
Bar: `wave8-ui/VISUAL-BAR.md` + `mood-ui-desktop.png`, `mood-ui-phone.png`  
Product: `wave8-ui/product-notes.md`  
Live: https://sunday-drive-ten.vercel.app

## Thesis
Postcard owns viewport. Chrome answers: **Drive.** Collapse Sound/Save/Postcards/Larger type/Less motion into one **Menu**. Hold w7 mobile gains. No FOMO.

## One draft PR — build order
1. Collapse five ghosts → one Menu (word + optional hamburger). Mute: **M** + Sound in Menu. A11y reachable in Menu; persist state.
2. Promote hierarchy: destination → miles → Drive → The car (collapsed default).
3. Desktop ~1280/1440: quieter chrome, more canvas.
4. Phone: verify w7 safe-area / short sheet / landscape / type held; no comfort-row re-stack.

## Hold / hard no
Clip-safe, mute, Less motion, Larger type, audio, w7 mobile. No FOMO, no new destinations, no equal-weight salad, **no merge/deploy**.

## Evidence
`wave8-ui/evidence/before|after/`: desktop-1280, desktop-1440, phone-390; optional Menu open.  
Write `wave8-ui/RESULT.md`. `npm run build` must pass.

## Deliver
Draft PR titled like “Wave 8: quieter chrome — Menu + Drive primary”. Do not merge or deploy.
