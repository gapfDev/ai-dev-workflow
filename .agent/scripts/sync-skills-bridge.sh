#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SOURCE_DIR="$REPO_ROOT/.agent/skills"
DEST_DIR="${CODEX_HOME:-$HOME/.codex}/skills"
MODE="link"
PRUNE_STALE=false

usage() {
  cat <<'USAGE'
Usage:
  sync-skills-bridge.sh [--mode link|copy] [--source <dir>] [--dest <dir>] [--prune]

Options:
  --mode link|copy   Sync strategy. Default: link.
  --source <dir>     Source skills directory. Default: <repo>/.agent/skills.
  --dest <dir>       Target skills directory. Default: ${CODEX_HOME:-$HOME/.codex}/skills.
  --prune            Remove stale bridge artifacts created from source.
  --help             Show this help message.
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --mode)
      MODE="${2:-}"
      shift 2
      ;;
    --source)
      SOURCE_DIR="${2:-}"
      shift 2
      ;;
    --dest)
      DEST_DIR="${2:-}"
      shift 2
      ;;
    --prune)
      PRUNE_STALE=true
      shift
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "ERROR: unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ "$MODE" != "link" && "$MODE" != "copy" ]]; then
  echo "ERROR: --mode must be link or copy. Got: $MODE" >&2
  exit 1
fi

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "ERROR: source skills directory not found: $SOURCE_DIR" >&2
  exit 1
fi

mkdir -p "$DEST_DIR"

created=0
updated=0
skipped=0
conflicts=0
pruned=0

sync_link() {
  local skill_dir="$1"
  local target="$2"
  local skill_name="$3"

  if [[ -L "$target" ]]; then
    local current
    current="$(readlink "$target")"
    if [[ "$current" == "$skill_dir" ]]; then
      skipped=$((skipped + 1))
      echo "OK    $skill_name"
    else
      ln -sfn "$skill_dir" "$target"
      updated=$((updated + 1))
      echo "FIX   $skill_name (retargeted symlink)"
    fi
  elif [[ -e "$target" ]]; then
    conflicts=$((conflicts + 1))
    echo "WARN  $skill_name (destination exists and is not a symlink): $target"
  else
    ln -s "$skill_dir" "$target"
    created=$((created + 1))
    echo "ADD   $skill_name"
  fi
}

sync_copy() {
  local skill_dir="$1"
  local target="$2"
  local skill_name="$3"
  local marker_file="$target/.skill-bridge-source"
  local existed_before=false

  if [[ -L "$target" ]]; then
    rm -f "$target"
  elif [[ -e "$target" && ! -d "$target" ]]; then
    conflicts=$((conflicts + 1))
    echo "WARN  $skill_name (destination exists and is not a directory): $target"
    return
  elif [[ -d "$target" ]]; then
    existed_before=true
  fi

  mkdir -p "$target"
  if command -v rsync >/dev/null 2>&1; then
    rsync -a --delete --exclude '.skill-bridge-source' "$skill_dir/" "$target/"
  else
    find "$target" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
    cp -R "$skill_dir"/. "$target"/
  fi

  printf '%s\n' "$skill_dir" > "$marker_file"
  if [[ -e "$target/SKILL.md" ]]; then
    if [[ "$existed_before" == true ]]; then
      updated=$((updated + 1))
      echo "SYNC  $skill_name (copied)"
    else
      created=$((created + 1))
      echo "ADD   $skill_name (copied)"
    fi
  fi
}

while IFS= read -r -d '' skill_dir; do
  skill_name="$(basename "$skill_dir")"
  [[ "$skill_name" == ".DS_Store" ]] && continue

  if [[ ! -f "$skill_dir/SKILL.md" ]]; then
    skipped=$((skipped + 1))
    echo "SKIP  $skill_name (missing SKILL.md)"
    continue
  fi

  target="$DEST_DIR/$skill_name"
  if [[ "$MODE" == "link" ]]; then
    sync_link "$skill_dir" "$target" "$skill_name"
  else
    sync_copy "$skill_dir" "$target" "$skill_name"
  fi
done < <(find "$SOURCE_DIR" -mindepth 1 -maxdepth 1 -type d -print0)

if [[ "$PRUNE_STALE" == true ]]; then
  if [[ "$MODE" == "link" ]]; then
    while IFS= read -r -d '' link; do
      target_path="$(readlink "$link" || true)"
      if [[ "$target_path" == "$SOURCE_DIR"/* ]] && [[ ! -d "$target_path" ]]; then
        rm -f "$link"
        pruned=$((pruned + 1))
        echo "PRUNE $(basename "$link")"
      fi
    done < <(find "$DEST_DIR" -mindepth 1 -maxdepth 1 -type l -print0)
  else
    while IFS= read -r -d '' dir; do
      marker_file="$dir/.skill-bridge-source"
      [[ ! -f "$marker_file" ]] && continue
      src_path="$(cat "$marker_file" || true)"
      if [[ "$src_path" == "$SOURCE_DIR"/* ]] && [[ ! -d "$src_path" ]]; then
        rm -rf "$dir"
        pruned=$((pruned + 1))
        echo "PRUNE $(basename "$dir")"
      fi
    done < <(find "$DEST_DIR" -mindepth 1 -maxdepth 1 -type d -print0)
  fi
fi

echo
echo "Summary: mode=$MODE created=$created updated=$updated skipped=$skipped conflicts=$conflicts pruned=$pruned"
echo "Bridge source: $SOURCE_DIR"
echo "Bridge target: $DEST_DIR"
