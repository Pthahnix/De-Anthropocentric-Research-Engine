"""Mechanical gate: every numeric threshold token in pilot sources must appear in its body."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ARCH = Path(r"D:\YOGSOTH-AI\file-transfer\2026-08-23-22-16-dare-v4-architecture.json")
SKILLS = Path(r"D:\YOGSOTH-AI\de-anthropocentric-research-engine\skills")
PILOT = Path(__file__).parent / "pilot"
IDS = [
    "synthesize-meta-analytic-evidence",
    "design-experiment",
    "formulate-hypotheses",
    "analyze-constraints-readiness",
    "rank-candidates",
    "establish-empirical-baseline",
    "audit-benchmark-validity",
]
TOKEN = re.compile(
    r"(?:>=|<=|\u00b1|\u2265|\u2264|\bat least\s+\d+\b|\btop[- ]?\d+\b|\b\d+\s*%)",
    re.I,
)


def source_files() -> dict[str, Path]:
    return {p.parent.name: p for p in SKILLS.rglob("SKILL.md")}


def main() -> int:
    graph = json.loads(ARCH.read_text(encoding="utf-8"))
    by_name = source_files()
    missing: list[str] = []
    total = 0
    for node_id in IDS:
        node = next(n for n in graph["tactics"] if n["id"] == node_id)
        body = (PILOT / node_id / "body.md").read_text(encoding="utf-8")
        node_total = 0
        for old in node.get("old", []):
            name = old.rsplit("/", 1)[-1].split(" [", 1)[0].strip()
            src = by_name.get(name)
            if src is None:
                continue
            for line_no, line in enumerate(src.read_text(encoding="utf-8", errors="replace").splitlines(), 1):
                if TOKEN.search(line):
                    node_total += 1
                    total += 1
                    if line.rstrip() not in body:
                        missing.append(f"{node_id}: {src}:{line_no}: {line.strip()}")
        print(f"{node_id}: source threshold lines={node_total}, missing={sum(x.startswith(node_id + ':') for x in missing)}")
    if missing:
        print("MISSING threshold lines:", file=sys.stderr)
        print("\n".join(missing), file=sys.stderr)
        return 1
    print(f"OK: {total} source threshold lines preserved verbatim")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
