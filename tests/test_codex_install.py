import subprocess
import tempfile
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
INSTALLER = REPO_ROOT / "install" / "codex.sh"
BEGIN_MARKER = "<!-- BEGIN DARE RESEARCH ENGINE -->"
END_MARKER = "<!-- END DARE RESEARCH ENGINE -->"


def _shell_can_symlink() -> bool:
    """Whether the `sh` on PATH can produce a real directory symlink.

    Git Bash with MSYS unset exits 0 from `ln -s` while copying the
    directory, so probe the behaviour instead of the exit status.
    """
    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)
        (root / "src").mkdir()
        probe = 'ln -s "$1/src" "$1/dst" 2>/dev/null && [ -L "$1/dst" ]'
        try:
            done = subprocess.run(
                ["sh", "-c", probe, "sh", str(root)],
                capture_output=True,
                check=False,
            )
        except OSError:
            return False
        return done.returncode == 0


SHELL_CAN_SYMLINK = _shell_can_symlink()


def run_installer(target: Path, *args: str, check: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["sh", str(INSTALLER), "--target", str(target), *args],
        cwd=REPO_ROOT,
        check=check,
        capture_output=True,
        text=True,
    )


class CodexInstallTests(unittest.TestCase):
    def setUp(self) -> None:
        self._temporary_directory = tempfile.TemporaryDirectory()
        self.target = Path(self._temporary_directory.name)

    def tearDown(self) -> None:
        self._temporary_directory.cleanup()

    @unittest.skipUnless(
        SHELL_CAN_SYMLINK, "sh on this platform cannot create directory symlinks"
    )
    def test_link_install_creates_agents_entry_without_skill_adapter(self) -> None:
        result = run_installer(self.target, "--link")

        agents = self.target / "AGENTS.md"
        skills = self.target / ".dare" / "skills"
        content = agents.read_text(encoding="utf-8")
        self.assertTrue(agents.is_file())
        self.assertEqual(content.count(BEGIN_MARKER), 1)
        self.assertEqual(content.count(END_MARKER), 1)
        self.assertTrue(skills.is_symlink())
        self.assertEqual(skills.resolve(), (REPO_ROOT / "skills").resolve())
        self.assertFalse((self.target / ".agents").exists())
        self.assertIn("agents: created", result.stdout)
        self.assertIn("skills: linked", result.stdout)
        self.assertNotIn("$dare-research-engine", result.stdout)

    def test_install_preserves_existing_agents_and_is_idempotent(self) -> None:
        project_instructions = "# Project instructions\n\nKeep this line.\n"
        agents = self.target / "AGENTS.md"
        agents.write_text(project_instructions, encoding="utf-8")

        first = run_installer(self.target, "--copy")
        first_content = agents.read_text(encoding="utf-8")
        second = run_installer(self.target, "--copy")

        self.assertTrue(first_content.startswith(project_instructions.rstrip("\n")))
        self.assertIn("Keep this line.", first_content)
        self.assertEqual(first_content.count(BEGIN_MARKER), 1)
        self.assertEqual(first_content.count(END_MARKER), 1)
        self.assertEqual(agents.read_text(encoding="utf-8"), first_content)
        self.assertIn("agents: appended", first.stdout)
        self.assertIn("agents: unchanged", second.stdout)

    def test_reinstall_updates_only_managed_agents_block(self) -> None:
        agents = self.target / "AGENTS.md"
        agents.write_text("# Project instructions\n\nKeep this line.\n", encoding="utf-8")
        run_installer(self.target, "--copy")
        stale = agents.read_text(encoding="utf-8").replace(
            "Use DARE for AI Research tasks", "Use stale DARE instructions"
        )
        agents.write_text(stale, encoding="utf-8")

        result = run_installer(self.target, "--copy")
        updated = agents.read_text(encoding="utf-8")

        self.assertIn("Keep this line.", updated)
        self.assertNotIn("Use stale DARE instructions", updated)
        self.assertIn("Use DARE for AI Research tasks", updated)
        self.assertEqual(updated.count(BEGIN_MARKER), 1)
        self.assertEqual(updated.count(END_MARKER), 1)
        self.assertIn("agents: updated", result.stdout)

    def test_dry_run_reports_without_writing(self) -> None:
        result = run_installer(self.target, "--link", "--dry-run")

        self.assertFalse((self.target / "AGENTS.md").exists())
        self.assertFalse((self.target / ".dare").exists())
        self.assertIn("agents: would-create", result.stdout)
        self.assertIn("skills: would-link", result.stdout)

    def test_install_rejects_malformed_managed_block(self) -> None:
        agents = self.target / "AGENTS.md"
        agents.write_text(f"# Project instructions\n\n{BEGIN_MARKER}\n", encoding="utf-8")

        result = run_installer(self.target, "--link", check=False)

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Malformed DARE block", result.stderr)
        self.assertFalse((self.target / ".dare").exists())

    def test_install_rejects_reversed_managed_block(self) -> None:
        agents = self.target / "AGENTS.md"
        agents.write_text(
            f"# Project instructions\n\n{END_MARKER}\n{BEGIN_MARKER}\n",
            encoding="utf-8",
        )

        result = run_installer(self.target, "--link", check=False)

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("end marker must follow the begin marker", result.stderr)
        self.assertFalse((self.target / ".dare").exists())

    def test_installers_no_longer_reference_codex_skill_adapter(self) -> None:
        for relative_path in ("install/codex.sh", "install/codex.ps1"):
            with self.subTest(installer=relative_path):
                content = (REPO_ROOT / relative_path).read_text(encoding="utf-8")
                self.assertNotIn(".agents/skills", content)
                self.assertNotIn("$dare-research-engine", content)


if __name__ == "__main__":
    unittest.main()
