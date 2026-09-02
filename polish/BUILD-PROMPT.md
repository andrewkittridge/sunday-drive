# Sunday Drive — AAA indie polish (draft PR)

Depends on: landscape clip branch `fix/landscape-road-clip` (PR #1) — **base this work on that branch**.

Draft only. No merge to main. No production deploy. No force-push main.

## Visual bar (authoritative)
- `polish/VISUAL-BAR.md`
- Moods: `polish/mood-light.png`, `mood-car-road.png`, `mood-hud.png`
- Before: `polish/evidence/before-road-idle.png`, `before-live-overview.png`

Thesis: quiet golden-hour postcard you leave running. Cozy idle — polish ≠ clutter/FOMO. Mute sacred. Keep live upgrade names.

## Safe/Feel order
1. Atmosphere — fog depth, dusk, restrained bloom/none, horizon, soft contact shadows, headlights kiss asphalt
2. Road/car fidelity — lovable wagon silhouette/materials; clean asphalt; clip fix stays intact
3. Roadside postcard — sparse 1–3 heroes; destination readable in 2s
4. HUD calm — aging-gamer readable, quiet motion; no shouty UI
5. Camera — smooth follow, no nausea / FOV pump
6. Audio presence — procedural OK; mute (M + button) authoritative
7. Perf — aim stable ~60 on mid laptop; no heavy post if it tanks FPS

## Deliver
1. Branch from `fix/landscape-road-clip` → e.g. `polish/aaa-indie`
2. Implement the wave (smallest coherent pass, not a rewrite)
3. After screenshots under `polish/evidence/after/`
4. `npm run build` OK
5. Draft PR (prefer base `fix/landscape-road-clip` if stacked, or note stacks on #1)
6. `polish/RESULT.md` with PR URL, what landed per layer, unfinished

Hard no: merge, deploy, FOMO timers, loot noise, bloom soup, predicted-path clutter.
