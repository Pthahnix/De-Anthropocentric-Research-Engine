"""Validate a DARE-style SKILL.md file: frontmatter presence, required
fields, body length, and tactic-to-SOP dependency closure. See paper-reading/docs/superpowers/specs/
2026-08-07-paper-reading-v2-design.md §7 for the convention this checks.
"""
import os
import sys
import yaml

MAX_BODY_LINES = 500
REQUIRED_FIELDS = ["name", "description", "version", "category", "type"]
VALID_TYPES = ["sop", "tactic", "strategy", "campaign"]


def validate_skill(path: str, skills_root: str = None) -> list[str]:
    errors = []
    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        return [f"File not found: {path}"]

    if not content.startswith("---\n"):
        return ["No YAML frontmatter found (file must start with '---')"]

    end_marker = content.find("\n---\n", 4)
    if end_marker == -1:
        return ["Frontmatter opened with '---' but never closed"]

    frontmatter_text = content[4:end_marker]
    body = content[end_marker + 5:]

    try:
        frontmatter = yaml.safe_load(frontmatter_text) or {}
    except yaml.YAMLError as e:
        return [f"Frontmatter is not valid YAML: {e}"]

    for field in REQUIRED_FIELDS:
        if field not in frontmatter or not frontmatter[field]:
            errors.append(f"Missing required frontmatter field: '{field}'")

    skill_type = frontmatter.get("type")
    if skill_type and skill_type not in VALID_TYPES:
        errors.append(
            f"Unknown type: '{skill_type}' — expected one of {', '.join(VALID_TYPES)}"
        )

    if skill_type == "tactic":
        errors.extend(_check_tactic_closure(frontmatter, path, skills_root))

    body_lines = body.count("\n")
    if body_lines > MAX_BODY_LINES:
        errors.append(
            f"Body is {body_lines} lines, exceeds the {MAX_BODY_LINES}-line "
            "guideline (spec §7) — split large reference material into references/"
        )

    return errors


def _check_tactic_closure(frontmatter, path, skills_root):
    """A tactic orchestrates SOPs; every SOP it names must exist."""
    declared = (frontmatter.get("dependencies") or {}).get("sops") or []
    if not declared:
        return [
            "type is 'tactic' but dependencies.sops is empty — a tactic that "
            "orchestrates no SOPs cannot do anything, since only SOPs execute"
        ]

    if skills_root is None:
        skills_root = os.path.dirname(os.path.dirname(os.path.abspath(path)))

    return [
        f"dependencies.sops names '{sop}', but {skills_root}/{sop}/SKILL.md does not exist"
        for sop in declared
        if not os.path.isfile(os.path.join(skills_root, sop, "SKILL.md"))
    ]


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python validate_skill.py <path/to/SKILL.md>")
        sys.exit(1)

    errors = validate_skill(sys.argv[1])
    if errors:
        for e in errors:
            print(f"ERROR: {e}")
        sys.exit(1)
    else:
        print("No errors found")
        sys.exit(0)
