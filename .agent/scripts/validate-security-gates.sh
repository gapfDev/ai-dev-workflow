#!/usr/bin/env bash
set -euo pipefail

ROOT="."
THREAT_MODEL=""
BACKLOG=""
REVIEW_REPORT=""
RELEASE_SIGNOFF=""
THREAT_ID_PREFIX="THR-"
FINDING_ID_PREFIX="SEC-"

usage() {
  cat <<'USAGE'
Usage:
  validate-security-gates.sh [--root <dir>] [--threat-model <file>] [--backlog <file>] [--review <file>] [--signoff <file>] [--threat-prefix <prefix>] [--finding-prefix <prefix>]

Defaults (relative to --root):
  SECURITY_THREAT_MODEL.md
  SECURITY_BACKLOG.md
  SECURITY_REVIEW_REPORT.md
  SECURITY_RELEASE_SIGNOFF.md

Defaults (ID prefixes):
  threat-prefix: THR-
  finding-prefix: SEC-
USAGE
}

trim() {
  local s="${1:-}"
  s="${s#"${s%%[![:space:]]*}"}"
  s="${s%"${s##*[![:space:]]}"}"
  printf '%s' "$s"
}

upper() {
  printf '%s' "${1:-}" | tr '[:lower:]' '[:upper:]'
}

is_missing_value() {
  local v
  v="$(trim "${1:-}")"
  [[ -z "$v" || "$v" == "-" || "$v" == "[owner]" || "$v" == "[YYYY-MM-DD]" || "$v" == "TBD" || "$v" == "[0]" || "$v" == "[N]" || "$v" == "[GO/NO-GO]" || "$v" == "[PASS/FAIL]" ]]
}

assert_file_exists() {
  local f="$1"
  if [[ ! -f "$f" ]]; then
    echo "FAIL: missing required file: $f"
    return 1
  fi
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --root)
      ROOT="${2:-}"
      shift 2
      ;;
    --threat-model)
      THREAT_MODEL="${2:-}"
      shift 2
      ;;
    --backlog)
      BACKLOG="${2:-}"
      shift 2
      ;;
    --review)
      REVIEW_REPORT="${2:-}"
      shift 2
      ;;
    --signoff)
      RELEASE_SIGNOFF="${2:-}"
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    --threat-prefix)
      THREAT_ID_PREFIX="${2:-}"
      shift 2
      ;;
    --finding-prefix)
      FINDING_ID_PREFIX="${2:-}"
      shift 2
      ;;
    *)
      echo "ERROR: unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$THREAT_MODEL" ]]; then
  THREAT_MODEL="$ROOT/SECURITY_THREAT_MODEL.md"
fi
if [[ -z "$BACKLOG" ]]; then
  BACKLOG="$ROOT/SECURITY_BACKLOG.md"
fi
if [[ -z "$REVIEW_REPORT" ]]; then
  REVIEW_REPORT="$ROOT/SECURITY_REVIEW_REPORT.md"
fi
if [[ -z "$RELEASE_SIGNOFF" ]]; then
  RELEASE_SIGNOFF="$ROOT/SECURITY_RELEASE_SIGNOFF.md"
fi

failures=0

echo "== Security Gate Validation =="
echo "Root: $ROOT"

assert_file_exists "$THREAT_MODEL" || failures=$((failures + 1))
assert_file_exists "$BACKLOG" || failures=$((failures + 1))
assert_file_exists "$REVIEW_REPORT" || failures=$((failures + 1))
assert_file_exists "$RELEASE_SIGNOFF" || failures=$((failures + 1))

if [[ "$failures" -gt 0 ]]; then
  echo "Validation stopped: missing required files."
  exit 1
fi

# Gate A decision must be PASS.
if ! grep -Eq '^Gate A Decision:[[:space:]]*PASS[[:space:]]*$' "$THREAT_MODEL"; then
  echo "FAIL: Gate A decision is not PASS in $THREAT_MODEL"
  failures=$((failures + 1))
else
  echo "PASS: Gate A decision"
fi

# Parse threat register in SECURITY_THREAT_MODEL.md
while IFS= read -r line; do
  [[ "$line" =~ ^\|[[:space:]]*${THREAT_ID_PREFIX} ]] || continue
  # table format: | ID | Component | Threat | Severity | Mitigation | Owner | Due Date | Status |
  IFS='|' read -r _ c_id c_component c_threat c_sev c_mitigation c_owner c_due c_status _ <<< "$line"
  id="$(trim "$c_id")"
  sev="$(trim "$c_sev")"
  owner="$(trim "$c_owner")"
  due="$(trim "$c_due")"
  status="$(trim "$c_status")"

  upper_sev="$(upper "$sev")"
  upper_status="$(upper "$status")"

  if [[ "$upper_sev" == "P0" || "$upper_sev" == "P1" ]]; then
    if [[ "$upper_status" == "OPEN" || "$upper_status" == "ACCEPTED" ]]; then
      echo "FAIL: $id has invalid status for $upper_sev in threat model (status=$status)"
      failures=$((failures + 1))
    fi
  fi

  if [[ "$upper_status" == "ACCEPTED" ]]; then
    if [[ "$upper_sev" == "P0" || "$upper_sev" == "P1" ]]; then
      echo "FAIL: $id has invalid ACCEPTED status for $upper_sev in threat model"
      failures=$((failures + 1))
    fi
    if is_missing_value "$owner" || is_missing_value "$due"; then
      echo "FAIL: $id accepted risk missing owner or due date in threat model"
      failures=$((failures + 1))
    fi
  fi
