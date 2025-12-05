#!/bin/bash
# Git Hook Logging Utility - Best Practices Implementation
# Provides structured logging for git hooks with contextual information

# Configuration
HOOK_LOG_DIR=".git/hook-logs"
MAX_LOG_FILES=50  # Keep last 50 log files
LOG_RETENTION_DAYS=7  # Keep logs for 7 days

# Initialize logging directory
mkdir -p "$HOOK_LOG_DIR"

# Get hook name from script path or default to pre-commit
HOOK_NAME="${1:-pre-commit}"

# Get commit information
COMMIT_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
COMMIT_FULL=$(git rev-parse HEAD 2>/dev/null || echo "unknown")
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
USER_NAME=$(git config user.name 2>/dev/null || echo "${USER:-unknown}")
USER_EMAIL=$(git config user.email 2>/dev/null || echo "unknown")

# Create log file with timestamp and commit hash
TIMESTAMP=$(date -u +"%Y-%m-%dT%H-%M-%S")
LOG_FILE="$HOOK_LOG_DIR/${HOOK_NAME}-${TIMESTAMP}-${COMMIT_HASH}.log"

# Track start time for duration calculation
START_TIME=$(date +%s.%N 2>/dev/null || date +%s)

# Log rotation function
rotate_logs() {
  # Remove old log files (by count)
  if [ -d "$HOOK_LOG_DIR" ]; then
    find "$HOOK_LOG_DIR" -name "${HOOK_NAME}-*.log" -type f | sort -r | tail -n +$((MAX_LOG_FILES + 1)) | xargs rm -f 2>/dev/null
    
    # Remove old log files (by age)
    if command -v find >/dev/null 2>&1; then
      find "$HOOK_LOG_DIR" -name "${HOOK_NAME}-*.log" -type f -mtime +${LOG_RETENTION_DAYS} -delete 2>/dev/null
    fi
  fi
}

# Structured logging function
log() {
  local level="${1:-INFO}"
  shift
  local message="$*"
  local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ" 2>/dev/null || date -u +"%Y-%m-%dT%H:%M:%SZ")
  local duration="null"
  
  # Calculate duration if this is a completion log
  if [ "$level" = "COMPLETE" ]; then
    local end_time=$(date +%s.%N 2>/dev/null || date +%s)
    if command -v bc >/dev/null 2>&1; then
      duration=$(echo "$end_time - $START_TIME" | bc 2>/dev/null | xargs printf "%.3f" 2>/dev/null || echo "null")
    else
      duration="null"
    fi
  fi
  
  # Escape JSON special characters in message
  local escaped_message=$(echo "$message" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | tr '\n' ' ' | sed 's/[[:space:]]*$//')
  
  # Create structured log entry (JSON)
  local log_entry="{\"timestamp\":\"$timestamp\",\"hook\":\"$HOOK_NAME\",\"commit\":\"$COMMIT_HASH\",\"commitFull\":\"$COMMIT_FULL\",\"level\":\"$level\",\"message\":\"$escaped_message\",\"duration\":$duration}"
  
  # Write to log file
  echo "$log_entry" >> "$LOG_FILE"
  
  # Also output to stderr for immediate visibility (formatted for human reading)
  case "$level" in
    ERROR)
      echo "[ERROR] $message" >&2
      ;;
    WARN)
      echo "[WARN]  $message" >&2
      ;;
    DEBUG)
      if [ "${GIT_HOOK_DEBUG:-0}" = "1" ]; then
        echo "[DEBUG] $message" >&2
      fi
      ;;
    *)
      echo "[$level] $message" >&2
      ;;
  esac
}

# Log with context (adds additional fields)
log_with_context() {
  local level="${1:-INFO}"
  shift
  local message="$*"
  local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ" 2>/dev/null || date -u +"%Y-%m-%dT%H:%M:%SZ")
  
  # Gather context
  local staged_files=$(git diff --cached --name-only 2>/dev/null | tr '\n' ',' | sed 's/,$//' || echo "none")
  local env_husky="${HUSKY:-unset}"
  local env_debug="${GIT_HOOK_DEBUG:-unset}"
  
  # Escape JSON special characters
  local escaped_message=$(echo "$message" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | tr '\n' ' ' | sed 's/[[:space:]]*$//')
  local escaped_files=$(echo "$staged_files" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g')
  
  # Create structured log entry with context
  local log_entry="{\"timestamp\":\"$timestamp\",\"hook\":\"$HOOK_NAME\",\"commit\":\"$COMMIT_HASH\",\"commitFull\":\"$COMMIT_FULL\",\"level\":\"$level\",\"message\":\"$escaped_message\",\"context\":{\"branch\":\"$BRANCH\",\"user\":\"$USER_NAME\",\"email\":\"$USER_EMAIL\",\"stagedFiles\":\"$escaped_files\",\"environment\":{\"HUSKY\":\"$env_husky\",\"GIT_HOOK_DEBUG\":\"$env_debug\"}}}"
  
  echo "$log_entry" >> "$LOG_FILE"
  
  # Output formatted message
  log "$level" "$message"
}

# Log hook start
log_start() {
  log_with_context "INFO" "Hook execution started"
  log "DEBUG" "Working directory: $(pwd)"
  log "DEBUG" "Git hooks path: $(git config core.hooksPath 2>/dev/null || echo 'default')"
}

# Log hook end (success or failure)
log_end() {
  local exit_code="${1:-0}"
  local status="SUCCESS"
  
  if [ "$exit_code" -ne 0 ]; then
    status="FAILED"
    log "ERROR" "Hook execution failed with exit code: $exit_code"
  else
    log "COMPLETE" "Hook execution completed successfully"
  fi
  
  # Final log with exit code
  local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ" 2>/dev/null || date -u +"%Y-%m-%dT%H:%M:%SZ")
  local end_time=$(date +%s.%N 2>/dev/null || date +%s)
  local duration="null"
  
  if command -v bc >/dev/null 2>&1; then
    duration=$(echo "$end_time - $START_TIME" | bc 2>/dev/null | xargs printf "%.3f" 2>/dev/null || echo "null")
  fi
  
  local log_entry="{\"timestamp\":\"$timestamp\",\"hook\":\"$HOOK_NAME\",\"commit\":\"$COMMIT_HASH\",\"level\":\"COMPLETE\",\"message\":\"Hook execution $status\",\"duration\":$duration,\"exitCode\":$exit_code}"
  echo "$log_entry" >> "$LOG_FILE"
  
  # Rotate logs after writing
  rotate_logs
  
  echo "" >&2
  echo "📋 Hook log: $LOG_FILE" >&2
}

# Export functions for use in hooks
export -f log
export -f log_with_context
export -f log_start
export -f log_end
export LOG_FILE
export HOOK_NAME

# If sourced, log file is ready
# If executed directly, show usage
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
  echo "Git Hook Logging Utility"
  echo "Usage: source this script in your git hook"
  echo "Example: source scripts/hook-logger.sh pre-commit"
  exit 0
fi

