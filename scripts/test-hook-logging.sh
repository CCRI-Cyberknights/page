#!/bin/bash
# Test script for hook logging system
# This simulates hook execution to verify logging works

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "Testing Git Hook Logging System"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Source the logging utility
source "$PROJECT_ROOT/scripts/hook-logger.sh" "pre-commit"

echo "1. Testing basic logging functions..."
log_start

log "INFO" "Test info message"
log "WARN" "Test warning message"
log "ERROR" "Test error message"
log "DEBUG" "Test debug message (should only show if GIT_HOOK_DEBUG=1)"

log_with_context "INFO" "Test message with context"

# Simulate some operations
echo ""
echo "2. Testing log file creation..."
if [ -f "$LOG_FILE" ]; then
  echo "✅ Log file created: $LOG_FILE"
  echo ""
  echo "Log file contents:"
  echo "───────────────────────────────────────────────────────────────"
  cat "$LOG_FILE"
  echo ""
  echo "───────────────────────────────────────────────────────────────"
else
  echo "❌ Log file not created!"
  exit 1
fi

# Test log end
log_end 0

echo ""
echo "3. Testing log file after completion..."
if [ -f "$LOG_FILE" ]; then
  echo "✅ Log file still exists"
  echo ""
  echo "Final log file contents:"
  echo "───────────────────────────────────────────────────────────────"
  cat "$LOG_FILE"
  echo ""
  echo "───────────────────────────────────────────────────────────────"
  
  # Count log entries
  entry_count=$(wc -l < "$LOG_FILE" | tr -d ' ')
  echo "Total log entries: $entry_count"
else
  echo "❌ Log file missing after completion!"
  exit 1
fi

echo ""
echo "4. Testing log viewer script..."
if [ -f "$PROJECT_ROOT/scripts/view-hook-logs.sh" ]; then
  echo "✅ Log viewer script exists"
  echo ""
  echo "Running log viewer..."
  echo "───────────────────────────────────────────────────────────────"
  "$PROJECT_ROOT/scripts/view-hook-logs.sh" pre-commit -l 1
else
  echo "❌ Log viewer script not found!"
  exit 1
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "✅ All logging tests passed!"
echo ""
echo "Log file location: $LOG_FILE"
echo "View logs with: ./scripts/view-hook-logs.sh pre-commit"

