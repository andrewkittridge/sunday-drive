# Sunday Drive. Wave 11 volume

Draft only. Not merged. Not deployed to production.

## PR

See the pull request opened with this branch. Base: `main` @ `3b494c4` (wave 10 Air). Head: `wave/11-volume`.

## Thesis

The postcard is a painted volume, not a toy diorama. Wave 10 made Air one sample. Wave 11 makes the shapes agree with that sample.

## What landed

### 1. Terrain melt
Hills are displaced land ribbons with an inner edge at `DECK.landInner` (24), not scaled `SphereGeometry`. A melt shader mixes crown and far depth into `air.fogColor`. Night dims `uColor`. Clip-safe `hillInner` 12 still holds for props.

### 2. Volume clouds
Four masses. Each is three noise-alpha sheets, not 11 puff spheres. The puff shader is gone. Fog still recedes them with `abs(world.z)`.

### 3. Road light
Asphalt reads gray-brown. Thinner center dash and edge hold. A quiet sun streak lives in the map. Specular follows Air.

### 4. Wagon silhouette
Lower cabin, sloped rear, wood tailgate as the rear hero, 18-segment wheels. Still low-poly. Light and silhouette, not mesh count.

### 5. Deer
Spawn scale 1.06 at `x = ±8.2`, `z = -7.2`. Fence-high. Cream rump. Reads as a deer in one second. Clip-safe.

### 6. Sky and night disc
Sun and moon cores are smaller. Glow is a radial sprite, not a gray sphere. Stars are smaller and denser. Vignette still follows `--air-night`.

### 7. HUD hold
Wave 8 hierarchy. Destination, miles, Drive, The car, Menu. Phone keeps Drive in the thumb zone. Paper chrome is slightly quieter.

## Hold / hard no

Held: hill inner `|x| >= 12`, roadside `|x| >= 6.7`, road `y = 0.08` plus `polygonOffset -2`, camera `near = 0.6`, FOV 50, one `renderer.render`, ten destinations. Mute is still M. Less motion still cuts juice, not Air. Public surface is still `createWorld` / `applyRoute` / `update` / `render` / `getLook` / `setPhase` / `setTime` / `forceEvent`. Air, DECK, and `cycleAt` are not exported.

## Evidence

Before: `wave11-volume/evidence/before/` (wave 10 Air after stills)
After: `wave11-volume/evidence/after/`

- `desktop-day.png`. `?capture=1&hud=0&shot=county&phase=0.47`
- `desktop-night.png`. `?phase=0.72`
- `desktop-1280.png`. HUD on, 1280×800
- `deer-shoulder.png`. `?event=deer`
- `phone-390.png`. 390×844

Rerun: `node wave11-volume/capture.mjs` (starts Vite on 5174 so it does not attach to an old 5173).

`npm run build` exits 0.

## Verdict

VERIFIED against the visual bar on the five stills. Hills melt. Clouds are air. The deer is a deer. The moon is a disc. HUD hierarchy holds. The wagon is a clearer woodie from behind and still a box stack in the details.

## Unfinished

- Clouds are noise sheets, not a volume sim.
- Wagon cabin is still faceted boxes with a lower roof.
- Landmarks stay primitive heroes on the grass belt.

## Out of scope

- Merge to `main`
- Production deploy
- Force-push
- EffectComposer bloom soup, FOV pump, new destinations, HUD redesign
