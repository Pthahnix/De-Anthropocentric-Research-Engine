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
    content = "---\nname: example-skill\ndescription: Does a thing.\n---\n\n# Example\n\nBody.\n"
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
