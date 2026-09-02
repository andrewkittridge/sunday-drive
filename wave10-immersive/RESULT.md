# Sunday Drive — wave 10 immersive cozy

Draft PR only. Not merged. Not deployed to production.

## PR

Pending — draft against `main` @ `629db6e` (wave 9). Head: `wave/10-immersive`.

## Thesis

Atmosphere is the drive. Push maps + materials + light as far as Three.js/WebGL will go while staying Melvor / A Short Hike quiet. Immersive cozy, not arcade. Hold w7–9 UI. No FOMO.

## What landed

### 1. Road + world depth
Cooler asphalt with a clearer center dash and white edge hold. Soft elliptical contact shadow under the wagon. Fog near/far pulled so the wagon stays hero and the hill corridor melts into peach air instead of a hot white wall. Far ridges sit behind the near hills (clip-safe `|x| ≥ 12`) so the postcard has layered depth. Sparse roadside (fence, tufts, one barn hero) grounds the frame — never through asphalt.

### 2. Headlight cookie
Dusk/night puts a soft **elliptical cream-gold pool ahead of the bumper** on the road plane. Cookie falloff from a dual-lamp core + long wash; spots and the bumper fill are quieter so it is road light, not side wash or a stadium flood. Contact shadow held. **No bloom soup, no FOV pump.** Camera stays FOV 50.

### 3. Deer 1s read
Quiet gift at the shoulder (`|x| = 7.55 ≥ 6.7`): thicker jointed legs, a readable neck, doe ears, cream rump/tail contrast. 3/4 rear beside the fence on grass — never through asphalt; walk still clamps `|x| ≥ 7.2` and heads away from the road. No banner, timer, tap, or EVENT chrome. Long cooldown; max one moment. Capture: `?event=deer`.

### 4. Wagon + landmark materials
Cream body vs warmer wood grain vs cooler glass vs chrome. Wood/cream/glass contrast under warm light. County barn reads in ~2s from red + cream door + loft + wood roof; windmill stays in the same landmark group. The far copy is smaller/further so it does not fight the wagon. Low-poly; light and materials, not mesh count.

### 5. Sky volume hold
Cooler high occupies more of the postcard; horizon melt is a quieter peach, not a fire wall. Four cloud masses, flattened, with stronger underside wrap (peach/amber by day, moonlight at night). **Less motion** still cuts drift. No aurora, no storm wall.

## Hold / hard no

Held: hill corridor `|x| ≥ 12`, roadside clamp `|x| ≥ 6.7`, road `y = 0.08` + `polygonOffset`, camera `near = 0.6`, FOV 50. Mute is still **M** + Sound on/off. Larger type, Less motion, and audio beds untouched. w7–9 UI (Menu, Drive primary, tall shopping sheet) unchanged. Idle economy and destinations unchanged. No FOMO. Mood coastal extras / roof cargo / invented cabins ignored.

## Evidence

Before: `wave10-immersive/evidence/before/`  
After: `wave10-immersive/evidence/after/`

- `desktop-day.png` — road depth, wagon/landmark materials, cooler high + warm melt, volume-cloud wrap
- `desktop-night.png` — cookie ahead of bumper, contact shadow, slate clouds
- `deer-shoulder.png` — deer at the shoulder, legs/neck/cream-rump, clip-safe
- `phone-390-world.png` — immersive world holds; Menu / Drive / The car chrome unchanged

Captures: `?capture=1&hud=0&shot=county&phase=0.47` (day), `phase=0.72` (night), `?event=deer`; phone `390×844` with HUD.

Bar: `wave10-immersive/VISUAL-BAR.md` + `mood-road-depth.png` / `mood-headlight-cookie.png` / `mood-deer-read.png` / `mood-materials.png` / `mood-phone-immersive.png`.

`npm run build` succeeded (exit 0).

## Unfinished

- Clouds are still stylized puff clusters, not simulated volume.
- Cookie is a falloff mesh on the road plane, not a projected gobo in the lamps.
- Deer is a readable low-poly silhouette (doe), not a sculpted animal.
- Designer eye-check vs `wave10-immersive/mood-*.png` is still pending.

## Out of scope

- Merge to `main`
- Production deploy
- Force-push
- FOMO timers, new destinations, idle rewrite / save-schema
- Sparse night stars / milky whisper / 3D postcard snaps (ship next)
- Soft w8 wordmark / Hide nits, soft w9 real-device fling
