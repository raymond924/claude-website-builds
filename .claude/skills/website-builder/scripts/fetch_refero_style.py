#!/usr/bin/env python3
"""Download a Refero style page and save its DESIGN.md and preview image.

Usage:
    python3 -I fetch_refero_style.py <style-url-or-id> <out-dir> [name]

Writes <out-dir>/<name>.DESIGN.md and <out-dir>/<name>.jpg, and prints the
style's title, live-site URL and the "More like this" related styles so you
can pick comparison references.

Needs network access to styles.refero.design and images.refero.design
(see the website-builder SKILL.md, "Network access").
"""
import html
import os
import re
import subprocess
import sys


def curl(url, out=None):
    cmd = ["curl", "-sS", "-L", "--max-time", "40", url]
    if out:
        cmd += ["-o", out]
        subprocess.run(cmd, check=True)
        return None
    return subprocess.run(cmd, check=True, capture_output=True).stdout.decode("utf-8", "replace")


def to_text(page):
    t = re.sub(r"<script.*?</script>|<style.*?</style>", "", page, flags=re.S)
    t = re.sub(r"<[^>]+>", "\n", t)
    t = html.unescape(t)
    return "\n".join(l.strip() for l in t.splitlines() if l.strip())


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    ref, out_dir = sys.argv[1], sys.argv[2]
    url = ref if ref.startswith("http") else f"https://styles.refero.design/style/{ref}"
    page = curl(url)
    title = (re.findall(r"<title>(.*?)</title>", page) or ["style"])[0]
    brand = title.split(" design system")[0].strip()
    name = sys.argv[3] if len(sys.argv) > 3 else re.sub(r"[^a-z0-9]+", "-", brand.lower()).strip("-")

    text = to_text(page)
    i = text.find("— Style Reference")
    if i < 0:
        sys.exit("Could not find the DESIGN.md block. Refero may need sign-in for this style; ask the user to paste DESIGN.md.")
    i = text.rfind("\n#", 0, i) + 1
    j = text.find("\nMore like this", i)
    body = re.sub(r"\n(#+ )", r"\n\n\1", text[i:j if j > 0 else None]).strip()

    os.makedirs(out_dir, exist_ok=True)
    md_path = os.path.join(out_dir, f"{name}.DESIGN.md")
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(body + "\n")

    og = re.search(r'<meta property="og:image" content="([^"]+)"', page)
    if og:
        curl(og.group(1), os.path.join(out_dir, f"{name}.jpg"))

    lines = text.splitlines()
    site = next((l for l in lines if l.startswith("https://") and "refero" not in l), "")
    print(f"Style:   {brand}\nSite:    {site}\nSaved:   {md_path}")
    related, seen = [], set()
    for m in re.finditer(r'href="/style/([0-9a-f-]{36})"', page):
        alt = re.search(r'<img alt="([^"]+)"', page[m.end():m.end() + 600])
        if alt and m.group(1) not in seen:
            seen.add(m.group(1))
            related.append((m.group(1), alt.group(1)))
    if related:
        print("Related styles:")
        for sid, alt in related[:12]:
            print(f"  {alt:28} https://styles.refero.design/style/{sid}")


if __name__ == "__main__":
    main()
