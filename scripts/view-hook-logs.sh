#!/bin/bash
# Git Hook Log Viewer - View and analyze hook execution logs
# Usage: ./scripts/view-hook-logs.sh [options]

HOOK_LOG_DIR=".git/hook-logs"
HOOK_NAME="${1:-pre-commit}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

show_usage() {
  cat << EOF
Git Hook Log Viewer

Usage: $0 [options] [hook-name]

Options:
  -a, --all          Show all logs (not just last)
  -e, --errors       Show only errors
  -w, --warnings     Show warnings and errors
  -d, --debug        Show debug logs (requires GIT_HOOK_DEBUG=1 in logs)
  -l, --last N       Show last N executions (default: 1)
  -f, --follow       Follow log file (like tail -f)
  -s, --stats        Show execution statistics
  -h, --help         Show this help message

Hook names:
  pre-commit (default)
  pre-push
  etc.

Examples:
  $0                    # Show last pre-commit execution
  $0 -l 5               # Show last 5 pre-commit executions
  $0 -e                 # Show only errors
  $0 -s                 # Show statistics
  $0 pre-push           # View pre-push logs

EOF
}

# Parse JSON log entry (simple parser)
parse_json() {
  local json="$1"
  local field="$2"
  
  # Extract field value (handles simple JSON)
  echo "$json" | grep -o "\"$field\":\"[^\"]*\"" | sed "s/\"$field\":\"\(.*\)\"/\1/"
}

# Format log entry for display
format_log_entry() {
  local json="$1"
  local timestamp=$(parse_json "$json" "timestamp")
  local level=$(parse_json "$json" "level")
  local message=$(parse_json "$json" "message")
  local commit=$(parse_json "$json" "commit")
  local duration=$(parse_json "$json" "duration")
  local exit_code=$(parse_json "$json" "exitCode")
  
  # Format timestamp (simplify for display)
  local time_display=$(echo "$timestamp" | sed 's/T/ /' | sed 's/\.[0-9]*Z//')
  
  # Color code by level
  case "$level" in
    ERROR)
      echo -e "${RED}[ERROR]${NC} $time_display | $commit | $message"
      ;;
    WARN)
      echo -e "${YELLOW}[WARN]${NC}  $time_display | $commit | $message"
      ;;
    DEBUG)
      echo -e "${BLUE}[DEBUG]${NC} $time_display | $commit | $message"
      ;;
    COMPLETE)
      if [ -n "$exit_code" ] && [ "$exit_code" != "null" ] && [ "$exit_code" != "0" ]; then
        echo -e "${RED}[COMPLETE]${NC} $time_display | Duration: ${duration}s | Exit: $exit_code | FAILED"
      else
        echo -e "${GREEN}[COMPLETE]${NC} $time_display | Duration: ${duration}s | SUCCESS"
      fi
      ;;
    *)
      echo "[$level] $time_display | $commit | $message"
      ;;
  esac
}

# Show last N executions
show_last_executions() {
  local count="${1:-1}"
  local filter="${2:-}"
  
  if [ ! -d "$HOOK_LOG_DIR" ]; then
    echo "No hook logs directory found: $HOOK_LOG_DIR"
    return 1
  fi
  
  # Get log files sorted by time (newest first)
  local log_files=$(find "$HOOK_LOG_DIR" -name "${HOOK_NAME}-*.log" -type f -printf '%T@ %p\n' 2>/dev/null | sort -rn | head -n "$count" | cut -d' ' -f2-)
  
  if [ -z "$log_files" ]; then
    echo "No log files found for hook: $HOOK_NAME"
    return 1
  fi
  
  echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
  echo -e "${BLUE}Hook Log Viewer: $HOOK_NAME${NC}"
  echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
  echo ""
  
  local file_count=0
  while IFS= read -r log_file; do
    if [ ! -f "$log_file" ]; then
      continue
    fi
    
    file_count=$((file_count + 1))
    echo -e "${YELLOW}Log File $file_count: $(basename "$log_file")${NC}"
    echo -e "${YELLOW}───────────────────────────────────────────────────────────────${NC}"
    
    # Read and display log entries
    while IFS= read -r line; do
      if [ -z "$line" ]; then
        continue
      fi
      
      # Filter by level if requested
      if [ -n "$filter" ]; then
        case "$filter" in
          error)
            if ! echo "$line" | grep -q '"level":"ERROR"'; then
              continue
            fi
            ;;
          warn)
            if ! echo "$line" | grep -q '"level":"\(WARN\|ERROR\)"'; then
              continue
            fi
            ;;
          debug)
            if ! echo "$line" | grep -q '"level":"DEBUG"'; then
              continue
            fi
            ;;
        esac
      fi
      
      format_log_entry "$line"
    done < "$log_file"
    
    echo ""
  done <<< "$log_files"
  
  echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
}

