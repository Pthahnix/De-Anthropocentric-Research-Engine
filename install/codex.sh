#!/usr/bin/env sh
set -eu

REQUIRED_ROOT_SKILL='de-anthropocentric-research-engine/SKILL.md'
REQUIRED_CATALOG_SKILL='research-catalog/SKILL.md'
AGENTS_BEGIN='<!-- BEGIN DARE RESEARCH ENGINE -->'
AGENTS_END='<!-- END DARE RESEARCH ENGINE -->'

usage() {
  cat <<'EOF'
Usage: ./install/codex.sh [options]

Install DARE project instructions and its skills knowledge base into a target project.

Options:
  --target <dir>   Project directory to install into (default: current directory)
  --copy           Copy the DARE skills knowledge base into .dare/skills
  --link           Symlink .dare/skills to this clone's skills directory
  --dry-run        Show what would change without writing files
  -h, --help       Show this help

The installer creates or updates a managed DARE block in AGENTS.md. Default
behavior copies the knowledge base so the target still works if this clone is
removed.
EOF
}

die() {
  printf 'dare-codex-install: %s\n\n' "$1" >&2
  usage >&2
  exit 1
}

abs_dir() {
  (CDPATH= cd -P "$1" 2>/dev/null && pwd) || return 1
}

same_dir() {
  left=$(abs_dir "$1") || return 1
  right=$(abs_dir "$2") || return 1
  [ "$left" = "$right" ]
}

dirname_of() {
  dirname "$1"
}

count_marker() {
  awk -v marker="$2" '$0 == marker { count++ } END { print count + 0 }' "$1"
}

markers_are_ordered() {
  awk -v begin="$AGENTS_BEGIN" -v end="$AGENTS_END" '
    $0 == begin {
      if (saw_begin || saw_end) exit 1
      saw_begin = 1
      next
    }
    $0 == end {
      if (!saw_begin || saw_end) exit 1
      saw_end = 1
    }
    END {
      if (!saw_begin || !saw_end) exit 1
    }
  ' "$1"
}

validate_skill_root() {
  root=$1
  [ -f "$root/$REQUIRED_ROOT_SKILL" ] || die "Existing skills root is not a DARE skills tree: missing $root/$REQUIRED_ROOT_SKILL"
  [ -f "$root/$REQUIRED_CATALOG_SKILL" ] || die "Existing skills root is not a DARE skills tree: missing $root/$REQUIRED_CATALOG_SKILL"
}

copy_skills() {
  source=$1
  dest=$2
  parent=$(dirname_of "$dest")
  mkdir -p "$parent"
  cp -R "$source" "$dest"
}

script_dir=$(CDPATH= cd -P "$(dirname "$0")" && pwd)
repo_root=$(CDPATH= cd -P "$script_dir/.." && pwd)
target_dir=$(pwd)
mode='copy'
dry_run=0

while [ "$#" -gt 0 ]; do
  case "$1" in
    --target)
      shift
      [ "$#" -gt 0 ] || die '--target requires a directory'
      target_dir=$1
      ;;
    --copy)
      mode='copy'
      ;;
    --link)
      mode='link'
      ;;
    --dry-run)
      dry_run=1
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      die "Unknown option: $1"
      ;;
  esac
  shift
done

case "$mode" in
  copy|link) ;;
  *) die "Invalid mode: $mode" ;;
esac

target_dir=$(abs_dir "$target_dir") || die "Target directory does not exist: $target_dir"
source_agents="$repo_root/AGENTS.md"
source_skills="$repo_root/skills"

[ -f "$source_agents" ] || die "DARE project instructions not found at $source_agents"
[ "$(count_marker "$source_agents" "$AGENTS_BEGIN")" -eq 1 ] || die "Expected exactly one DARE begin marker in $source_agents"
[ "$(count_marker "$source_agents" "$AGENTS_END")" -eq 1 ] || die "Expected exactly one DARE end marker in $source_agents"
markers_are_ordered "$source_agents" || die "The DARE end marker must follow the begin marker in $source_agents"
validate_skill_root "$source_skills"

temp_dir=$(mktemp -d "${TMPDIR:-/tmp}/dare-codex-install.XXXXXX") || die 'Could not create temporary directory'
trap 'rm -rf "$temp_dir"' EXIT HUP INT TERM
agents_block="$temp_dir/agents-block.md"
agents_candidate="$temp_dir/AGENTS.md"

