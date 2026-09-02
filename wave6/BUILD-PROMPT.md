# Sunday Drive wave 6 — Grok Build (draft PR only)

Repo: `andrewkittridge/sunday-drive` · Base: `main` @ `44e64d5`  
Branch: `wave/6-soft-leftovers`  
Bar: `wave6/VISUAL-BAR.md` + moods `mood-sky-depth.png`, `mood-headlight-cookie.png`, `mood-deer-read.png`, `mood-phone-sheet.png`  
Product: `wave6/product-notes.md` (ship-now = same four, same order)  
Live: https://sunday-drive-ten.vercel.app

## Thesis
Finish soft leftovers from w4/w5. Atmosphere / cabin / road feel. Melvor / A Short Hike quiet. No new systems.

## One draft PR — build order
1. **Sky depth** — Leave two-color dome. Multi-stop air (warm horizon → mid amber/peach → cooler high) + volume clouds with underside wrap. Soft horizon melt (not hot white fog wall). 2–4 cloud masses. Less motion still cuts drift.
2. **Headlight cookie** — Dusk/night soft elliptical light pool on asphalt in front of wagon (cookie falloff), not just emissive lamps + flat plane tint. Contact shadow held. No bloom soup, no stadium flood, no FOV pump.
3. **Deer silhouette read** — Body + legs + neck (± antlers) read deer in ≤1s at shoulder (`|x| ≥ 6.7`). Quiet gift only; long cooldown; max one; no EVENT/banner/timer. Clip-safe beside fence/grass, never through asphalt.
4. **Short-phone sheet vs Drive** — Open "The car" sheet stays below horizon + wagon silhouette. Drive planted in thumb zone (≥48px), fully visible while sheet open — no shared bottom collision. Prefer shorter max height + internal scroll. Collapsed default stands. Landscape not broken.

## Hold / hard no
Clip-safe, mute (M + Sound), Less motion, Larger type, audio beds. No FOMO/EVENT chrome, no new destinations, no cabin interior scene / passengers, no prop salad, no bloom soup, **no merge/deploy**.

## Evidence
`wave6/evidence/before/` and `after/`: desktop-day, desktop-night (headlight), deer-shoulder (or force deer), phone-sheet-open (short + Drive visible), optional mobile.  
Write `wave6/RESULT.md`. `npm run build` must pass.

## Deliver
Draft PR titled like “Wave 6: sky depth, headlight cookie, deer read, phone sheet”. Do not merge. Do not deploy. Do not force-push main.
