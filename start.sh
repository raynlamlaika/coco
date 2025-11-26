#!/bin/bash
# Start Football Carpooling Application

echo "🚗⚽ Starting Football Carpooling Application"
echo "=============================================="
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if MongoDB is running
echo -e "${BLUE}🍃 Checking MongoDB...${NC}"
if ! pgrep -x "mongod" > /dev/null; then
    echo -e "${RED}❌ MongoDB is not running${NC}"
    echo "Please start MongoDB first:"
    echo "  sudo systemctl start mongod"
    exit 1
fi
echo -e "${GREEN}✅ MongoDB is running${NC}"
echo ""

# Kill any existing processes
echo -e "${BLUE}🔄 Stopping any existing servers...${NC}"
pkill -f "vite" 2>/dev/null
pkill -f "tsx.*server" 2>/dev/null
sleep 2
echo -e "${GREEN}✅ Cleaned up old processes${NC}"
echo ""

# Start Backend
echo -e "${BLUE}🔧 Starting Backend server...${NC}"
cd /home/lamlaika/vo/coco/backend
nohup npm run dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > /tmp/backend.pid
sleep 3

# Check if backend started
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend running on port 5000 (PID: $BACKEND_PID)${NC}"
else
    echo -e "${RED}❌ Backend failed to start. Check logs: tail -f /tmp/backend.log${NC}"
fi
echo ""

# Start Frontend
echo -e "${BLUE}🎨 Starting Frontend server...${NC}"
cd /home/lamlaika/vo/coco/frontend
nohup npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > /tmp/frontend.pid
sleep 4

# Check if frontend started
if curl -s -I http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend running on port 5173 (PID: $FRONTEND_PID)${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend may still be starting... (PID: $FRONTEND_PID)${NC}"
fi
echo ""

echo -e "${GREEN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║       🎉 APPLICATION IS RUNNING! 🎉          ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📱 Frontend:${NC}     http://localhost:5173"
echo -e "${BLUE}🔧 Backend API:${NC}  http://localhost:5000/api"
echo -e "${BLUE}🍃 MongoDB:${NC}      mongodb://localhost:27017"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📧 Login Credentials:${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}👤 User:${NC}      user1@example.com / user123"
echo -e "${GREEN}👨‍💼 Admin:${NC}     admin1@example.com / admin123"
echo ""
echo -e "${BLUE}📋 Logs:${NC}"
echo "  Backend:  tail -f /tmp/backend.log"
echo "  Frontend: tail -f /tmp/frontend.log"
echo ""
echo -e "${BLUE}🛑 Stop servers:${NC}"
echo "  ./stop.sh"
echo "  or: kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Try to open browser
if command -v xdg-open > /dev/null 2>&1; then
    sleep 1
    xdg-open http://localhost:5173 2>/dev/null &
    echo -e "${GREEN}✨ Browser should open automatically!${NC}"
fi
echo ""