done < "$THREAT_MODEL"

# Gate B decision must be PASS.
if ! grep -Eq '^Gate B Decision:[[:space:]]*PASS[[:space:]]*$' "$REVIEW_REPORT"; then
  echo "FAIL: Gate B decision is not PASS in $REVIEW_REPORT"
  failures=$((failures + 1))
else
  echo "PASS: Gate B decision"
fi

# Final release decision must be GO.
if ! grep -Eq '^Final Decision:[[:space:]]*GO[[:space:]]*$' "$RELEASE_SIGNOFF"; then
  echo "FAIL: Final Decision is not GO in $RELEASE_SIGNOFF"
  failures=$((failures + 1))
else
  echo "PASS: Gate C final decision"
fi

# Parse findings in SECURITY_REVIEW_REPORT.md
while IFS= read -r line; do
  [[ "$line" =~ ^\|[[:space:]]*${FINDING_ID_PREFIX} ]] || continue
  # table format: | ID | Severity | Finding | Status | Owner | Due Date | Notes |
  IFS='|' read -r _ c_id c_sev c_find c_status c_owner c_due c_notes _ <<< "$line"
  id="$(trim "$c_id")"
  sev="$(trim "$c_sev")"
  status="$(trim "$c_status")"
  owner="$(trim "$c_owner")"
  due="$(trim "$c_due")"

  upper_sev="$(upper "$sev")"
  upper_status="$(upper "$status")"

  if [[ "$upper_sev" == "P0" || "$upper_sev" == "P1" ]]; then
    if [[ "$upper_status" != "FIXED" && "$upper_status" != "FALSE_POSITIVE" ]]; then
      echo "FAIL: $id has unresolved $upper_sev in review report (status=$status)"
      failures=$((failures + 1))
    fi
  fi

  if [[ "$upper_status" == "ACCEPTED" ]]; then
    if [[ "$upper_sev" == "P0" || "$upper_sev" == "P1" ]]; then
      echo "FAIL: $id has invalid ACCEPTED status for $upper_sev in review report"
      failures=$((failures + 1))
    fi
    if is_missing_value "$owner" || is_missing_value "$due"; then
      echo "FAIL: $id accepted risk missing owner or due date in review report"
      failures=$((failures + 1))
    fi
  fi
done < "$REVIEW_REPORT"

# Parse accepted risks in SECURITY_BACKLOG.md
while IFS= read -r line; do
  [[ "$line" =~ ^\|[[:space:]]*${FINDING_ID_PREFIX} ]] || continue
  # table format: | ID | Severity | Risk/Requirement | Status | Owner | Due Date | ... |
  IFS='|' read -r _ c_id c_sev c_risk c_status c_owner c_due c_tail _ <<< "$line"
  id="$(trim "$c_id")"
  sev="$(trim "$c_sev")"
  status="$(trim "$c_status")"
  owner="$(trim "$c_owner")"
  due="$(trim "$c_due")"

  upper_sev="$(upper "$sev")"
  upper_status="$(upper "$status")"

  if [[ "$upper_status" == "ACCEPTED" ]]; then
    if [[ "$upper_sev" == "P0" || "$upper_sev" == "P1" ]]; then
      echo "FAIL: $id has invalid ACCEPTED status for $upper_sev in security backlog"
      failures=$((failures + 1))
    fi
    if is_missing_value "$owner" || is_missing_value "$due"; then
      echo "FAIL: $id accepted risk missing owner or due date in security backlog"
      failures=$((failures + 1))
    fi
  fi
done < "$BACKLOG"

# Open P0/P1 counts must be explicit zeros in signoff.
open_p0="$(grep -E '^Open P0 Findings:' "$RELEASE_SIGNOFF" | head -n1 | cut -d: -f2- | xargs || true)"
open_p1="$(grep -E '^Open P1 Findings:' "$RELEASE_SIGNOFF" | head -n1 | cut -d: -f2- | xargs || true)"

if is_missing_value "$open_p0" || ! [[ "$open_p0" =~ ^[0-9]+$ ]] || [[ "$open_p0" -ne 0 ]]; then
  echo "FAIL: Open P0 Findings must be numeric 0 (found: ${open_p0:-<missing>})"
  failures=$((failures + 1))
else
  echo "PASS: Open P0 findings = 0"
fi

if is_missing_value "$open_p1" || ! [[ "$open_p1" =~ ^[0-9]+$ ]] || [[ "$open_p1" -ne 0 ]]; then
  echo "FAIL: Open P1 Findings must be numeric 0 (found: ${open_p1:-<missing>})"
  failures=$((failures + 1))
else
  echo "PASS: Open P1 findings = 0"
fi

echo
if [[ "$failures" -gt 0 ]]; then
  echo "Security gate validation FAILED ($failures issue(s))."
  exit 1
fi

echo "Security gate validation PASSED."
