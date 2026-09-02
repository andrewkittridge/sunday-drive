# Sunday Drive wave 5 — Grok Build (draft PR only)

Repo: `andrewkittridge/sunday-drive` · Base: `main` @ `94c58a0`  
Branch: `wave/5-atmosphere`  
Bar: `/workspace/sunday-drive/wave5/VISUAL-BAR.md` + moods `mood-aura-day.png`, `mood-aura-night.png`, `mood-cabin.png`  
Live feel target: https://sunday-drive-ten.vercel.app

## Thesis
Atmosphere is the drive. Deepen light, fog, sky, cabin calm. Cozy aura / Melvor / A Short Hike quiet. Not more systems.

## One draft PR — build order
1. **Sky + light** — golden-hour default hero warmer key/softer hemi; dusk paints fog + cloud undersides; night indigo dome, quiet moon, sparse stars. Volume clouds stay; tune wrap-light (peach/amber day, moonlight slate night). 2–4 masses. Less motion still cuts drift.
2. **Fog depth** — near clear (wagon hero), far soft (hills melt). Theme-tint destination fog gently. Mist accents whisper; never hide road or clip-safe props.
3. **Road + wagon light** — soft dusk/night headlight kiss on asphalt (not stadium); soft contact shadow; warm wood/cream/glass from wave 4. One soft bloom or none — **no bloom soup**, no FOV pump, no shake.
4. **Cabin calm** — subtle glass tint / soft interior fill only. Optional tiny dust motes in headlight cones (Less motion kills). No passengers, dogs, lanterns, new UI. HUD stays quiet cream-on-walnut.

## Hold / hard no
Clip-fix, mute (M + Sound), Less motion, Larger type, audio beds. No FOMO/EVENT chrome, no new destinations, no idle rewrite, no prop salad, no merge/deploy.

## Evidence
`wave5/evidence/before/` and `after/`: desktop-day, desktop-night, materials-close, optional mobile idle.  
Write `wave5/RESULT.md`. `npm run build` must pass.

## Deliver
Draft PR only titled like “Wave 5: atmosphere — sky, fog, light, cabin calm”. Do not merge. Do not deploy. Do not force-push main.
