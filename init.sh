#!/bin/bash

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# PID file to track running processes
PID_FILE=".dev-pids"

# Cleanup function
cleanup() {
  echo -e "${RED}Interrupt received, cleaning up...${NC}"
  if [ -f "$PID_FILE" ]; then
    ./teardown.sh
  fi
  exit 1
}

trap cleanup INT TERM

# Check if already running
if [ -f "$PID_FILE" ]; then
  echo -e "${YELLOW}Development environment appears to be already running.${NC}"
  echo -e "${YELLOW}Run ./teardown.sh first to stop existing processes.${NC}"
  exit 1
fi

echo -e "${GREEN}Starting Firebase emulators...${NC}"

# Start Firebase emulators in background
firebase emulators:start --only auth,firestore,hosting,functions > firebase-emulators.log 2>&1 &
FIREBASE_PID=$!
echo "FIREBASE_PID=$FIREBASE_PID" > "$PID_FILE"

echo -e "${YELLOW}Waiting for emulators to be ready...${NC}"

# Function to check if a port is open
check_port() {
  nc -z 127.0.0.1 $1 2>/dev/null
  return $?
}

# Wait for the three critical services
MAX_WAIT=60
ELAPSED=0
AUTH_READY=false
FUNCTIONS_READY=false
FIRESTORE_READY=false

while [ $ELAPSED -lt $MAX_WAIT ]; do
  # Check Authentication (port 9099)
  if ! $AUTH_READY && check_port 9099; then
    echo -e "${GREEN}✓ Authentication emulator ready${NC}"
    AUTH_READY=true
  fi

  # Check Functions (port 5001)
  if ! $FUNCTIONS_READY && check_port 5001; then
    echo -e "${GREEN}✓ Functions emulator ready${NC}"
    FUNCTIONS_READY=true
  fi

  # Check Firestore (port 8080)
  if ! $FIRESTORE_READY && check_port 8080; then
    echo -e "${GREEN}✓ Firestore emulator ready${NC}"
    FIRESTORE_READY=true
  fi

  # All services ready?
  if $AUTH_READY && $FUNCTIONS_READY && $FIRESTORE_READY; then
    break
  fi

  sleep 0.2
  ELAPSED=$((ELAPSED + 1))
done

# Check if we timed out
if ! ($AUTH_READY && $FUNCTIONS_READY && $FIRESTORE_READY); then
  echo -e "${RED}Emulators failed to start within ${MAX_WAIT} seconds${NC}"
  echo -e "${RED}Check firebase-emulators.log for details${NC}"
  cleanup
  exit 1
fi

echo -e "${GREEN}All emulators ready!${NC}"
echo ""
echo -e "${GREEN}Starting Vite dev server...${NC}"

# Start Vite dev server in background
pnpm --filter quiet-notes-web start:emulated > vite-dev.log 2>&1 &
VITE_PID=$!

echo "VITE_PID=$VITE_PID" >> "$PID_FILE"

echo ""
echo -e "${GREEN}Development environment started successfully!${NC}"
echo ""
echo -e "Firebase Emulators:"
echo -e "  Authentication:  ${YELLOW}http://127.0.0.1:4000/auth${NC}"
echo -e "  Functions:       ${YELLOW}http://127.0.0.1:4000/functions${NC}"
echo -e "  Firestore:       ${YELLOW}http://127.0.0.1:4000/firestore${NC}"
echo ""
echo -e "Waiting for Vite dev server to be ready..."

# Wait for Vite to output its URL in the log
VITE_MAX_WAIT=150  # 150 * 0.2s = 30 seconds total
VITE_ELAPSED=0
VITE_URL=""

while [ $VITE_ELAPSED -lt $VITE_MAX_WAIT ]; do
  # Try to extract the Local URL from Vite's output
  if [ -f "vite-dev.log" ]; then
    VITE_URL=$(grep -o "Local:.*http://[^[:space:]]*" vite-dev.log 2>/dev/null | head -1 | sed 's/.*\(http:\/\/[^[:space:]]*\)/\1/')
    if [ -n "$VITE_URL" ]; then
      echo -e "${GREEN}✓ Vite dev server ready${NC}"
      break
    fi
  fi
  sleep 0.2
  VITE_ELAPSED=$((VITE_ELAPSED + 1))
done

if [ -z "$VITE_URL" ]; then
  echo -e "${YELLOW}Warning: Could not detect Vite URL. Check vite-dev.log for details.${NC}"
  VITE_URL="http://localhost:3000 (assumed)"
fi

echo ""
echo -e "Vite Dev Server:"
echo -e "  App:             ${YELLOW}${VITE_URL}${NC}"
echo ""
echo -e "${GREEN}Logs:${NC}"
echo -e "  Firebase: firebase-emulators.log"
echo -e "  Vite:     vite-dev.log"
echo ""
echo -e "${YELLOW}Run ./teardown.sh to stop all services${NC}"
