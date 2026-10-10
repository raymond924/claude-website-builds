# Claude website builds

Client websites built with Claude Code from [Refero Styles](https://styles.refero.design) references.

| Client | Folder | Reference | Status |
|---|---|---|---|
| COOK Engineering | [`sites/cook-engineering`](sites/cook-engineering) | T1 Energy | Paused: "Concentrate" homepage built, copy awaiting client details (see `NEXT.md`) |
| Lindani Farm | [`sites/lindani-farm`](sites/lindani-farm) | [Grafton Safaris](https://www.graftonsafaris.com/) (live site, not Refero) | Homepage with booking concierge, trip planner and language switcher (demo data: see its [README](sites/lindani-farm/README.md)) |

Each client folder holds:
- `index.html`: the site, a single self-contained HTML file. Open it in a browser.
- `references.html`: the three styles we compared.
- `BRIEF.md`: answers from the client, the design decisions, content still to confirm, and the photo shot list.
- `design-references/`: the Refero DESIGN.md and preview image for each style.

## Reusing the process

The process is saved as a Claude Code skill in [`.claude/skills/website-builder`](.claude/skills/website-builder/SKILL.md).
In a Claude Code session on this repo, ask for a new site, or type `/website-builder`, and Claude follows the
same steps: ask the client questions, fetch the Refero style, lock the reference, build, screenshot-check, and publish.

[`.claude/skills/refero-design`](.claude/skills/refero-design) is Refero's own design-method skill (MIT licence),
included so the method is available offline.
