# Sunday Drive — wave 7 mobile visual bar

Owner: Designer · Audience: Engineer · Status: **draft only**  
Base: live @ `8c12073` (wave 6) · https://sunday-drive-ten.vercel.app  
Product lock: `product-notes.md` (ship-now 1–5; cookie/deer deferred)  
Moods: `mood-phone-390.png`, `mood-phone-short.png`, `mood-phone-landscape.png`  
Viewports: **390×844** · short **~667** · **landscape**

---

## Thesis

Atmosphere is still the drive — on a phone that means **thumb-first calm**. Wave 6 planted Drive and shortened The car at ~390×844. Wave 7 hardens safe areas, short phones, landscape, type, and calm perf if hitchy. Not a desktop atmosphere pass squeezed narrow. Melvor quiet. No FOMO.

Moods are **layout feel only** — keep live chrome/copy/economy; ignore invented Garage/Map/Shop tabs, badges, and coastal extras.

---

## 1. Safe-area + home-indicator hardening

Mood: `mood-phone-390.png`

- Drive + primary chrome clear of notch / Dynamic Island / home indicator via `env(safe-area-inset-*)`.
- Miles + Drive never sit under the system bar; canvas/HUD padding honest on notched phones.
- Hit targets ≥48px still stand (wave 3/6).

## 2. Short-phone sheet vs canvas (~667)

Mood: `mood-phone-short.png`

- Prove open **The car** at ~667 (and below) still leaves **wagon/horizon + full Drive**.
- Shorter max-height / harder internal scroll if 390×844 rules still crowd short phones.
- Hide stays in sheet header (w6). Collapsed default stands.
- No second bar stacking on Drive.

## 3. Landscape thumb path

Mood: `mood-phone-landscape.png`

- Two-column stays calm: **Drive reachable** in thumb zone; upgrades don’t cover the road corridor or wagon.
- Portrait remains the hero layout; landscape must not break stack or eat the postcard.
- Safe-area insets apply in landscape too (left/right notches).

## 4. Mobile type hierarchy

- Read order: **destination → miles → Drive → upgrades**.
- Larger type step still works on phone without wrapping Drive or crowding the postcard.
- Aging-gamer first; cream-on-walnut contrast held. No new settings labyrinth.

## 5. Calm mobile perf (only if hitchy)

- Cap pixel ratio / shadow cost if phone stills or play hitch.
- Prefer fog + materials over post stacks.
- **Skip if ~60 already holds** — don’t burn the PR on micro-opts.

---

## Preferred build order (one draft PR)

1. Safe-area + home-indicator  
2. Short-phone sheet (~667)  
3. Landscape thumb path  
4. Mobile type hierarchy  
5. Calm perf only if needed  

Evidence under `wave7-mobile/evidence/before|after/`:
- `phone-390-sheet.png` (390×844, sheet open, safe areas)
- `phone-short-667.png` (~667, sheet open, Drive + horizon)
- `phone-landscape.png` (landscape, Drive reachable)
- Optional: Larger type on 390; hitch note if perf touched

---

## Hard no

- Ranking cookie/deer as ship-now “for mobile”
- New destinations, FOMO, EVENT chrome, idle rewrite
- Desktop-only atmosphere rewrite as primary deliverable
- Bloom soup, FOV pump, arcade shake
- Breaking clip-safe / mute / Less motion / Larger type / audio
- Merge / deploy without Andrew yes

---

## Handoff

Engineer: one draft PR against this bar + Product list. Evidence on the three viewports.  
Designer eye-checks. Draft only — Designer does not ask merge.
