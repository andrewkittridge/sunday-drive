# Sunday Drive — wave 4 product notes
2026-09-02. Product. Evidence: https://sunday-drive-ten.vercel.app · wave3/EYECHECK.md · wave3/RESULT.md · polish/VISUAL-BAR.md · wave4/BRIEF.md

## Thesis

Andrew asked for cozier and more visually better. That is **feel**, not content. Wave 4 deepens the golden-hour postcard and cabin calm already shipping on main (wave 3 + audio). Warmth, depth, materials — still Melvor / A Short Hike quiet. One draft PR. No new economy, no new destinations, no FOMO.

The user problem: the road already works; the last 10% of postcard fidelity is what makes someone leave it open on a Sunday. Fix what wave 3 eye-check already named, then one materials pass. Stop before systems sprawl.

## Ship now (one PR, ranked)

1. **Cloud volume puff** — Carry from wave 3 PASS notes. Layered soft volumes that catch golden hour / moonlight, not flat ovals. Highest “cozy sky” leverage for the least design risk.
2. **Deer silhouette read** — Same carry. One quiet animal that reads as a deer in 1s at the shoulder. Still a gift, no EVENT chrome, clip-fix `|x| ≥ 6.7` held.
3. **Material / light depth (wagon + road + fog)** — Wood vs cream vs glass contrast; asphalt that takes headlight kiss; fog near/far so the wagon stays hero and hills melt. No bloom soup. Align to existing `polish/VISUAL-BAR.md` Safe/Feel order (atmosphere → car/road → roadside).
4. **Short-phone sheet vs Drive** — Open **The car** sheet must not climb over the wagon silhouette or bury thumb Drive. Sheet shorter / scroll harder; Drive stays planted. Aging-gamer comfort is product, not chrome.

Hold mute, Less motion, Larger type, clip-fix invariants (hills `|x| ≥ 12`, props `|x| ≥ 6.7`, road `y`/offset, camera near).

## Ship next (after this PR merges or Andrew asks)

- Stronger destination weather accents only if stills prove they are invisible (desert shimmer).
- Postcard gallery as quiet 3D captures (not blocking cozy feel).
- Sparse star field / milky suggestion at night — whisper only.
- One more roadside gift type only if density stays “rare,” not a rotation menu.

## Never (this wave / this product)

- FOMO timers, streaks, EVENT banners, loot noise.
- New destinations or idle-loop / save-schema rewrite “for visuals.”
- Accounts, ads, microtransactions.
- Arcade shake, FOV pump, loud bloom, confetti.
- Prop salad or second landmark fighting the wagon.
- Merge / prod deploy without Andrew yes.
- Waiting on perfect car meshes — readable low-poly + light wins.

## Build order for Designer → Engineer

1. Designer: wave4 VISUAL-BAR + moods (cloud puff, deer, material warmth, short-phone sheet).
2. Engineer: one draft PR against that bar; before/after under `wave4/evidence/`.
3. Designer eye-check; Jarvis brings Andrew pick-list + PR. Draft only.

## Non-goals

- Declaring engagement / retention findings (no Analytics in this room).
- Audio redesign (audio pass already shipped; respect mute).
- Re-litigating wave 3 features that PASS’d.

## Handoff

- Done: ranked ship / next / never for cozy + visual
- Evidence: live URL; wave3 eye-check carry notes; polish visual bar
- Unresolved: Designer bar + moods; Engineer draft PR
- Next: Designer owns bar; Engineer waits for it; Jarvis gates Andrew
