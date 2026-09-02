# Sunday Drive — wave 9 mobile upgrades visual bar

Owner: Designer · Audience: Engineer · Status: **draft only**  
Base: live @ `958547a` (wave 8) · https://sunday-drive-ten.vercel.app  
Product: `product-notes.md` — shopping sheet failure  
Moods: `mood-sheet-390.png`, `mood-sheet-short.png`  
Viewports: **390×844** · short **~667** · The car **open**

---

## Thesis

When The car is open, **buy wins**. Drive stays planted below — it must not steal the thumb. Wave 6–8 made the sheet too short for shopping; this wave gives upgrade rows room, clear whole-row targets, and affordable vs locked contrast. Hold w7/w8. No FOMO. No comfort-ghost stack.

Moods are **layout feel only** — keep live upgrade names/economy (Tires · Mixtape · Diner · …); ignore invented BUY buttons / coastal props. Prefer **whole-row tap** over a tiny cost chip.

---

## 1. Taller shopping sheet

Mood: `mood-sheet-390.png` / `mood-sheet-short.png`

- Panel open: max-height shows **≥2–3 upgrade rows** at 390×844; still **≥2** on ~667.
- Collapsed default stays short (w6–8 win).
- Hide only in sheet header (quiet). Drive planted below (≥48px); no shared-bottom collision.

## 2. Clear buy targets

- Whole upgrade row is the hit target (≥48px; prefer ~72px+ when sheet open).
- Cost reads gold / obvious as the buy affordance; name + one-line meta readable without hover.
- Don’t make Hide or Drive look like an upgrade row.

## 3. Affordable vs locked

- Buyable rows: stronger cream/gold contrast.
- Locked / Soon: clearly muted — one-glance “I can buy this” vs “not yet.”
- Larger type must not erase that contrast.

## 4. Scroll without Drive theft

- Sheet scroll contained (`pan-y`); fling doesn’t land on Drive.
- Visual gap / padding between last upgrade and Drive.
- Don’t disable Drive — just stop accidental taps.

## 5. Hide stays Hide

- One quiet dismiss in header only.
- Never style an upgrade like dismiss.

---

## Preferred build order (one draft PR)

1. Taller open max-height (prove ≥2–3 / ≥2 rows)  
2. Whole-row buy targets + cost affordance  
3. Affordable vs locked contrast  
4. Scroll containment + Drive gap  
5. Hide header-only verify  

Evidence: `wave9-mobile-upgrades/evidence/before|after/`
- `phone-390-sheet.png` — ≥2–3 rows, Drive free, Hide header  
- `phone-short-667.png` — ≥2 rows, Drive free  
- Optional: locked vs buyable close-up; scroll mid-fling still

---

## Hard no

- Removing Drive while shopping  
- Re-opening five comfort ghosts  
- New destinations / FOMO / systems  
- Undoing w7/w8 when sheet is **closed**  
- Merge without Andrew yes  

---

## Handoff

Engineer: one draft PR against this bar + Product list.  
Designer eye-checks. Draft only — Designer does not ask merge.
