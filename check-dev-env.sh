#!/bin/bash

# Quick check if development environment is running
# Exit 0 if ready, exit 1 if not ready
# Use this in hooks to verify dev environment before starting work

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a port is open
check_port() {
  nc -z 127.0.0.1 $1 2>/dev/null
  return $?
}

ALL_READY=true

# Check Firebase emulators
if ! check_port 9099; then
  echo -e "${RED}✗ Authentication emulator not running (port 9099)${NC}"
  ALL_READY=false
else
  echo -e "${GREEN}✓ Authentication emulator running${NC}"
fi

if ! check_port 5001; then
  echo -e "${RED}✗ Functions emulator not running (port 5001)${NC}"
  ALL_READY=false
else
  echo -e "${GREEN}✓ Functions emulator running${NC}"
fi

if ! check_port 8080; then
  echo -e "${RED}✗ Firestore emulator not running (port 8080)${NC}"
  ALL_READY=false
else
  echo -e "${GREEN}✓ Firestore emulator running${NC}"
fi

# Check Vite dev server
VITE_URL=""
if [ -f "vite-dev.log" ]; then
  VITE_URL=$(grep -o "Local:.*http://[^[:space:]]*" vite-dev.log 2>/dev/null | head -1 | sed 's/.*\(http:\/\/[^[:space:]]*\)/\1/')
fi

if [ -z "$VITE_URL" ]; then
  echo -e "${RED}✗ Vite dev server not running${NC}"
  ALL_READY=false
else
  echo -e "${GREEN}✓ Vite dev server running at ${YELLOW}${VITE_URL}${NC}"
fi

if [ "$ALL_READY" = false ]; then
  echo ""
  echo -e "${YELLOW}Development environment not ready. Run ./init.sh to start.${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}Development environment is ready!${NC}"
exit 0
