# Landscape / road clipping fix

Draft PR only. Not merged. Not deployed to production.

## PR

https://github.com/andrewkittridge/sunday-drive/pull/1 (draft)

## Root cause

Two placement bugs, plus a bit of depth fighting at the horizon — not a renderer rewrite.

1. **Hills were spheres that crossed the asphalt.**  
   `addHill` in `src/scene.js` sat flattened ellipsoids at `|x|` as small as 18 with radii 20–32 and `scale.x` up to 2.15 (desert). The inner edge of several hills went through `x = 0`, so the meshes punched through the road and met in a V at the vanishing point.

2. **Roadside props were planted on the pavement.**  
   The road plane is 8.4 wide (`|x| ≤ 4.2`); dirt shoulders end around `|x| = 6.1`. Fence posts were at `±4.55`, mailboxes at `±5.05`, lamps at `±5.4` — on or inside the paved strip. Tufts, signs, reeds, and dunes were similarly too close.

3. **Shallow road height + a 0.1 camera near plane.**  
   Grass at `y = 0`, shoulder at `0.02`, road at `0.03`, camera `near = 0.1` / `far = 420`. At ~100+ units the depth buffer cannot tell those planes apart, so grass/hills flicker through the asphalt in the distance.

## What changed

Smallest layout/depth tweaks in `src/scene.js` and `src/route.js`. No gameplay, audio, or destination rewrite.

- Seat each hill so its ellipsoid inner edge stays outside a corridor of `|x| ≥ 12` after the destination `hillScale` is applied.
- Push hill spawn `x` farther from the lane so the clamp is not doing all the work.
- Clamp roadside props to `|x| ≥ 6.7` (just past the shoulder); dunes get a wider berth.
- Raise the road to `y = 0.08` and the shoulder to `0.04`, add `polygonOffset` on both, and set camera `near` to `0.6`.
- Lift the car blob-shadow so it still sits on the raised road.

## Evidence

Before (hills meet over the road; fence post on asphalt):

- `docs/clip-fix/before/scene-county.png`
- `docs/clip-fix/before/scene-mountain.png`
- `docs/clip-fix/before/scene-desert.png`
- `docs/clip-fix/before/scene-pond.png`
- `docs/clip-fix/before/scene-coast.png`
- `docs/clip-fix/before/scene-harvest.png`
- `docs/clip-fix/before/road-idle.png`
- `docs/clip-fix/before/live-overview.png` (production, welcome modal)

After (road stays a clear ribbon; props on the grass):

- `docs/clip-fix/after/scene-county.png`
- `docs/clip-fix/after/scene-mountain.png`
- `docs/clip-fix/after/scene-desert.png`
- `docs/clip-fix/after/scene-pond.png`
- `docs/clip-fix/after/scene-coast.png`
- `docs/clip-fix/after/scene-harvest.png`
- `docs/clip-fix/after/hud-county.png`
- `docs/clip-fix/after/hud-mountain-after-drive.png` (recycled scenery still clear)

`npm run build` succeeded after the change.

## Out of scope

- Merge to `main`
- Production deploy
- Car mesh / mixtape / destination content
