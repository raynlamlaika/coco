#!/bin/bash
# Stop Football Carpooling Application

echo "🛑 Stopping Football Carpooling Application..."
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Kill processes by name
pkill -f "vite" 2>/dev/null
pkill -f "tsx.*server" 2>/dev/null

# Also kill by PID if files exist
if [ -f /tmp/backend.pid ]; then
    kill $(cat /tmp/backend.pid) 2>/dev/null
    rm /tmp/backend.pid
fi

if [ -f /tmp/frontend.pid ]; then
    kill $(cat /tmp/frontend.pid) 2>/dev/null
    rm /tmp/frontend.pid
fi

sleep 1

# Verify processes are stopped
if pgrep -f "vite" > /dev/null || pgrep -f "tsx.*server" > /dev/null; then
    echo -e "${RED}⚠️  Some processes may still be running. Force stopping...${NC}"
    pkill -9 -f "vite" 2>/dev/null
    pkill -9 -f "tsx.*server" 2>/dev/null
    sleep 1
fi

echo -e "${GREEN}✅ Application stopped${NC}"
echo ""
