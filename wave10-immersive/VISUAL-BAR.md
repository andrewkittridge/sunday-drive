# Sunday Drive — wave 10 immersive visual bar

Owner: Designer · Audience: Engineer · Status: **locked** (Product ship-now)  
Base: live @ `629db6e` (wave 9) · https://sunday-drive-ten.vercel.app  
Product: `product-notes.md` — immersive cozy, not arcade  
Moods: `mood-road-depth.png` · `mood-headlight-cookie.png` · `mood-deer-read.png` · `mood-materials.png` · `mood-phone-immersive.png`  
Viewports: desktop ~1280/1440 · phone 390 (world only — **hold w7–9 UI**)

---

## Thesis

Atmosphere is the drive. Push **maps + materials + light** as far as Three.js/WebGL will go while staying Melvor / A Short Hike quiet. Immersive cozy = long-glance postcard: road depth, true headlight cookie, deer in 1s, wagon/landmark materials, sky volume held. **Not arcade.** Hold mute, Less motion, Larger type, audio, w7–9 UI. No FOMO. No new destinations as the primary deliverable.

Moods are **feel / light / materials only**. Keep live destinations, wagon silhouette, clip-safe corridor (`|x| ≥ 6.7` / hills `|x| ≥ 12`). Ignore mood coastal extras, invented cabins, suitcases-on-roof, ocean, lighthouse — palette + depth, not prop salad.

---

## 1. Road + world depth (first)

Mood: `mood-road-depth.png` (+ phone `mood-phone-immersive.png`)

- Asphalt read: center dash + edge hold, soft contact shadow under wagon.
- Fog near/far so hills **melt**; wagon stays hero.
- Sparse roadside that grounds the postcard — never through asphalt.
- Biggest immersion lift. Evidence: desktop day + phone world stills.

## 2. Headlight cookie (w6 soft)

Mood: `mood-headlight-cookie.png`

- Dusk/night: soft **elliptical pool ahead of the bumper** on the road plane.
- Cookie falloff — not side wash only, not bloom soup, not stadium flood.
- Contact shadow under wagon held.

## 3. Deer 1s read (w6 soft)

Mood: `mood-deer-read.png`

- Legs / neck / cream-rump contrast — quiet gift reads **deer in ≤1s**.
- Shoulder only (`|x| ≥ 6.7`). No EVENT chrome, banner, timer, tap.
- Drive never blocked. Long cooldown; max one moment.

## 4. Wagon + landmark materials

Mood: `mood-materials.png`

- Wood / cream / glass contrast on the wagon under warm light.
- Destination landmark readable in **~2s** from palette + one hero silhouette.
- Low-poly OK — **light and materials beat mesh count**. No second landmark fighting the wagon.

## 5. Sky volume hold

Mood: `mood-road-depth.png` / night cookie still

- Keep cooler high + warm melt from w6.
- Tighten cloud underside wrap if stills still read flat.
- 2–4 cloud masses. No aurora / storm wall. Less motion still cuts drift.

---

## Preferred build order (one draft PR)

1. Road + world depth  
2. Headlight cookie  
3. Deer 1s read  
4. Wagon + landmark materials  
5. Sky volume hold  

Evidence: `wave10-immersive/evidence/before|after/`
- `desktop-day.png` — road depth + materials + sky  
- `desktop-night.png` — cookie ahead of bumper  
- `deer-shoulder.png` — `?event=deer` or equivalent  
- `phone-390-world.png` — immersive holds; UI chrome unchanged  

---

## Hard no

- Arcade shake, FOV pump, bloom soup, loot/FOMO chrome  
- New destinations / idle rewrite / save-schema for “immersion”  
- Undoing w7–9 UI (comfort ghosts, short starving sheet)  
- Prop salad / second landmark fighting the wagon  
- Breaking clip-safe, mute, Less motion, Larger type, audio  
- Grok Build on Andrew’s Mac (Jarvis box only)  
- Merge / deploy without Andrew yes  

---

## Handoff

Engineer: one draft PR on **Jarvis’s computer** (Grok) against this bar + Product list.  
Designer eye-checks vs moods. Draft only — Designer does not ask merge.
