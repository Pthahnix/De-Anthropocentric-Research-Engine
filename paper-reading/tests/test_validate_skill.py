import sys
import os
import tempfile
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "scripts"))
from validate_skill import validate_skill


def _write(tmp_path, content):
    path = os.path.join(tmp_path, "SKILL.md")
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    return path


@pytest.fixture
def tmp_dir():
    return tempfile.mkdtemp()


def test_valid_skill_has_no_errors(tmp_dir):
    content = (
        "---\nname: example-skill\ndescription: Does a thing.\n"
        "version: 1.0.0\ncategory: paper-reading\ntype: sop\n---\n\n# Example\n\nBody.\n"
    )
    path = _write(tmp_dir, content)
    assert validate_skill(path) == []


def test_missing_name_field_is_an_error(tmp_dir):
    content = "---\ndescription: Does a thing.\n---\n\n# Example\n"
    path = _write(tmp_dir, content)
    errors = validate_skill(path)
    assert any("name" in e for e in errors)


def test_missing_description_field_is_an_error(tmp_dir):
    content = "---\nname: example-skill\n---\n\n# Example\n"
    path = _write(tmp_dir, content)
    errors = validate_skill(path)
    assert any("description" in e for e in errors)


def test_missing_frontmatter_is_an_error(tmp_dir):
    content = "# Example\n\nNo frontmatter at all.\n"
    path = _write(tmp_dir, content)
    errors = validate_skill(path)
    assert any("frontmatter" in e.lower() for e in errors)


def test_body_over_500_lines_is_an_error(tmp_dir):
    body = "\n".join(f"line {i}" for i in range(600))
    content = f"---\nname: example-skill\ndescription: Does a thing.\n---\n\n{body}\n"
    path = _write(tmp_dir, content)
    errors = validate_skill(path)
    assert any("500" in e for e in errors)


def test_nonexistent_file_is_an_error():
    errors = validate_skill("/nonexistent/SKILL.md")
    assert len(errors) == 1
    assert "not found" in errors[0].lower()


def test_missing_version_field_is_an_error(tmp_dir):
    content = "---\nname: example-skill\ndescription: Does a thing.\ncategory: paper-reading\ntype: sop\n---\n\n# Example\n"
    assert any("version" in e for e in validate_skill(_write(tmp_dir, content)))


def test_missing_category_field_is_an_error(tmp_dir):
    content = "---\nname: example-skill\ndescription: Does a thing.\nversion: 1.0.0\ntype: sop\n---\n\n# Example\n"
    assert any("category" in e for e in validate_skill(_write(tmp_dir, content)))


def test_missing_type_field_is_an_error(tmp_dir):
    content = "---\nname: example-skill\ndescription: Does a thing.\nversion: 1.0.0\ncategory: paper-reading\n---\n\n# Example\n"
    assert any("type" in e for e in validate_skill(_write(tmp_dir, content)))


def test_unknown_type_value_is_an_error(tmp_dir):
    content = "---\nname: example-skill\ndescription: Does a thing.\nversion: 1.0.0\ncategory: paper-reading\ntype: gadget\n---\n\n# Example\n"
    assert any("gadget" in e for e in validate_skill(_write(tmp_dir, content)))


def _write_skill(root, name, content):
    directory = os.path.join(root, "skills", name)
    os.makedirs(directory, exist_ok=True)
    path = os.path.join(directory, "SKILL.md")
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    return path


def test_tactic_with_resolvable_sops_has_no_errors(tmp_dir):
    _write_skill(tmp_dir, "real-sop", "---\nname: real-sop\ndescription: A real one.\nversion: 1.0.0\ncategory: paper-reading\ntype: sop\n---\n\n# Real\n")
    tactic = _write_skill(tmp_dir, "my-tactic", "---\nname: my-tactic\ndescription: A tactic.\nversion: 1.0.0\ncategory: paper-reading\ntype: tactic\ndependencies:\n  sops:\n  - real-sop\n---\n\n# Tactic\n")
    assert validate_skill(tactic, skills_root=os.path.join(tmp_dir, "skills")) == []


def test_tactic_with_dangling_sop_is_an_error(tmp_dir):
    tactic = _write_skill(tmp_dir, "my-tactic", "---\nname: my-tactic\ndescription: A tactic.\nversion: 1.0.0\ncategory: paper-reading\ntype: tactic\ndependencies:\n  sops:\n  - no-such-sop\n---\n\n# Tactic\n")
    errors = validate_skill(tactic, skills_root=os.path.join(tmp_dir, "skills"))
    assert any("no-such-sop" in e for e in errors)


def test_tactic_without_dependencies_is_an_error(tmp_dir):
    tactic = _write_skill(tmp_dir, "empty-tactic", "---\nname: empty-tactic\ndescription: A tactic.\nversion: 1.0.0\ncategory: paper-reading\ntype: tactic\n---\n\n# Tactic\n")
    errors = validate_skill(tactic, skills_root=os.path.join(tmp_dir, "skills"))
    assert any("dependencies" in e for e in errors)
