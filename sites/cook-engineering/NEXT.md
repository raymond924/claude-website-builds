# COOK Engineering: where we left off (2026-10-07)

## Status
- Homepage rebuilt in the "Concentrate" style (gold standard: T1 Energy on Refero) through `/design-loop`.
  Round 1: 1/12 critic checks passed; round 2: 5/12; round 3 fixes applied and screenshot-checked, not re-judged.
- Live preview: https://claude.ai/artifact/YMuBfvergjzqTRqYjH2zfd (private, owner only)
- Loop progress page: https://claude.ai/artifact/NKWRBQ3Rhw7Su8tBTncAAG
- Higgsfield: 8.7 of 10 free credits used (1 hero video, 11 images in `assets/`). 1.3 credits left.

## Next step: copy questions for COOK
Ask these (all copy is currently placeholder; full list in BRIEF.md "Content to confirm"):
1. Contact: phone, street address, city, email (`info@cookengineering.co.za` is a guess).
2. Hero case study: a real project (where, when, before/after numbers), or keep vague, or remove the card.
3. Statistics: real figures (projects, evaporators sold, years, countries), or swap to year founded + countries, or remove.
4. Tone: plain and technical (current), warmer family business, or bold equipment brand.
Then also: the three projects, services list, fish-plant scope, logo, real photos.

## Then
- Apply the copy, run one critic round (brief, system, craft per piece) to confirm.
- Real photos or a Higgsfield top-up would fix the "synthetic imagery" craft failures.

## Resuming in a new cloud session
- Network: the environment needs Full access (or `*.refero.design`) for Refero.
- Higgsfield: `npm i -g @higgsfield/cli`, then `higgsfield auth login` (default port 8765) and the
  paste-back-the-callback-URL trick in `.claude/skills/website-builder/SKILL.md` section 8, then
  `higgsfield workspace set 3c5a27da-06b9-4f19-b815-1bf654f89986`.
- Key files: `index.html`, `design-system.md`, `bar.md`, `BRIEF.md`, `assets/`, `loop/progress.html`.
