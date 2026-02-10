#!/usr/bin/env bash
# ────────────────────────────────────────────────────────────
# capture.sh — Create a content vault entry
#
# Usage:
#   capture "Apiary conference talk" --type talk --pillar technical
#   capture "GDPR ontology v3"       --type deep_work --pillar governance
#   capture "On swimming and systems" --type blog --pillar personal
#   capture                           (interactive mode)
#
# The script creates a dated markdown file in the vault/
# directory with front matter, then opens it in your editor
# so you can paste the raw material.
# ────────────────────────────────────────────────────────────

set -euo pipefail

# ── Config ──────────────────────────────────────────────────

# Find the content-vault root (walk up from script location)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VAULT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
VAULT_DIR="$VAULT_ROOT/vault"

# Editor preference: VISUAL > EDITOR > sensible defaults
EDIT="${VISUAL:-${EDITOR:-code}}"

# Valid options
VALID_TYPES=("conference_talk" "deep_work" "blog" "side_project")
VALID_PILLARS=("technical_deep_dive" "data_philosophy" "governance_architect" "personal" "conference")

# ── Helpers ─────────────────────────────────────────────────

usage() {
  cat <<EOF
Usage: capture [title] [options]

Options:
  --type, -t      Source type: conference_talk, deep_work, blog, side_project
  --pillar, -p    Content pillar: technical_deep_dive, data_philosophy,
                  governance_architect, personal, conference
  --file, -f      Import content from a file instead of opening editor
  --no-edit       Create the entry without opening an editor
  --help, -h      Show this help

Examples:
  capture "Apiary conference talk" -t conference_talk -p technical_deep_dive
  capture "GDPR ontology" --type deep_work --pillar governance_architect
  capture "On letting go" -t blog -p data_philosophy -f ~/drafts/letting-go.md
  capture  (interactive mode — prompts for everything)
EOF
  exit 0
}

slugify() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//;s/-$//'
}

validate_option() {
  local value="$1"
  shift
  local valid=("$@")
  for v in "${valid[@]}"; do
    [[ "$value" == "$v" ]] && return 0
  done
  return 1
}

prompt_select() {
  local prompt="$1"
  shift
  local options=("$@")
  echo "$prompt" >&2
  for i in "${!options[@]}"; do
    echo "  $((i+1)). ${options[$i]}" >&2
  done
  while true; do
    read -rp "  > " choice
    if [[ "$choice" =~ ^[0-9]+$ ]] && (( choice >= 1 && choice <= ${#options[@]} )); then
      echo "${options[$((choice-1))]}"
      return
    fi
    echo "  Invalid choice. Enter a number 1-${#options[@]}." >&2
  done
}

# ── Parse arguments ─────────────────────────────────────────

TITLE=""
TYPE=""
PILLAR=""
IMPORT_FILE=""
NO_EDIT=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --type|-t)    TYPE="$2"; shift 2 ;;
    --pillar|-p)  PILLAR="$2"; shift 2 ;;
    --file|-f)    IMPORT_FILE="$2"; shift 2 ;;
    --no-edit)    NO_EDIT=true; shift ;;
    --help|-h)    usage ;;
    -*)           echo "Unknown option: $1" >&2; usage ;;
    *)            TITLE="$1"; shift ;;
  esac
done

# ── Interactive mode for missing fields ─────────────────────

if [[ -z "$TITLE" ]]; then
  read -rp "Title: " TITLE
  [[ -z "$TITLE" ]] && { echo "Title is required." >&2; exit 1; }
fi

if [[ -z "$TYPE" ]]; then
  TYPE=$(prompt_select "Source type:" "${VALID_TYPES[@]}")
fi

if [[ -z "$PILLAR" ]]; then
  PILLAR=$(prompt_select "Content pillar:" "${VALID_PILLARS[@]}")
fi

# ── Validate ────────────────────────────────────────────────

if ! validate_option "$TYPE" "${VALID_TYPES[@]}"; then
  echo "Invalid type: $TYPE" >&2
  echo "Valid types: ${VALID_TYPES[*]}" >&2
  exit 1
fi

if ! validate_option "$PILLAR" "${VALID_PILLARS[@]}"; then
  echo "Invalid pillar: $PILLAR" >&2
  echo "Valid pillars: ${VALID_PILLARS[*]}" >&2
  exit 1
fi

# ── Create vault entry ──────────────────────────────────────

DATE=$(date +%Y-%m-%d)
SLUG=$(slugify "$TITLE")
FILENAME="${DATE}-${SLUG}.md"
FILEPATH="$VAULT_DIR/$FILENAME"

mkdir -p "$VAULT_DIR"

# Don't overwrite existing entries
if [[ -f "$FILEPATH" ]]; then
  echo "Entry already exists: $FILEPATH" >&2
  echo "Opening existing entry..." >&2
  $EDIT "$FILEPATH"
  exit 0
fi

# Build the file
cat > "$FILEPATH" <<FRONTMATTER
---
source_type: ${TYPE}
title: "${TITLE}"
date: ${DATE}
pillar: ${PILLAR}
status: captured
atoms_extracted: false
---

# ${TITLE}

## Context

<!-- What were you working on? What prompted this? -->


## Raw Material

<!-- Paste the source material below: slide text, speaker notes,
     design doc, blog draft, code snippets, journal entry —
     whatever the raw thinking is. Don't edit it. Just capture. -->

FRONTMATTER

# Import from file if provided
if [[ -n "$IMPORT_FILE" ]]; then
  if [[ -f "$IMPORT_FILE" ]]; then
    echo "" >> "$FILEPATH"
    cat "$IMPORT_FILE" >> "$FILEPATH"
    echo "Imported content from: $IMPORT_FILE" >&2
  else
    echo "Warning: Import file not found: $IMPORT_FILE" >&2
  fi
fi

echo "✓ Created: $FILEPATH" >&2

# Open in editor unless told not to
if [[ "$NO_EDIT" == false ]]; then
  $EDIT "$FILEPATH"
fi