awk -v begin="$AGENTS_BEGIN" -v end="$AGENTS_END" '
  $0 == begin { capture = 1 }
  capture { print }
  $0 == end { exit }
' "$source_agents" > "$agents_block"

agents_path="$target_dir/AGENTS.md"
agents_status='created'

if [ ! -e "$agents_path" ]; then
  cp "$agents_block" "$agents_candidate"
elif [ ! -f "$agents_path" ]; then
  die "AGENTS.md exists but is not a regular file: $agents_path"
else
  target_begin_count=$(count_marker "$agents_path" "$AGENTS_BEGIN")
  target_end_count=$(count_marker "$agents_path" "$AGENTS_END")

  if [ "$target_begin_count" -eq 0 ] && [ "$target_end_count" -eq 0 ]; then
    awk '{ print } END { if (NR > 0) print "" }' "$agents_path" > "$agents_candidate"
    cat "$agents_block" >> "$agents_candidate"
    agents_status='appended'
  elif [ "$target_begin_count" -eq 1 ] && [ "$target_end_count" -eq 1 ]; then
    markers_are_ordered "$agents_path" || die "Malformed DARE block in $agents_path: the end marker must follow the begin marker"
    awk -v begin="$AGENTS_BEGIN" -v end="$AGENTS_END" '
      NR == FNR { block = block $0 ORS; next }
      $0 == begin { printf "%s", block; replacing = 1; next }
      replacing && $0 == end { replacing = 0; next }
      !replacing { print }
    ' "$agents_block" "$agents_path" > "$agents_candidate"
    if cmp -s "$agents_candidate" "$agents_path"; then
      agents_status='unchanged'
    else
      agents_status='updated'
    fi
  else
    die "Malformed DARE block in $agents_path: expected one begin marker and one end marker"
  fi
fi

if [ "$dry_run" -eq 1 ]; then
  case "$agents_status" in
    created) agents_status='would-create' ;;
    appended) agents_status='would-append' ;;
    updated) agents_status='would-update' ;;
  esac
elif [ "$agents_status" != 'unchanged' ]; then
  cp "$agents_candidate" "$agents_path"
fi

skills_path="$source_skills"
skills_status='using-repo-skills'
skills_source=''
link_fallback_reason=''

if ! same_dir "$repo_root" "$target_dir"; then
  dest_skills="$target_dir/.dare/skills"
  skills_path="$dest_skills"

  if [ -e "$dest_skills" ]; then
    [ -d "$dest_skills" ] || die "Existing DARE skills path is not a directory: $dest_skills"
    validate_skill_root "$dest_skills"
    if same_dir "$source_skills" "$dest_skills"; then
      skills_status='linked-existing'
    else
      skills_status='existing-dare-skills'
    fi
  elif [ "$dry_run" -eq 1 ]; then
    if [ "$mode" = 'link' ]; then
      skills_status='would-link'
    else
      skills_status='would-copy'
    fi
  elif [ "$mode" = 'copy' ]; then
    copy_skills "$source_skills" "$dest_skills"
    skills_status='copied'
  else
    mkdir -p "$(dirname_of "$dest_skills")"
    if ln -s "$source_skills" "$dest_skills" 2>"$temp_dir/link-error"; then
      skills_status='linked'
      skills_source="$source_skills"
    else
      link_error=$(sed -n '1,20p' "$temp_dir/link-error" 2>/dev/null || true)
      if [ "$mode" = 'link' ]; then
        die "Could not create symlink $dest_skills -> $source_skills: $link_error"
      fi
      copy_skills "$source_skills" "$dest_skills"
      skills_status='copied-fallback'
      link_fallback_reason=$link_error
    fi
  fi
fi

printf 'dare-codex-install:\n'
[ "$dry_run" -eq 1 ] && printf '  dry_run: true\n'
printf '  repo: %s\n' "$repo_root"
printf '  target: %s\n' "$target_dir"
printf '  agents: %s %s\n' "$agents_status" "$agents_path"
printf '  skills: %s %s\n' "$skills_status" "$skills_path"
[ -n "$skills_source" ] && printf '  skills_source: %s\n' "$skills_source"
[ -n "$link_fallback_reason" ] && printf '  link_fallback_reason: %s\n' "$link_fallback_reason"
printf '  entry: AGENTS.md -> DARE skill root\n'
printf '  mcp: not configured by this installer\n'
