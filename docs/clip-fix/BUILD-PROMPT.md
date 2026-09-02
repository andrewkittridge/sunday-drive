# Sunday Drive — landscape / road clipping fix (draft PR)

Repo: andrewkittridge/sunday-drive. Working copy: this directory (synced with origin/main).

## Bug
Landscapes (landmarks, roadside props, grass/horizon) overlap / clip through the road. Looks broken on live https://sunday-drive-ten.vercel.app.

## Likely cause (verify, don't assume)
z-fighting or wrong Y / depth / layering of props vs road mesh in `src/scene.js` and `src/route.js` (destination palettes / landmarks / roadside).

## Do
1. Capture BEFORE screenshots (road + landmark + roadside) under `docs/clip-fix/before/`.
2. Fix so scenery sits beside/behind the road correctly — no clipping through the asphalt. Prefer smallest change: positions, renderOrder, polygonOffset, ground Y, prop placement offsets — not a rewrite.
3. Capture AFTER screenshots under `docs/clip-fix/after/`.
4. `npm run build` must succeed.
5. Branch off main (e.g. `fix/landscape-road-clip`), commit, push, open **draft** PR.
6. Write `docs/clip-fix/RESULT.md`: PR URL, root cause found, what changed, evidence paths.

## Hard no
- Merge to main
- Production deploy
- Force-push main
- Unrelated refactors / feature work

Draft only until Andrew says yes.
