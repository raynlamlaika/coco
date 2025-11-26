#!/bin/bash
# View logs for Football Carpooling Application

BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📋 Application Logs${NC}"
echo "===================="
echo ""
echo "Press Ctrl+C to stop viewing logs"
echo ""

# View both logs simultaneously
tail -f /tmp/backend.log /tmp/frontend.log
