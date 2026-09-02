# Sunday Drive — wave 6 visual bar

Owner: Designer · Audience: Engineer · Status: **draft only**  
Base: live @ `44e64d5` (wave 5) · https://sunday-drive-ten.vercel.app  
Prior bars stand: polish / wave3–5  
Andrew: keep iterating — atmosphere / cabin / road feel over new systems.  
Carry soft notes: deer read · sky depth · headlight cookie · short-phone sheet  
Moods: `mood-sky-depth.png`, `mood-deer-read.png`, `mood-headlight-cookie.png`, `mood-phone-sheet.png`  
Product lock: pending `product-notes.md` — if Product re-ranks, build order follows Product; bets below stay feel-only.

---

## Thesis

Wave 5 made the air the drive. Wave 6 finishes the **soft leftovers** so stills read cozy on first glance: a sky with real depth, a deer you catch in 1s, a true headlight pool on the road, and a phone sheet that never eats Drive. Still Melvor / A Short Hike quiet. No FOMO, no new destinations.

---

## 1. Sky depth (first)

Mood: `mood-sky-depth.png`

- Move past the **two-color dome** — multi-stop air (warm horizon → mid amber/peach → cooler high), volume clouds catching wrap on undersides.
- Soft horizon melt (not a hot white fog wall — w5 note).
- Restraint: 2–4 cloud masses; Less motion still cuts drift. No aurora, no storm wall.
- Feel only — keep live destinations / wagon; ignore mood coastal extras.

## 2. Deer silhouette read

Mood: `mood-deer-read.png`

- Finish the quiet gift: body + legs + neck (+ optional antlers) read **deer in ≤1s** at the shoulder (`|x| ≥ 6.7`).
- No banner, timer, tap, EVENT. Drive never blocked. Long cooldown; max one moment.
- Clip-fix: beside fence/grass, never through asphalt.

## 3. Headlight cookie on asphalt

Mood: `mood-headlight-cookie.png`

- Dusk/night: a soft **elliptical light pool** on the road plane in front of the wagon — cookie falloff, not just emissive lamps + a flat plane tint.
- Contact shadow under wagon held; wood/cream/glass contrast held.
- **No bloom soup**, no stadium flood, no FOV pump.

## 4. Short-phone sheet vs Drive

Mood: `mood-phone-sheet.png` — **layout feel only**. Keep live copy/economy; ignore invented Garage tabs in the mood.

- Open **The car** sheet stays **below** horizon + wagon silhouette.
- **Drive** stays planted in thumb zone (≥48px), fully visible while sheet is open — no shared bottom collision.
- Prefer shorter max height + internal scroll. Collapsed default (w3) stands. Landscape not broken.
- Larger type + Less motion + mute held.

---

## Preferred build order (one draft PR)

1. **Sky depth** — biggest postcard lift left from w5 unfinished.
2. **Headlight cookie** — road feel while driving at dusk/night.
3. **Deer read** — finish the quiet gift (w4 carry).
4. **Short-phone sheet** — Drive planted while sheet open.

If Product’s ranked ship-now differs, follow Product order; keep these four as the ship-now set.

Evidence: `wave6/evidence/before|after/` (desktop day sky, night cookie, `?event=deer`, mobile ~390×844 sheet open).

---

## Hard no

- FOMO timers, EVENT chrome, loot noise
- New destinations / idle rewrite / save-schema for “atmosphere”
- Prop salad, second landmark fighting the wagon
- Invented passengers / cabin interior scene / new toys
- Bloom soup, arcade shake, FOV pump
- Breaking clip-fix, mute, Less motion, Larger type, audio beds
- Merge / deploy without Andrew yes

---

## Handoff

Engineer: one draft PR after Product ranks (or against this order if Product locks these four).  
Designer eye-checks vs moods. Draft only — Designer does not ask merge.
