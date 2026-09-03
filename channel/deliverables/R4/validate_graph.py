import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).parent
GRAPH = ROOT / "graph.json"
SOURCE = Path(r"d:\YOGSOTH-AI\de-anthropocentric-research-engine\scripts\refactory_source.json")


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    try:
        graph = json.loads(GRAPH.read_text(encoding="utf-8"))
        print("✓ JSON syntax valid")
    except Exception as exc:
        print(f"✗ JSON syntax invalid: {exc}")
        return 1

    nodes = {n["id"] for n in graph.get("tactics", []) + graph.get("sops", [])}
    missing_targets = sorted({b for a, b in graph.get("jumps", []) if b not in nodes})
    if missing_targets:
        print(f"✗ Missing jump targets: {', '.join(missing_targets)}")
    else:
        print("✓ All jump targets exist")

    by_id = {n["id"]: n for n in graph.get("tactics", []) + graph.get("sops", [])}
    phantom = []
    pattern = re.compile(r"([a-z0-9-]+)\(mode=([^\)]+)\)")
    for contract in graph.get("capability_audit", []):
        for node_id, raw_modes in pattern.findall(contract.get("new_path", "")):
            defined = set(by_id.get(node_id, {}).get("modes") or [])
            for mode in (m.strip() for m in raw_modes.split("|")):
                if mode != "..." and mode not in defined:
                    phantom.append(f"{node_id}:{mode}")
    if phantom:
        print(f"✗ {len(phantom)} phantom mode references: {', '.join(sorted(set(phantom)))}")
    else:
        print("✓ All explicit mode references are defined")

    tactics = {n["id"] for n in graph.get("tactics", [])}
    adj = {n: set() for n in tactics}
    for a, b in graph.get("jumps", []):
        if a in tactics and b in tactics:
            adj[a].add(b)
            adj[b].add(a)
    components = 0
    unseen = set(tactics)
    while unseen:
        components += 1
        stack = [unseen.pop()]
        while stack:
            cur = stack.pop()
            for nxt in adj[cur] & unseen:
                unseen.remove(nxt)
                stack.append(nxt)
    if components == 1:
        print("✓ Tactic jump graph is one connected component")
    else:
        print(f"✗ Tactic jump graph has {components} connected components")

    aliases = graph.get("provenance_aliases", [])
    source_names = {n.get("name") for n in json.loads(SOURCE.read_text(encoding="utf-8")).get("nodes", [])}
    valid_aliases = [a for a in aliases if a.get("v3_id") in source_names and a.get("v4_id") in nodes]
    print(f"Provenance aliases: {len(aliases)} total, {len(valid_aliases)} valid, {len(aliases) - len(valid_aliases)} invalid")
    return 1 if missing_targets or components != 1 else 0


if __name__ == "__main__":
    raise SystemExit(main())
