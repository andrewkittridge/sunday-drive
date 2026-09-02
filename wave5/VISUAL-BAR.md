# Sunday Drive — wave 5 visual bar

Owner: Designer · Audience: Engineer · Status: **draft only**  
Base: live @ `94c58a0` (wave 4) · https://sunday-drive-ten.vercel.app  
Prior bars still stand: polish / wave3 / wave4  
Andrew: atmosphere is the real drive — cozy aura, chill. Not more systems.  
Moods: `mood-aura-day.png`, `mood-aura-night.png`, `mood-cabin.png`

---

## Thesis

The game **is the air**. Wave 5 deepens light, fog, sky, and cabin calm until leaving the tab open feels like a Sunday. No new destinations, no economy, no FOMO. Melvor / A Short Hike quiet.

---

## 1. Sky (first)

Mood: `mood-aura-day.png` / `mood-aura-night.png`

- Push golden-hour **as the default hero** — warmer key, softer hemi, dusk that actually paints fog + cloud undersides.
- Volume clouds from wave 4 stay; tune wrap-light so peach/amber (day) and moonlight slate (night) read as air, not stickers.
- Night: indigo dome, quiet moon, sparse stars — cozy, never sci-fi.
- Restraint: 2–4 cloud masses; no aurora, no storm wall. Less motion still cuts drift.

## 2. Fog / depth (with sky)

- **Near clear** enough that the wagon is the hero; **far soft** so hills melt into the postcard.
- Destination fog tints can shift gently with theme — never a flat fill that kills distance.
- Mist sheets (weather accents) stay whisper; never hide the road corridor or clip-fix props.

## 3. Light on materials (wagon + road)

- Headlight kiss on asphalt at dusk/night — soft, not stadium.
- Soft contact shadow under the wagon; wood/cream/glass contrast from wave 4 held and warmed.
- One soft bloom or none — **no bloom soup**, no FOV pump, no shake.

## 4. Cabin calm (aura, not new content)

Mood: `mood-cabin.png` — **feel only**. Do not invent passengers, dogs, lantern props, or new UI.

- Warm cabin glass / interior read as a quiet cocoon — subtle glass tint or soft interior fill, not a second scene.
- Optional whisper: tiny dust mote drift in headlight cones (Less motion kills it).
- HUD stays quiet cream-on-walnut; never shout over the road.

## Optional (only if aura still thin)

- Deer silhouette crispness (wave 4 note) — only if it serves the quiet gift, not a quest.
- Weather accent strength if stills prove accents invisible.

---

## Preferred build order (one draft PR)

1. **Sky + light** — golden-hour / night wrap on clouds + key/hemi.
2. **Fog depth** — near/far split so wagon hero + hills melt.
3. **Road + wagon light kiss** — asphalt response + contact shadow.
4. **Cabin calm** — glass/interior warmth whisper only.

Capture before/after under `wave5/evidence/` (desktop day, night, materials close, optional mobile idle).

---

## Hard no

- FOMO timers, EVENT chrome, loot noise
- New destinations / idle rewrite / save-schema for “atmosphere”
- Prop salad, second landmark fighting the wagon
- Bloom soup, arcade shake, FOV pump
- Breaking clip-fix, mute, Less motion, Larger type, audio beds
- Merge / deploy without Andrew yes

---

## Handoff

Engineer builds **one** draft PR against this bar after Product ranks if needed.  
Designer eye-checks vs moods. Jarvis brings Andrew. Draft only — Designer does not ask merge.

## Mood note

Moods are feel targets. Cabin mood ignores invented characters/props — keep live wagon + chrome.
