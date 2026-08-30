from pathlib import Path
import re
import shutil

src = Path(
    r"C:\Users\ameen\.grok\sessions\C%3A%5CUsers%5Cameen\01a04c8f-169a-7a60-849e-101291fb1a2d\images\32.jpg"
)
dest = Path(
    r"C:\Users\ameen\OneDrive\Desktop\dhana-site\public\assets\resources\res-library-ribbon.jpg"
)
if src.exists():
    shutil.copyfile(src, dest)

p = Path(r"C:\Users\ameen\OneDrive\Desktop\dhana-site\resources.html")
c = p.read_text(encoding="utf-8")
needle = "/assets/resources/res-agent-center.jpg"
first = c.find(needle)
second = c.find(needle, first + 1)
print("first", first, "second", second)
if second > 0:
    c = (
        c[:second]
        + "/assets/resources/res-library-ribbon.jpg"
        + c[second + len(needle) :]
    )
    p.write_text(c, encoding="utf-8")
    print("fixed")

srcs = re.findall(r'(?:src|poster)="(/assets/resources/[^"]+)"', c)
print("count", len(srcs), "unique", len(set(srcs)))
print("dups", sorted({s for s in srcs if srcs.count(s) > 1}))

uc = Path(r"C:\Users\ameen\OneDrive\Desktop\dhana-site\use-cases.html").read_text(
    encoding="utf-8"
)
uc_imgs = re.findall(r'src="(/assets/usecases/[^"]+)"', uc)
res_imgs = set(srcs)
overlap = sorted(set(uc_imgs) & res_imgs)
print("overlap usecases/resources", overlap)
print("film present", "dhana-film2.mp4" in uc)
