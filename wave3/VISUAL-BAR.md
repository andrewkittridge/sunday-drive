# Sunday Drive — wave 3 visual bar

Owner: Designer · Audience: Engineer · Status: **draft only**  
Base: live polish (clip #1 + polish #2) · https://sunday-drive-ten.vercel.app  
Prior bar still stands: `/workspace/sunday-drive/polish/VISUAL-BAR.md` (golden-hour postcard).  
Moods: `mood-weather.png`, `mood-night.png`, `mood-moment.png`, `mood-postcard.png`, `mood-mobile.png`

---

## Thesis

Wave 3 deepens the postcard **without breaking the quiet**. Weather and night make the road feel alive across destinations; rare roadside moments are gifts, not chores; souvenirs are calm keepsakes; a11y keeps aging-gamer comfort first. Polish still ≠ clutter, FOMO, or arcade spectacle.

---

## 1. Weather / seasons (per destination)

- Each destination gets a **signature weather accent**, not a random storm roulette.
  - Examples: county/harvest → soft autumn leaves or warm haze; pond/lake → cool mist; coast → sea haze; desert → heat shimmer; mountain → thin cool fog; town → damp dusk glow.
- Weather is **atmosphere**: mist sheets, sparse falling leaves, heat haze on far asphalt — never particle soup that hides the wagon.
- Keep destination palette + landmark as the 2-second read; weather is the second read.
- Rain/mist: soft, low contrast; headlights still readable. No lightning spam.
- Seasons can tint grass/fog from `route.js` themes — don’t fight the clip-fix corridor or road materials.

## 2. Real clouds + dusk → night sky

- Replace flat disc clouds with **layered soft volumes** (still low-poly/stylized OK) that catch golden-hour and dusk light.
- Night: deep indigo/slate dome, sparse stars, maybe a quiet moon — cozy, not sci-fi.
- Headlights become the hero at night; fog near-range still keeps the wagon readable.
- Transition dusk→night should feel like a slow postcard fade — no snap, no FOV tricks.
- Restraint: no aurora circus, no cloud thunderstorm drama every minute.

## 3. Rare quiet roadside moments

- Low frequency: mail truck, deer at the shoulder, diner neon wink, someone waving — **one beat, then gone**.
- Never block Drive. Never require a tap. Never start a timer or streak.
- Placement: **beside** the road (clip-fix invariants). No clipping through asphalt.
- Tone: Melvor calm — “oh, nice” not “EVENT!” No banners, no urgency chrome.
- Max one moment in mind at a time; long cooldown. Mute doesn’t invent silence — moments stay visual-first.

## 4. Souvenir postcards

- Gallery of **prestiged destinations** — each a still postcard (sky + landmark + wagon optional).
- Persist with save. Open from a quiet control (not a popup cascade).
- Visual: cream border / soft paper, Fraunces caption with destination name + souvenir line. No stickers spam.
- Missing destinations show empty slots or soft “not yet” — never red lock guilt.
- Don’t redesign the idle loop; postcards are memory, not a second game.

## 5. Reduce-motion + larger-type

- **Reduce motion:** respects OS preference + in-app toggle; persist. Cuts cabin sway, cloud drift intensity, leaf/rain rates, camera nudge on Drive; keeps readability (fog/light still OK).
- **Larger type:** one clear step up for miles, Drive, upgrades — aging-gamer first. Persist. Don’t break the panel layout into overflow chaos.
- Both toggles sit near Sound/Save — calm chrome, not settings labyrinth.
- Hit targets stay ≥48px. Contrast cream-on-walnut held.

---

## 6. Mobile portrait (phone)

Mood: `mood-mobile.png` — phone 9:16 feel target.

- **Thumb Drive:** primary Drive lives in the lower thumb zone (≥48px, high-contrast terra). Never stranded at top or mid-screen.
- **Stacked HUD:** title → miles → secondary chrome vertical. No desktop side-by-side chrome that squeezes the road.
- **Road is sacred:** upgrades / garage / journal open as **bottom sheet or side drawer** that stops **below** the horizon / vanishing point. Never a full overlay that paints over the wagon or road.
- Left rail icons (Garage / Journal / Scenes) stay edge-thin; don’t eat the center postcard.
- Portrait camera: keep clip-safe corridor readable; slightly taller sky OK, don’t crop the wagon’s silhouette.
- Same cream-on-walnut + aging-gamer type as polish/a11y. Larger-type still applies on phone.
- Landscape tablet can keep desktop-ish layout; this section is **phone portrait**.

## Safe / Feel order (prefer)

1. Sky + night (clouds, dusk→night) — biggest postcard lift.
2. Weather accents per destination — calm only.
3. Rare moments — frequency + placement first; art second.
4. Postcard gallery — save-backed, quiet UI.
5. A11y toggles — reduce-motion + larger-type.
6. Mobile portrait layout — thumb Drive + stacked HUD + upgrades clear of road (fold into same draft PR).

## Hard no

- FOMO timers, streaks, “limited event”, loot noise
- Merge / prod deploy / force-push without Andrew yes
- Breaking clip-fix (hills/props through road)
- Breaking mute sacred (M + Sound)
- Particle storms that hide the wagon or tank 60 FPS
- Rewriting idle economy for “content”
- Upgrades / sheets covering the road vanishing point or wagon on phone

## Handoff

Engineer builds draft PR + before/after under `wave3/evidence/`.  
Designer eye-checks after frames vs these moods.  
Bring Jarvis PR URL + RESULT.md. Draft only.

## Mood note
Mood stills are **feel targets**. Keep live upgrade names and destination set. Postcard mood shows gallery calm — skip invented Stickers/Notes tabs unless Andrew asks. Prefer soft empty slots over red locks. Mobile mood is layout only — keep live copy/economy; don’t invent new tabs.
