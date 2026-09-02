# Sunday Drive — wave 4 research notes
Date: 2026-09-02 · Research · Cozy idle / postcard visual refs (primary sources)

Audience: Designer (bar already drafted), Engineer (build order), Jarvis (Andrew pack).  
Scope: 5–8 cited refs that deepen **golden-hour postcard + cabin calm** without new content. Map each to Product’s ship-now set.

Live context: https://sunday-drive-ten.vercel.app · wave 3 PASS notes (flat clouds, deer read, short-phone sheet) · Designer `VISUAL-BAR.md` + moods already land the same four bets.

---

## Findings (hard)

### 1. A Short Hike — low-poly readability + imagination fill
**Source:** Adam Robinson-Yu, PlayStation Blog, 2021-08-05 — [Crafting a tiny open world](https://blog.playstation.com/2021/08/05/crafting-a-tiny-open-world-a-look-behind-the-scenes-at-the-creation-of-a-short-hike/)

**Fact:** Art direction started from “as few pixels as possible” still readable. That forced **flat cohesive shading**, no anti-aliasing, and a **soft outline** so objects stay distinct. Dev claim: low resolution helps the world feel lush because **imagination fills details**. Pixel size is also a player preference (accessibility).

**Implication for wave 4:** Deer and wagon wins are **silhouette + material contrast**, not mesh density. Matches Designer’s “silhouette > mesh detail” and Product’s “readable low-poly + light wins.” Soft outline energy ≈ readable contact shadow / wood-vs-cream-vs-glass separation — not bloom soup.

### 2. A Short Hike — fog as focus, not weather theater
**Source:** Wikipedia summary of developer commentary (GDC / interviews cited there) — [A Short Hike](https://en.wikipedia.org/wiki/A_Short_Hike); palette from Canadian Shield autumn photos.

**Fact:** Without post effects, distant map was noisy. Dev added **fog to keep the player concentrated**, plus edge detection and color correction. Palette sampled from real autumn photos.

**Implication:** Fog should clear near the wagon hero and melt far hills (Designer’s materials mood). Fog is a **readability tool**, not a storm event. Golden-hour warm key + soft fill tracks “sampled postcard palette,” not neon sky circus.

### 3. Melvor Idle 2 — cozy = visual-only day/night + weather
**Source:** Malcs, Melvor news, 2025-04-24 — [Melvor Idle 2 - Coming Soon!](https://news.melvoridle.com/melvor-idle-2-coming-soon/)

**Fact:** Day/night cycle and weather are explicitly **“a visual only system designed to make the game even more cozy.”** Single-player, own pace; multiplayer rejected partly because it creates “how far behind you are” pressure. No microtransactions in base game.

**Implication:** Sunday Drive’s already-shipping day/night + destination weather accents are the Melvor-shaped bet. Wave 4 should **deepen feel of systems that exist**, not add FOMO progress chrome. Product’s “never FOMO / never idle rewrite” aligns with Melvor’s own-pace doctrine.

### 4. Firewatch — artist skies + layered atmospheric fog
**Source:** Campo Santo eng/art posts — [procedural sky explanation](https://blog.camposanto.com/post/112703721804/this-blog-post-is-an-in-detail-explanation-of-a) (Jane Ng GDC follow-up); [lighting Q&A](https://blog.camposanto.com/post/102893584324/i-asked-twitter-if-anyone-had-questions-about-the)

**Fact:** Skies are **artist-driven** (3-stop gradient + sun disc + sun halo + horizon halo), not phys-based scattering knobs. Time of day interpolates **sky + sun direction + two fog systems + color correction together**.

**Implication for clouds + materials:** Cloud puff should catch **rim from the golden-hour key** (peach/amber edges, cooler undersides) like a postcard halo — not a volumetric storm. Road/fog pass should move as one with the light (Designer’s “atmosphere → car/road → roadside”).

### 5. Firewatch — fog creates color layers; props serve narrative
**Source:** Jane Ng interview summary — [How Firewatch translated 2D concept art into a 3D open world](https://ctrl500.com/art/how-firewatch-translated-2d-concept-art-into-a-3d-open-world/)

**Fact:** Atmospheric fog intensity is what pushes the 3D world toward the bold **layered colors** of the key art. Trees/rocks stay stage-setting; **props carry narrative**. High texture detail = “this matters.”

**Implication:** One quiet deer at the shoulder is a **narrative gift prop**, not a second landmark. Ambiguous silhouette (wave 3 eye-check) fails the “reads in 1s” bar. Prop salad / second landmark fighting the wagon is an explicit hard-no — same doctrine.

### 6. Spiritfarer — day/night gradient without losing the hero
**Source:** Thunder Lotus pipeline writeup (Unity + painted backgrounds + dynamic global gradient) — [artistic pipeline overview](https://foro3d.com/en/2026/mayo/el-pipeline-artistico-de-spiritfarer-animacion-2d-y-luz-dinamica-en-un.html)

**Fact:** Global color gradient shifts mood by time of day over painted worlds; character materials are protected so heroes stay readable and pictorial.

**Implication:** Night/dusk materials pass must keep **wagon as 2s hero** (near fog clear, headlights kiss asphalt). Mood change ≠ burying the cabin in bloom or flat fill.

### 7. A Short Hike effects thread — soft volumes, sharp material edges
**Source:** @adamgryu / Adam Robinson-Yu effects thread — [Threadreader](https://threadreaderapp.com/thread/1113100182655262721.html)

**Fact:** Terrain uses strongest-splat channel for **sharp material edges**; water/shore uses depth for soft transitions. Pixel look via low-res render target.

**Implication for cloud puff:** Prefer **few readable layered masses with soft falloff** (2–4) over many flat discs. For wagon/road: sharp wood/cream/asphalt identity, soft fog falloff — same “sharp materials + soft atmosphere” split.

### 8. Aging-gamer comfort (product constraint, research framing)
**Source:** In-project canon — wave 3 EYECHECK (Larger type / Less motion / mute PASS); Melvor “own pace” (ref 3); A Short Hike pixel-size preference (ref 1).

**Fact:** Comfort toggles already ship and passed. Short-phone open sheet still shares height with Drive (wave 3 unfinished note).

**Implication:** Short-phone sheet clearance is a **cozy accessibility** bet, not chrome. Prefer shorter max sheet + scroll so Drive stays planted (≥48px) and sheet stays below wagon silhouette — matches Designer’s phone mood (layout feel only).

---

## Map → Product ship-now (one PR)

| Ship item | Primary refs | What “done” looks like (research language) |
|---|---|---|
| Cloud volume puff | 4, 7, wave3 note | Soft layered volumes catch key light; 2–4 masses; Less motion softens drift |
| Deer silhouette read | 1, 5, wave3 note | Body+head(+legs) reads deer ≤1s; gift only; shoulder clip-safe |
| Materials depth | 2, 4, 6 | Near clear / far melt fog; wood≠cream≠glass; asphalt takes dusk headlight kiss; no bloom soup |
| Short-phone sheet | 1, 3, 8 | Comfort first; Drive planted; sheet below horizon/wagon |

---

## Speculation (flagged)

- Official Melvor Idle 1 screenshots are still more UI-minimal than MI2’s promised cozy atmosphere; treat MI2 news as **stated intent**, not a shipped still to pixel-match.
- Spiritfarer secondary writeup is a pipeline summary, not a Thunder Lotus primary PDF; use for the gradient/hero-readability principle, not for copying their 12fps character look.
- Stock “lofi road trip wallpaper” loops (Envato/Storyblocks) are **not** recommended as targets — too loop-wallpaper, wrong energy vs Melvor / Short Hike quiet.

---

## Open questions

1. Does Andrew want cloud puff closer to Short Hike flat gradient slabs or Firewatch soft halo volumes? Designer moods currently lean soft volume — Research supports that for golden-hour rim.
2. Antlers on deer: optional for read, or too “majestic”? Silhouette legs+neck may be enough (Designer bar already optional).
3. Weather accent strength (Product “next”) — still unproven on desert shimmer stills; hold until this PR lands.

## Evidence / paths
- This file: `/workspace/sunday-drive/wave4/research-notes.md`
- Prior: `/workspace/sunday-drive/wave3/EYECHECK.md`, `wave4/VISUAL-BAR.md`, `wave4/product-notes.md`
- Live: https://sunday-drive-ten.vercel.app
