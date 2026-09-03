# Sunday Drive. Wave 10 Air

Draft only. Not merged. Not deployed to production.

## PR

None. Branch `wave/10-cozy-air` off `main` @ `958547a`. Do not open a PR from this pass.

## Thesis

The postcard is one Air. Glow is the hue. The disc is the direction. Linear fog is the envelope.

## What landed

### 1. Air
`src/scene.js` samples `Air` in `scoreAir` and writes lights, fog, sky, clouds, grass, lamps, and exposure only in `paintAir`. Fog color is palette fog mixed toward glow by `DECK.meltAgree` (0.58). Fog near is about 34. Key follows the visible disc with `y = max(5.2, y)` and no `night > 0.55` cliff. Fill intensity falls at night. `hemi.groundColor` lerps. `theme.grass` tints the plane (about 55% toward white, then night-dim). Cookie color follows `sunDusk`. Zenith dusk stays `* 0.18`. `airFalloff` is unchanged.

### 2. Clouds
The puff shader mixes color and alpha by road depth `abs(world.z)` using `uFogColor`, `uFogNear`, and `uFogFar`. Four `CLOUD_LANES` sit on distinct Z. Far masses are smaller. `tickClouds` recycles Z like hills. Less motion still only cuts X drift.

### 3. Deck
`car.position.y = DECK.restY + bob`. Cookie is a scene child, flattened every frame, following car xz at width 8.6. Kiss distance is 11, decay 1.6. Contact blob sits just above the road.

### 4. Hero
`populateScenery` plants one landmark at `HERO_SLOT` `(-18, 0, -48)`. `createLandmark('barns')` is barn plus silo in one group. `extras === 'pines'` no longer plants rocks. Windmill `userData.blades` spin unless Less motion. Leaves hide when `air.night > 0.45`. Landmark lamps scale with `air.emissive`.

### 5. Veil
`getLook()` includes `night`. `syncHud` sets `--air-night`. `.vignette` strength follows it. Grain stays 0.04. No `--horizon` on `--paper`.

## Clip-fix / cozy invariants

Held: hill inner `|x| ≥ 12`, roadside `|x| ≥ 6.7`, road `y = 0.08` plus `polygonOffset -2`, camera `near = 0.6`, FOV 50, one `renderer.render`, ten destinations. Mute is still M. Less motion still does not freeze Air. Public surface is still `createWorld` / `applyRoute` / `update` / `render` / `getLook` / `setPhase` / `setTime` / `forceEvent`. `cycleAt`, Air, and DECK are not exported.

## Evidence

Before: `wave10-air/evidence/before/` (wave 6 day/night/deer, wave 8 desktop-1280 and phone-390)
After: `wave10-air/evidence/after/`

- `desktop-day.png`. `?capture=1&hud=0&shot=county&phase=0.47`
- `desktop-night.png`. `?capture=1&hud=0&shot=county&phase=0.72`
- `desktop-1280.png`. HUD on, 1280×800
- `deer-shoulder.png`. `?event=deer`
- `phone-390.png`. 390×844

Rerun: `node wave10-air/capture.mjs` (starts local Vite on 5173 if needed, Chromium via CDP, no Playwright project dependency).

`npm run build` exits 0.

## Deviations

CONTRACT DECK wins over sketch cookie 7.4 / kiss 9.0. Live values are cookie width 8.6, kiss 11, cookieY 0.098, kissDecay 1.6.
`DECK.keyReach` is 58 from the sketch. CONTRACT's DECK list omitted it. Score still aims the key from the disc at that reach.
Fog near, fog far, melt, and cloud Z live on `DECK` as CONTRACT listed them. Judge.md wanted those knobs off the clip-fix table. Honored CONTRACT.
Cloud fade uses `abs(world.z)`, not camera distance.
`createLandmark` is now exported from `route.js`. `createWorld` still does not export Air, DECK, or `cycleAt`.

## Unfinished

- Clouds remain puff clusters with a copied envelope, not a volume sim.
- Cookie remains a UV quad, not a gobo.
- Designer eye-check of the after stills is still pending.
- Capture waits on rAF after `__sundayDrive.world`. Swiftshader stills can differ from a real GPU.

## Out of scope

- Merge to `main`
- Production deploy
- Force-push
- EffectComposer, bloom, FOV pump, new destinations, HUD redesign
