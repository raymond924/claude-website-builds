#!/usr/bin/env python3
"""Prepare per-piece critic inputs for a round and print the three critic prompts per piece.

Usage: python3 -I critics.py <round> <pieces comma list>
Creates round<N>/ with ours desk/mob piece shots (copied from shots/) and blind A/B composites.
Writes round<N>/mapping.json (which letter is ours) and round<N>/prompts/<piece>-<critic>.txt.
"""
import json, os, random, sys
from PIL import Image

L = os.path.dirname(os.path.abspath(__file__))
R = int(sys.argv[1]); PIECES = sys.argv[2].split(',')
RD = f"{L}/round{R}"; os.makedirs(f"{RD}/prompts", exist_ok=True)
SITE = "/home/user/claude-website-builds/sites/cook-engineering"

REF = {"1": ["bar-00"], "2": ["bar-01", "bar-02", "bar-03"], "3": ["bar-04"], "4": ["bar-05", "bar-06", "bar-07", "bar-08"]}

GOAL = {
 "1": "The HERO of the homepage for COOK Engineering, a South African engineering consultancy for citrus and fish processing factories that also builds and sells its own citrus juice concentrators (evaporators). In the first screen a plant owner must understand: who COOK is, what they do, that they build evaporators, and where to click next; there must be a credible proof point (a case-study result). It must work on a phone.",
 "2": "The MISSION, LOCATIONS and PRODUCT PANEL part of COOK Engineering's homepage. A plant manager must come away knowing: why COOK exists, that they work in citrus AND fish plants across South Africa and neighbouring countries (named places), that COOK makes its own juice evaporator (shown as a product, with a working Evaporator/Concentrate toggle), and what services COOK offers.",
 "3": "The TECHNOLOGY section of COOK Engineering's homepage, explaining COOK's citrus juice evaporator. A plant engineer must be able to follow how juice goes from single-strength (about 12 °Brix) to concentrate (65 °Brix) stage by stage, and see credible specifications (Brix, throughput in t/h, number of effects, stainless grade). The interactive stage list must make sense on its own.",
 "4": "The COMPANY, STATISTICS, INSIGHTS, CONTACT and FOOTER part of COOK Engineering's homepage. A buyer must find: credibility (who the company is, three hard numbers), recent news/insights relevant to citrus and fish processing, a clear way to send an enquiry, and a complete footer to navigate the site.",
}

def stack(paths, width=720):
    ims = [Image.open(p).convert("RGB") for p in paths]
    ims = [im.resize((width, int(im.height * width / im.width))) for im in ims]
    c = Image.new("RGB", (width, sum(i.height for i in ims)), "white")
    y = 0
    for im in ims:
        c.paste(im, (0, y)); y += im.height
    return c

mapping = {}
for p in PIECES:
    ours_d = f"{L}/shots/piece{p}-desk.png"; ours_m = f"{L}/shots/piece{p}-mob.png"
    for src, dst in ((ours_d, f"{RD}/ours-{p}-desk.png"), (ours_m, f"{RD}/ours-{p}-mob.png")):
        Image.open(src).save(dst)
    ref = stack([f"{L}/{n}.png" for n in REF[p]])
    ours = stack([ours_d])
    letters = ["A", "B"]; random.shuffle(letters)
    ours.save(f"{RD}/blind-{p}-{letters[0]}.png"); ref.save(f"{RD}/blind-{p}-{letters[1]}.png")
    mapping[p] = letters[0]

    shots = f"{RD}/ours-{p}-desk.png (1440 wide) and {RD}/ours-{p}-mob.png (390 wide)"
    prompts = {
     "brief": f"""You are the BRIEF CRITIC. Harsh, binary, no praise.
Goal of this piece: {GOAL[p]}
Look ONLY at the rendered screenshots (open them with the Read tool; for tall images crop with python3 PIL into slices first): {shots}.
Do NOT open any HTML, CSS or source files, and do not judge aesthetics. Judge only: does this piece do the job stated in the goal for a real plant owner/manager? Is any required information missing, unclear, unbelievable, or broken on phone?
Reply in exactly this format:
VERDICT: PASS or FAIL
BIGGEST GAP: one sentence naming the single most important thing that stops it doing the job (if PASS, the most important remaining weakness).
""",
     "system": f"""You are the SYSTEM CRITIC. Harsh, binary, objective. Your only standard is the design system file {SITE}/design-system.md — read it fully.
Judge ONLY the rendered screenshots: {shots}. Do NOT open any HTML/CSS/JS source. You may measure the screenshots with python3 + PIL (sample pixel colours, measure radii, gaps, text heights) to check token adherence.
Check every rule that applies to what is visible: colours and their roles (especially that orange #e8731a appears ONLY as a Brix-scale marker, max two per screen), fonts (Geist / Geist Mono), sizes and weight (nothing bold), 64px media radius, 8px edge gaps, label style (4px square + mono uppercase), glass pills, no shadows, signature graphics where the system requires them, footer rules.
PASS only if there is no material violation.
Reply in exactly this format:
VERDICT: PASS or FAIL
VIOLATIONS: bullet list (max 5), most serious first, or "none"
BIGGEST GAP: one sentence.
""",
     "craft": f"""You are the CRAFT CRITIC. Harsh, binary. Your standard is {SITE}/bar.md (read it) — the mechanisms that make a gold-standard industrial homepage excellent.
Two rendered website sections are below, labels stripped: {RD}/blind-{p}-A.png and {RD}/blind-{p}-B.png (both 720 wide; open with Read, slice tall images with python3 PIL if needed). They are from different companies; ignore subject matter and content. Do NOT open any source code.
Compare their craft against the mechanisms in bar.md: layout grammar, type scale and weight, media treatment, colour discipline, controls on media, whitespace, overall finish and believability of the imagery.
Reply in exactly this format:
BETTER: A or B (no ties)
WHY: two sentences max.
BIGGEST GAP A: one sentence — the single biggest thing A must fix to beat B (or "none" if A is better and nothing material).
BIGGEST GAP B: one sentence — the same for B.
""",
    }
    for k, v in prompts.items():
        open(f"{RD}/prompts/{p}-{k}.txt", "w").write(v)

json.dump(mapping, open(f"{RD}/mapping.json", "w"))
print(json.dumps(mapping))
