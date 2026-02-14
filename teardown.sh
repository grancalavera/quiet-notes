#!/bin/bash

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PID_FILE=".dev-pids"

if [ ! -f "$PID_FILE" ]; then
  echo -e "${YELLOW}No PID file found. Checking for running processes...${NC}"

  # Try to find running emulators by port
  FIREBASE_PID=$(lsof -ti :9099 2>/dev/null | head -1)
  VITE_PID=$(lsof -ti :3000 2>/dev/null | head -1)

  if [ -z "$FIREBASE_PID" ] && [ -z "$VITE_PID" ]; then
    echo -e "${YELLOW}No running development environment found.${NC}"
    exit 0
  fi
else
  # Read PIDs from file
  source "$PID_FILE"
fi

echo -e "${GREEN}Stopping development environment...${NC}"

# Stop Vite dev server with SIGINT (Ctrl-C)
if [ -n "$VITE_PID" ]; then
  echo -e "${YELLOW}Stopping Vite dev server (PID: $VITE_PID)...${NC}"
  if kill -0 "$VITE_PID" 2>/dev/null; then
    kill -INT "$VITE_PID" 2>/dev/null || true

    # Wait up to 5 seconds for Vite to stop
    for i in {1..5}; do
      if ! kill -0 "$VITE_PID" 2>/dev/null; then
        echo -e "${GREEN}✓ Vite dev server stopped${NC}"
        break
      fi
      sleep 1
    done

    # Force kill if still running
    if kill -0 "$VITE_PID" 2>/dev/null; then
      echo -e "${YELLOW}Force killing Vite dev server...${NC}"
      kill -9 "$VITE_PID" 2>/dev/null || true
      sleep 1
    fi
  else
    echo -e "${YELLOW}Vite dev server already stopped${NC}"
  fi
fi

# Stop Firebase emulators with SIGINT (Ctrl-C)
# Firebase handles this gracefully and shuts down all child processes
if [ -n "$FIREBASE_PID" ]; then
  echo -e "${YELLOW}Stopping Firebase emulators (PID: $FIREBASE_PID)...${NC}"
  if kill -0 "$FIREBASE_PID" 2>/dev/null; then
    kill -INT "$FIREBASE_PID" 2>/dev/null || true

    # Wait up to 10 seconds for Firebase to stop (it needs more time for clean shutdown)
    for i in {1..10}; do
      if ! kill -0 "$FIREBASE_PID" 2>/dev/null; then
        echo -e "${GREEN}✓ Firebase emulators stopped${NC}"
        break
      fi
      sleep 1
    done

    # Force kill if still running
    if kill -0 "$FIREBASE_PID" 2>/dev/null; then
      echo -e "${YELLOW}Force killing Firebase emulators...${NC}"
      kill -9 "$FIREBASE_PID" 2>/dev/null || true
      sleep 2
    fi
  else
    echo -e "${YELLOW}Firebase emulators already stopped${NC}"
  fi
fi

# Verify all services are down and kill any remaining processes
echo ""
echo -e "${YELLOW}Verifying services are stopped...${NC}"

# Kill any processes still using emulator/vite ports
PORTS_KILLED=false
for port in 9099 5001 8080 5002 3000; do
  PIDS=$(lsof -ti :$port 2>/dev/null)
  if [ -n "$PIDS" ]; then
    echo -e "${YELLOW}Killing processes on port $port: $PIDS${NC}"
    echo "$PIDS" | xargs kill -9 2>/dev/null || true
    PORTS_KILLED=true
  fi
done

if [ "$PORTS_KILLED" = true ]; then
  sleep 1
fi

# Final verification
PORTS_IN_USE=""
for port in 9099 5001 8080 5002 3000; do
  if lsof -i :$port >/dev/null 2>&1; then
    PORTS_IN_USE="$PORTS_IN_USE $port"
  fi
done

if [ -n "$PORTS_IN_USE" ]; then
  echo -e "${RED}Error: Some ports are still in use:$PORTS_IN_USE${NC}"
  echo -e "${RED}Manual intervention required${NC}"
  exit 1
else
  echo -e "${GREEN}✓ All services verified stopped${NC}"
fi

# Clean up PID file
rm -f "$PID_FILE"

# Clean up log files
rm -f firebase-emulators.log vite-dev.log

echo -e "${GREEN}Development environment stopped successfully!${NC}"