# Show statistics
show_statistics() {
  if [ ! -d "$HOOK_LOG_DIR" ]; then
    echo "No hook logs directory found: $HOOK_LOG_DIR"
    return 1
  fi
  
  local log_files=$(find "$HOOK_LOG_DIR" -name "${HOOK_NAME}-*.log" -type f)
  
  if [ -z "$log_files" ]; then
    echo "No log files found for hook: $HOOK_NAME"
    return 1
  fi
  
  echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
  echo -e "${BLUE}Hook Execution Statistics: $HOOK_NAME${NC}"
  echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
  echo ""
  
  local total_executions=0
  local successful_executions=0
  local failed_executions=0
  local total_duration=0
  local avg_duration=0
  
  while IFS= read -r log_file; do
    total_executions=$((total_executions + 1))
    
    # Check for completion status
    local exit_code=$(grep '"level":"COMPLETE"' "$log_file" | tail -1 | parse_json "" "exitCode" || echo "0")
    
    if [ "$exit_code" = "0" ] || [ "$exit_code" = "null" ] || [ -z "$exit_code" ]; then
      successful_executions=$((successful_executions + 1))
    else
      failed_executions=$((failed_executions + 1))
    fi
    
    # Get duration
    local duration=$(grep '"level":"COMPLETE"' "$log_file" | tail -1 | parse_json "" "duration" || echo "0")
    if [ -n "$duration" ] && [ "$duration" != "null" ]; then
      total_duration=$(echo "$total_duration + $duration" | bc 2>/dev/null || echo "$total_duration")
    fi
  done <<< "$log_files"
  
  if [ $total_executions -gt 0 ]; then
    avg_duration=$(echo "scale=3; $total_duration / $total_executions" | bc 2>/dev/null || echo "0")
  fi
  
  echo "Total Executions: $total_executions"
  echo -e "${GREEN}Successful: $successful_executions${NC}"
  echo -e "${RED}Failed: $failed_executions${NC}"
  
  if [ $total_executions -gt 0 ]; then
    local success_rate=$(echo "scale=1; ($successful_executions * 100) / $total_executions" | bc 2>/dev/null || echo "0")
    echo "Success Rate: ${success_rate}%"
  fi
  
  if [ -n "$avg_duration" ] && [ "$avg_duration" != "0" ]; then
    echo "Average Duration: ${avg_duration}s"
  fi
  
  echo ""
  echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
}

# Main argument parsing
case "${1:-}" in
  -h|--help)
    show_usage
    exit 0
    ;;
  -a|--all)
    show_last_executions 1000
    ;;
  -e|--errors)
    show_last_executions 10 "error"
    ;;
  -w|--warnings)
    show_last_executions 10 "warn"
    ;;
  -d|--debug)
    show_last_executions 5 "debug"
    ;;
  -l|--last)
    shift
    show_last_executions "${1:-5}"
    ;;
  -s|--stats)
    show_statistics
    ;;
  -f|--follow)
    if [ -d "$HOOK_LOG_DIR" ]; then
      latest_log=$(find "$HOOK_LOG_DIR" -name "${HOOK_NAME}-*.log" -type f -printf '%T@ %p\n' 2>/dev/null | sort -rn | head -n 1 | cut -d' ' -f2-)
      if [ -n "$latest_log" ]; then
        tail -f "$latest_log"
      else
        echo "No log files found to follow"
      fi
    fi
    ;;
  pre-commit|pre-push|*)
    if [ -n "$1" ] && [ "${1:0:1}" != "-" ]; then
      HOOK_NAME="$1"
      shift
    fi
    
    # Check for additional options
    case "${1:-}" in
      -l|--last)
        shift
        show_last_executions "${1:-5}"
        ;;
      -e|--errors)
        show_last_executions 10 "error"
        ;;
      -s|--stats)
        show_statistics
        ;;
      *)
        show_last_executions 1
        ;;
    esac
    ;;
esac

