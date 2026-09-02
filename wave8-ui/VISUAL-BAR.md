# Sunday Drive — wave 8 UI visual bar

Owner: Designer · Audience: Engineer · Status: **draft only**  
Base: live @ `e79031f` (wave 7 mobile) · https://sunday-drive-ten.vercel.app  
Product: `product-notes.md` — promote vs collapse  
Moods: `mood-ui-desktop.png`, `mood-ui-phone.png`  
Viewports: desktop **~1280 / ~1440** · phone **390×844**

---

## Thesis

The **postcard owns the viewport**. Chrome answers one question in one glance: **Drive.** Destination → miles → Drive → The car. Comfort controls collapse into **one Menu** — not five equal ghosts. Melvor quiet. Hold w7 mobile gains. No FOMO.

Moods are **layout feel only** — keep live copy/economy/wagon; ignore invented coastal titles and surfboards.

---

## 1. Primary path only

- Always obvious: **destination · miles · Drive · The car** (collapsed by default).
- Drive is the sole primary (≥48px; Space / click). Cream-on-walnut.
- Rate / trip / souvenir lines stay whisper-quiet — don’t promote.

## 2. Collapse comfort chrome → one Menu

- One quiet control labeled **Menu** (word + optional hamburger) — top corner, not competing with Drive.
- Inside Menu: Sound · Save file · Postcards · Larger type · Less motion.
- **Mute stays sacred:** **M** keyboard + Sound item in Menu. Persist a11y + mute as today.
- No five equal top-row ghosts. Don’t bury a11y forever.

## 3. More canvas, less dashboard

Mood: `mood-ui-desktop.png`

- Desktop ~1280/1440: quieter chrome; road/wagon/air fill the frame.
- Phone: hold w7 safe-area / short sheet / landscape / type; don’t re-stack a comfort row.
- The car: short sheet when open (w6/w7 rules); Hide in header; Drive planted.

## 4. Intuitive labels

- Drive stays **Drive**. Upgrades entry stays **The car**.
- No FOMO copy, no EVENT chrome, no equal-weight salad.

---

## Preferred build order (one draft PR)

1. Collapse five ghosts → Menu (keep mute + a11y reachable)  
2. Promote hierarchy (destination → miles → Drive → The car)  
3. Desktop canvas breathing room  
4. Phone: verify w7 gains held under quieter chrome  

Evidence: `wave8-ui/evidence/before|after/`
- `desktop-1280.png` / `desktop-1440.png` — quiet chrome, postcard hero  
- `phone-390.png` — Menu + Drive; no comfort row stack  
- Optional: Menu open (shows Sound / a11y items)

---

## Hard no

- Removing mute or a11y  
- FOMO / new destinations / idle rewrite  
- Undoing w7 mobile gains  
- Equal-weight button salad again  
- Merge without Andrew yes  

---

## Handoff

Engineer: one draft PR against this bar + Product list.  
Designer eye-checks. Draft only — Designer does not ask merge.
