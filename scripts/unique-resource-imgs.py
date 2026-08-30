from pathlib import Path
import re

p = Path(r"C:\Users\ameen\OneDrive\Desktop\dhana-site\resources.html")
c = p.read_text(encoding="utf-8")

assets = [
    "/assets/resources/res-dhana-orb-official.png",
    "/assets/resources/res-learn-notebook.jpg",
    "/assets/resources/res-agent-center.jpg",
    "/assets/resources/res-blog-capacity.jpg",
    "/assets/resources/res-blog-officers.jpg",
    "/assets/resources/res-consent-glass.jpg",
    "/assets/resources/res-video-library.jpg",
    "/assets/resources/res-writing-pen.jpg",
    "/assets/resources/res-framework-scales.jpg",
    "/assets/resources/res-purple-orb.jpg",
    "/assets/resources/res-free-ai.jpg",
    "/assets/resources/res-lending-directions.jpg",
    "/assets/resources/res-dpdp-shield.jpg",
    "/assets/resources/res-vault-perimeter.jpg",
    "/assets/resources/res-selfhost.jpg",
    "/assets/resources/res-hitl-stamp.jpg",
    "/assets/resources/res-writing-essays.jpg",
    "/assets/resources/res-rbi.jpg",
]

idx = 0


def repl(m: re.Match) -> str:
    global idx
    attr = "poster" if m.group(0).startswith("poster") else "src"
    if idx >= len(assets):
        print("WARN ran out", idx, m.group(1))
        return m.group(0)
    path = assets[idx]
    idx += 1
    return f'{attr}="{path}"'


pattern = re.compile(r'(?:src|poster)="(/assets/resources/[^"]+)"')
c2, n = pattern.subn(repl, c)
p.write_text(c2, encoding="utf-8")
srcs = pattern.findall(c2)
# findall with groups returns paths only if one group - adjust
srcs = re.findall(r'(?:src|poster)="(/assets/resources/[^"]+)"', c2)
print("replacements", n, "count", len(srcs), "unique", len(set(srcs)))
dups = sorted({s for s in srcs if srcs.count(s) > 1})
print("dups", dups)
