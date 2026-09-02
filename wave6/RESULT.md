# Sunday Drive — wave 6

Draft PR only. Not merged. Not deployed to production.

## PR

https://github.com/andrewkittridge/sunday-drive/pull/7 (draft)  
Base: `main` @ `44e64d5` (wave 5). Head: `wave/6-soft-leftovers`.

## Thesis

Finish the soft leftovers from waves 4 and 5. Atmosphere / cabin / road feel. Melvor / A Short Hike quiet. No new systems.

## What landed

### 1. Sky depth
Left the two-color dome. The sky is multi-stop air: warm horizon → mid amber/peach → cooler high, compressed into the camera’s low band so the postcard actually shows blue over gold. Horizon melt is a soft peach blend into fog, not a hot white wall. Volume clouds stay at four masses with stronger underside wrap (peach/amber by day, moonlight at night). **Less motion** still cuts drift. No aurora, no storm wall.

### 2. Headlight cookie
Dusk/night puts a soft elliptical light pool on the asphalt in front of the wagon — cookie falloff from two lamps, not just emissive bulbs and a flat plane tint. Spots and the bumper fill are quieter so the pool reads as road light, not a stadium flood. Contact shadow under the wagon is held. Wood / cream / glass contrast held. **No bloom soup, no FOV pump.** Camera stays FOV 50.

### 3. Deer silhouette read
Quiet gift at the shoulder (`|x| = 8.4 ≥ 6.7`): longer legs, a real neck, snout, ears, branching antlers, cream rump/tail. Profile beside the fence on grass — never through asphalt; walk still clamps `|x| ≥ 7.2` and heads away from the road. No banner, timer, tap, or EVENT chrome. Long cooldown; max one moment. Capture: `?event=deer`.

### 4. Short-phone sheet vs Drive
Open **The car** is a shorter bottom sheet (`max-height: min(16vh, 7.25rem)`, shorter on short phones) with internal scroll. Disabled prestige tucks away so the sheet stays a title + upgrades. **Hide** sits in the sheet header (48px target) instead of stacking a second bar on Drive. Wagon roof, tailgate, and horizon stay in view. **Drive** is pinned in the thumb zone (`min-height: max(48px, 3.5rem)`), fully visible, no shared bottom collision. Collapsed default and landscape two-column still stand. Capture: `?panel=1` at ~390×844.

## Clip-fix / cozy invariants

Held: hill corridor `|x| ≥ 12`, roadside clamp `|x| ≥ 6.7`, road `y = 0.08` + `polygonOffset`, camera `near = 0.6`. Mute is still **M** + Sound on/off. Larger type, Less motion, and audio beds untouched. Idle economy and destinations unchanged.

## Evidence

Before: `wave6/evidence/before/`  
After: `wave6/evidence/after/`

- `desktop-day.png` — cooler high, peach mid, warm horizon melt, volume-cloud wrap
- `desktop-night.png` — indigo dome, slate clouds, elliptical cookie on asphalt, contact shadow
- `deer-shoulder.png` — deer at the shoulder, profile, clip-safe
- `phone-sheet-open.png` — 390×844, short sheet, Hide in header, Drive planted, wagon/horizon visible

Bar: `wave6/VISUAL-BAR.md` + `mood-sky-depth.png` / `mood-headlight-cookie.png` / `mood-deer-read.png` / `mood-phone-sheet.png`.

`npm run build` succeeded after the pass.

## Unfinished

- Clouds are still stylized puff clusters, not simulated volume.
- Cookie is a falloff mesh on the road plane, not a projected gobo in the lamps.
- Deer is a readable low-poly silhouette, not a sculpted animal.
- Designer eye-check vs `wave6/mood-*.png` is still pending.

## Out of scope

- Merge to `main`
- Production deploy
- Force-push
- FOMO timers, new destinations, idle rewrite
- Sparse night stars / weather accent / 3D postcard snaps (ship next)
