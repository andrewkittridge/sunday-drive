# Sunday Drive — wave 7 mobile

Draft PR only. Not merged. Not deployed to production.

## PR

https://github.com/andrewkittridge/sunday-drive/pull/9 (draft)  
PR #8 landed the first pass and was merged to `main`. This follow-up is remaining bar nits (collapsed chrome, Larger type sheet, landscape destination).

Base: `main` (wave 6 + PR 8). Head: `wave/7-mobile`.

## Thesis

Thumb-first calm on phone. Not desktop atmosphere squeezed narrow. Cookie/deer deferred.

## What landed

### 1. Safe-area + home-indicator
HUD, toast, and modal pad with `env(safe-area-inset-*)` tokens. Canvas stays full-bleed (sky under the notch); chrome does not. Portrait adds extra above the home indicator (`safe-bottom + 0.75rem`) so **Drive** and miles never sit under the system bar. Layout uses `100dvh`. Hit targets stay ≥48px (Drive, Hide, Sound, Larger type, Less motion). Capture: `?panel=1` at 390×844 with island + home-indicator overlays and simulated inset tokens.

### 2. Short-phone sheet (~667)
Open **The car** at ~667 is a shorter sheet (`max-height: min(14vh, 5.85rem)`), upgrade blurbs tuck away, and Hide stays in the sheet header. Wagon roof, tailgate, and horizon stay in view with a full Drive (`min-height: max(48px, 3.15rem)`). No second bar on Drive. Collapsed default stands. Portrait collapsed HUD drops the trip line and “Tap Drive” hint so more wagon shows; miles + rate + Drive stay. Capture: `?panel=1` at 390×667.

### 3. Landscape thumb path
Two-column calm. The right column is capped (`min(15rem, 30vw)`) so upgrades do not cover the road corridor or wagon. **Drive** sits in the right thumb zone under the sheet. Miles sit bottom-left, clear of the long-edge notch. Destination is the display line (larger than the wordmark) with room in the brand column. Portrait stays the hero layout. Disabled prestige tucks away so the panel is upgrades + Drive. Capture: landscape 844×390.

### 4. Mobile type hierarchy
Read order is **destination → miles → Drive → upgrades**. On phone, destination is the display line (full width, one line); “Sunday Drive” is a smaller nowrap wordmark. Comfort buttons wrap in two rows instead of a tall right stack. **Larger type** still steps up without wrapping Drive or crowding the postcard (upgrade blurbs hide when Larger type + sheet are both on; miles / Drive capped on short and landscape). Cream-on-walnut held. Capture: `?panel=1&large=1` at 390×844.

### 5. Calm mobile perf
Skipped. Headless capture is not a phone GPU; existing `setPixelRatio` cap of 2 stands. No shadow or post-stack changes.

## Clip-fix / cozy invariants

Held: hill corridor `|x| ≥ 12`, roadside clamp `|x| ≥ 6.7`, road `y = 0.08` + `polygonOffset`, camera `near = 0.6`, FOV 50. Mute is still **M** + Sound on/off. Larger type, Less motion, and audio beds untouched. Idle economy and destinations unchanged. Cookie/deer not touched.

## Evidence

Before: `wave7-mobile/evidence/before/`  
After: `wave7-mobile/evidence/after/`

- `phone-390-sheet.png` — 390×844, sheet open, island + home indicator, Drive planted, destination-first
- `phone-short-667.png` — ~667, sheet open, wagon/horizon + full Drive, Hide in header
- `phone-landscape.png` — landscape, Drive in the right thumb zone, wagon/road clear, destination larger than the wordmark
- `phone-390-large-type.png` — optional Larger type on 390; Drive still one line; upgrade blurbs tucked
- `phone-390-collapsed.png` — extra; collapsed default, miles + Drive, no trip/hint chrome on the wagon

Bar: `wave7-mobile/VISUAL-BAR.md` + `mood-phone-390.png` / `mood-phone-short.png` / `mood-phone-landscape.png`.

`npm run build` succeeded after the pass.

Verified in Playwright (iPhone-sized viewports, simulated safe-area tokens): Drive click, The car open/hide, Sound on/off, Less motion, Larger type. All primary targets ≥48px. Drive / destination / wordmark do not wrap. Desktop 1440×900 still shows trip, hint, and the side panel.

## Unfinished

- Designer eye-check vs `wave7-mobile/mood-*.png` is still pending (moods are layout feel only; live chrome/copy kept).
- Safe-area evidence uses CSS inset tokens plus a capture overlay; real devices still need a glance on a notched phone.
- Comfort buttons still take two rows on portrait — held at ≥48px rather than shrinking.

## Out of scope

- Merge to `main`
- Production deploy
- Force-push
- Cookie/deer as ship-now
- FOMO timers, new destinations, idle rewrite
- PWA / add-to-home
- Boot → first Drive coach copy
