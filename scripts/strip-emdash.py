"""Replace em dashes in site-facing HTML/JS with plain punctuation."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILES = [
    ROOT / "index.html",
    ROOT / "pricing.html",
    ROOT / "use-cases.html",
    ROOT / "resources.html",
    ROOT / "contact.html",
    ROOT / "src" / "main.js",
]

# Order matters: longer / more specific first
REPLACEMENTS = [
    (" — ", ". "),  # sentence break
    ("— ", ". "),
    (" —", "."),
    ("—", "-"),  # remaining (placeholders, titles)
]


def clean(text: str) -> str:
    out = text
    for a, b in REPLACEMENTS:
        out = out.replace(a, b)
    # Fix accidental double periods from ". ." patterns
    while ". ." in out:
        out = out.replace(". .", ".")
    out = out.replace("..", ".")
    # Titles that became "Dhana. AI" -> "Dhana | AI" for common patterns
    out = out.replace("Dhana. AI relationship", "Dhana | AI relationship")
    out = out.replace("Book a pilot. Dhana", "Book a pilot | Dhana")
    out = out.replace("Pricing. Dhana", "Pricing | Dhana")
    out = out.replace("Use cases. Dhana", "Use cases | Dhana")
    out = out.replace("Resources. Dhana", "Resources | Dhana")
    out = out.replace("<title>Dhana. ", "<title>Dhana | ")
    out = out.replace('og:title" content="Dhana. ', 'og:title" content="Dhana | ')
    # Hero line "Dhana. your virtual" from "Dhana — your"
    out = out.replace(
        "              . your virtual banker for every lead, 24×7.",
        "              your virtual banker for every lead, 24×7.",
    )
    # Empty placeholder cells: prefer en-dash-like hyphen already from —
    # JS empty markers: "-" is fine
    return out


def main():
    for path in FILES:
        if not path.exists():
            print("skip missing", path)
            continue
        raw = path.read_text(encoding="utf-8")
        if "—" not in raw:
            print("clean", path.name)
            continue
        count = raw.count("—")
        path.write_text(clean(raw), encoding="utf-8")
        left = path.read_text(encoding="utf-8").count("—")
        print(f"{path.name}: removed {count - left}/{count}, left {left}")


if __name__ == "__main__":
    main()
