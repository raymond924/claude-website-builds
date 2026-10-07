---
name: website-builder
description: Build a client marketing website from a Refero Styles reference (styles.refero.design). Use when the user wants a new website, homepage or landing page for a company, gives a styles.refero.design link, asks for example/inspiration sites to compare, or says "build a website like we did for COOK Engineering". Covers the client questions, Refero research, reference lock, single-file HTML build, photo placeholders, phone/desktop QA, the comparison page, and publishing.
---

# Website Builder

The repeatable process for building client websites in this repo. The first build was
**COOK Engineering** (`sites/cook-engineering/`); open it as the worked example.

Design method: follow the vendored **refero-design** skill (`.claude/skills/refero-design/`).
This skill adds the practical workflow: what to ask, where files go, which scripts to run,
and what went wrong last time.

## 0. Before anything: network access

Refero is not on the default cloud allowlist. Test it first:

```bash
curl -sS -o /dev/null -w '%{http_code}\n' https://styles.refero.design/
```

If you get `403` / `CONNECT tunnel failed`, the environment's network policy blocks it. Tell the
user exactly this (desktop app wording):

1. At the top of the session, click the grey label next to the session title
   (e.g. `Default · claude-website-builds`). If that does nothing: **+ New** in the sidebar, then the
   **cloud icon "Default"** above the message box.
2. Click **Cloud**, hover the environment with the checkmark, click the **gear** icon.
3. **Network access** → **Full** (or **Custom** with `styles.refero.design` and `*.refero.design`
   in **Allowed domains**, with "Also include default list of common package managers" ticked).
4. **Save**, wait about a minute, say "try again". Existing sessions pick it up; no restart needed.

Fallback if access can't be opened: ask the user to paste the style's **DESIGN.md** (copy button
on the style page) and to name the site.

## 1. Ask the client questions (AskUserQuestion)

Ask before building. Don't invent the company. Two rounds worked well:

**Round 1**
- Company name and what they do (services, products, signature offer)
- Photos: free stock / **placeholders** / client supplies
- Scope: **homepage only** / + 3 pages / full site
- Comparison examples: **comparison page only** / build all three / skip

**Round 2** (based on answers)
- Location and markets (sets spelling, units, phone format, regional terms)
- Specifics of their product (e.g. "juice concentrators" for evaporators)
- What to do with earlier drafts (keep / delete)

Record answers in `sites/<client>/BRIEF.md` (copy `templates/BRIEF.template.md`).

## 2. Research styles on Refero

If the user gave a style link, that style is the **primary reference**. Fetch it:

```bash
python3 -I .claude/skills/website-builder/scripts/fetch_refero_style.py <style-url-or-id> sites/<client>/design-references
```

This saves `<name>.DESIGN.md` and the preview `<name>.jpg`, and prints related styles.
Look at the preview image (Read tool) before designing: it shows hero composition and nav
placement that the text only describes.

Pick **two alternatives** from the related list that fit the client's industry. Fetch them too.
For industrial or engineering clients, good candidates were T1 Energy, ON.energy,
teenage engineering, Moving Parts, Hadrian, Form Energy, Commonwealth Fusion Systems.

If the user gave no link, search Refero by mood and industry (see refero-design SKILL.md,
"Research Workflow"), present three options, and let the user choose.

## 3. Lock the reference (write it in BRIEF.md)

Fill in the reference lock and decision ledger before writing code:
- **Preserve** the primary style's signature traits exactly: canvas colour, type weight, radius,
  label device, nav treatment.
- **Keep token roles.** If DESIGN.md says a colour is footer-only or "never a CTA", obey it.
- **Use the DESIGN.md font substitute** when the brand font is proprietary (T1 Sans → Inter).
  The user's chosen reference outranks generic "avoid Inter" advice.
- Every major decision must trace to DESIGN.md, the client's answers, or a craft rule.

## 4. Build

Layout of a client folder:

```
sites/<client>/
  index.html              # the site (single file, inline CSS/JS, Google Fonts only)
  references.html         # comparison page for the three styles
  BRIEF.md                # brief, research, reference lock, ledger, content to confirm, shot list
  design-references/      # <style>.DESIGN.md + <style>.jpg for each reference
```

Build rules:
- Start `:root` with the DESIGN.md tokens, named by role, with a comment stating the reference lock.
- Write real, specific copy in the client's language variant (e.g. South African English: optimise,
  colour, programme; metric units). Use the industry's real terms and units (°Brix, t/h, 316L).
- Mark guessed facts as placeholders in BRIEF.md "Content to confirm". Use obvious placeholders
  for contact details (`[Street address]`, `+27 (0)00 000 0000`).
- **Photo placeholders**: keep the reference's media role. Each slot keeps its final radius and
  aspect ratio and carries a one-line shot note ("Photo · stainless evaporator, natural light").
  Never fake photography with CSS art. Add a shot list to BRIEF.md.
- Number things only when they are a real sequence (process stages), not as decoration.
- Forms: `preventDefault`, validate, and say plainly that the draft doesn't send yet.
- Accessible: semantic sections, `aria-labelledby`, visible focus, `<details>` for accordions,
  phone menu button with `aria-expanded`.

## 5. QA: screenshot desktop and phone

```bash
node .claude/skills/website-builder/scripts/screenshot.js sites/<client>/index.html /path/to/scratchpad/shot
```

It reports `scrollWidth` (must equal the viewport width), console errors, and the elements that
overflow on phones. Crop the full-page PNGs into slices with PIL and look at each one. Compare
against the reference preview image. Fix, then re-shoot once.

Bugs hit last time (check for them):
- **CSS order vs media queries**: a base rule written *after* `@media (max-width…)` overrides it
  (the nav links stayed visible on phones and pushed the page to 744px). Put base rules first.
- Overlay text in a placeholder hero colliding with the headline on phones: anchor notes to the
  top, not the centre.
- Flex children that hold headlines need `flex: 1 1 <basis>`, or they shrink and wrap early.

## 6. Comparison page

`references.html` shows the three styles side by side: preview image, one-line mood, palette
swatches, type, shape, signature move, "what it would mean for <client>", and links to the Refero
style and the live site. Mark the selected style. Style the page in the selected system.

## 7. Deliver

1. Commit and push to the session's branch.
2. Publish `index.html` as an Artifact so the client can open it on a phone. Load the
   `artifact-design` skill first. Artifacts add their own `<!doctype>/<head>/<body>`, so publish a
   copy with those wrapper tags stripped, keep `<title>` and `<style>` at the top, and pass
   supporting images through `files`.
3. Reply with: what was built, the link, what's placeholder, and what to send next
   (photos, logo, figures to confirm).

## Project log

| Date | Client | Primary reference | Alternatives | Notes |
|---|---|---|---|---|
| 2026-10-07 | COOK Engineering (citrus + fish factory engineering, juice evaporators; South Africa) | T1 Energy | ON.energy, teenage engineering | Homepage only, photo placeholders. Network access had to be opened for Refero. |
