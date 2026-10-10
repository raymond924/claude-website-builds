#!/usr/bin/env python3
"""Prepare per-piece critic inputs for a design-loop round on Lindani Farm.

Usage: python3 -I critics.py <round> <pieces comma list>
Creates round<N>/ with our piece shots, blind A/B composites (ours vs Grafton) and the three
critic prompts per piece. round<N>/mapping.json records which letter is ours.
"""
import json, os, random, sys
from PIL import Image

L = os.path.dirname(os.path.abspath(__file__))
R = int(sys.argv[1]); PIECES = sys.argv[2].split(',')
RD = f"{L}/round{R}"; os.makedirs(f"{RD}/prompts", exist_ok=True)
SITE = "/home/user/claude-website-builds/sites/lindani-farm"

REF = {"1": ["desk-00", "desk-01"], "2": ["desk-01", "desk-02", "desk-03"],
       "3": ["desk-03", "desk-04", "desk-05", "desk-06", "desk-09"], "4": ["desk-14", "desk-15"]}

GOAL = {
 "1": "The TOP of the homepage for Lindani Farm: four private self-catering studios on a small farm just outside Paarl in the Cape Winelands, South Africa. It covers the navigation, the hero and the date checker under it. In the first screen a couple planning a weekend away from Cape Town must understand that this is a quiet farm stay near Paarl and how to book. Within one scroll they must be able to pick dates, see which studios are free and what the stay costs, and find the booking button. It must work on a phone.",
 "2": "The INTRO, STUDIOS and RATES part of Lindani Farm's homepage (self-catering farm stay near Paarl). A guest must come away knowing what the farm is like, exactly what each studio includes (linen, kitchenette, en-suite, patio), roughly what a night costs (the rates are sample figures and must be labelled as such), and how to check dates from here.",
 "3": "The NEARBY, MOOD BAND and ON THE FARM part of Lindani Farm's homepage. A guest must learn what is close by (named wine farms, Franschhoek, Paarl Mountain, markets) and what days on the farm feel like (pool, dam, braai spots, the studios' patios), shown with real photographs of the farm. It must make them want to stay.",
 "4": "The ENQUIRY form and FOOTER of Lindani Farm's homepage. A guest must be able to send an enquiry with their dates, guests and contact details, see clearly how to reach the farm directly (the phone/WhatsApp number), and find their way around the site from the footer.",
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
    ref = stack([f"{L}/bar/{n}.png" for n in REF[p]])
    ours = stack([ours_d])
    letters = ["A", "B"]; random.shuffle(letters)
    ours.save(f"{RD}/blind-{p}-{letters[0]}.png"); ref.save(f"{RD}/blind-{p}-{letters[1]}.png")
    mapping[p] = letters[0]
    shots = f"{RD}/ours-{p}-desk.png (1440 wide) and {RD}/ours-{p}-mob.png (390 wide)"
    slice_note = "These images are tall: before judging, slice them into screen-height crops with python3 and PIL (for example 900px slices of the desktop shot, 844px slices of the phone shot) and Read every slice."
    prompts = {
     "brief": f"""You are the BRIEF CRITIC in a design review. Be harsh and binary. Praise is useless.
Goal of this piece: {GOAL[p]}
Judge ONLY the rendered screenshots: {shots}. {slice_note}
Do NOT open any HTML, CSS, JS or other source files, and ignore aesthetics. Judge only whether this piece does the job in the goal for a real guest: is anything required missing, unclear, unbelievable, or broken on the phone?
Reply in exactly this format and nothing else:
VERDICT: PASS or FAIL
BIGGEST GAP: one sentence naming the single most important thing stopping it doing the job (if PASS, the most important remaining weakness).
""",
     "system": f"""You are the SYSTEM CRITIC in a design review. Be harsh, binary and objective. Your only standard is the design system in {SITE}/design-system.md: read all of it.
Judge ONLY the rendered screenshots: {shots}. {slice_note}
Do NOT open any HTML, CSS or JS. You may measure the screenshots with python3 and PIL (sample pixel colours, measure radii, gaps, inset from the edge, text heights) to check the rules.
Check every rule that applies to what you can see: colour roles (above all, gold only on booking actions and at most two gold buttons per screen; no other saturated colour), fonts (Playfair Display display with one italic accent per major heading, Satoshi body, 12px uppercase labels), minimum text size, panel inset and radius, card/button radii, secondary links as label plus circled arrow, form fields, date fields as buttons, shadows only where allowed, footer rules, photos only (no text in images).
PASS only if there is no material violation.
Reply in exactly this format and nothing else:
VERDICT: PASS or FAIL
VIOLATIONS: bullet list (max 5), most serious first, or "none"
BIGGEST GAP: one sentence.
""",
     "craft": f"""You are the CRAFT CRITIC in a design review. Be harsh and binary. Your standard is /home/user/claude-website-builds/loops/lindani-farm/bar.md: read it. It lists the mechanisms that make a gold-standard hospitality homepage excellent.
Two rendered website sections, labels stripped: {RD}/blind-{p}-A.png and {RD}/blind-{p}-B.png (both 720 wide). {slice_note.replace('(for example 900px slices of the desktop shot, 844px slices of the phone shot)', '(about 450px slices)')}
They come from different businesses: ignore subject matter, wording and brand colours. Do NOT open any source code.
Compare their craft against the mechanisms in bar.md: panel and layout grammar, type scale, weight and accent, colour discipline, form treatment, list and card devices, links and chrome, whitespace, image quality and overall finish.
Reply in exactly this format and nothing else:
BETTER: A or B (no ties)
WHY: two sentences max.
BIGGEST GAP A: one sentence naming the single biggest thing A must fix to beat B (or "none").
BIGGEST GAP B: one sentence, the same for B.
""",
    }
    for k, v in prompts.items():
        open(f"{RD}/prompts/{p}-{k}.txt", "w").write(v)
json.dump(mapping, open(f"{RD}/mapping.json", "w"))
print(json.dumps(mapping))
