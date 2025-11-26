#!/bin/bash
# run-app.sh - Complete startup script for coco folder

echo "🚗⚽ Starting Football Carpooling Application"
echo "=============================================="
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Get the directory where script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# 1. Check MongoDB
echo -e "${BLUE}🍃 Step 1: Starting MongoDB...${NC}"
if docker ps | grep -q mongodb; then
    echo -e "${GREEN}✅ MongoDB is running${NC}"
else
    echo "Starting MongoDB..."
    docker start mongodb 2>/dev/null || docker run -d --name mongodb -p 27017:27017 -v ~/mongodb-data:/data/db mongo:latest
    sleep 3
    echo -e "${GREEN}✅ MongoDB started${NC}"
fi
echo ""

# 2. Setup Backend
echo -e "${BLUE}🔧 Step 2: Preparing Backend...${NC}"
cd backend

# Check if node_modules exists
if [ !  -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

# Check/create .env
if [ ! -f ".env" ]; then
    echo "Creating backend .env file..."
    cat > .env << 'EOF'
PORT=5000
MONGODB_URI=mongodb://localhost:27017/supporter-carpool
JWT_SECRET=football_carpool_super_secret_jwt_key_production_2024
JWT_EXPIRE=24h
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
EOF
fi

echo -e "${GREEN}✅ Backend ready${NC}"
cd .. 
echo ""

# 3. Setup Frontend
echo -e "${BLUE}🎨 Step 3: Preparing Frontend...${NC}"
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Check/create .env
if [ ! -f ".env" ]; then
    echo "Creating frontend .env file..."
    cat > .env << 'EOF'
VITE_API_BASE_URL=http://localhost:5000/api
EOF
fi

echo -e "${GREEN}✅ Frontend ready${NC}"
cd ..
echo ""

# 4. Check if database needs seeding
echo -e "${BLUE}🌱 Step 4: Checking database...${NC}"
USER_COUNT=$(docker exec mongodb mongosh supporter-carpool --quiet --eval "db.users.countDocuments()" 2>/dev/null || echo "0")

if [ "$USER_COUNT" -eq 0 ]; then
    echo "Database is empty. Seeding data..."
    cd backend
    npm run seed
    cd ..
    echo -e "${GREEN}✅ Database seeded${NC}"
else
    echo -e "${GREEN}✅ Database has $USER_COUNT users${NC}"
fi
echo ""

# 5. Kill any existing processes
echo -e "${BLUE}🧹 Step 5: Cleaning up old processes...${NC}"
pkill -f "vite" 2>/dev/null
pkill -f "node.*server" 2>/dev/null
sleep 2
echo -e "${GREEN}✅ Cleanup done${NC}"
echo ""

# 6. Start Backend
echo -e "${BLUE}🚀 Step 6: Starting Backend Server...${NC}"
cd backend
npm run dev > ../backend. log 2>&1 &
BACKEND_PID=$! 
cd .. 
echo "Backend PID: $BACKEND_PID"
sleep 4

# Check if backend started
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running on port 5000${NC}"
else
    echo -e "${YELLOW}⚠️  Backend starting... (check backend.log if issues)${NC}"
fi
echo ""

# 7. Start Frontend
echo -e "${BLUE}🚀 Step 7: Starting Frontend Server...${NC}"
cd frontend
npm run dev > ../frontend. log 2>&1 &
FRONTEND_PID=$! 
cd ..
echo "Frontend PID: $FRONTEND_PID"
sleep 4

# Check if frontend started
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is running on port 5173${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend starting... (check frontend.log if issues)${NC}"
fi
echo ""

# 8. Test login API
echo -e "${BLUE}🧪 Step 8: Testing Login API...${NC}"
LOGIN_TEST=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin1@example.com","password":"password123"}' 2>/dev/null)

if echo "$LOGIN_TEST" | grep -q "token"; then
    echo -e "${GREEN}✅ Login API works perfectly! ${NC}"
else
    echo -e "${YELLOW}⚠️  Login API response: $LOGIN_TEST${NC}"
fi
echo ""

# 9. Save PIDs
echo "$BACKEND_PID" > backend. pid
echo "$FRONTEND_PID" > frontend.pid

# 10. Summary
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                  ║${NC}"
echo -e "${GREEN}║        🎉  APPLICATION IS RUNNING!  🎉           ║${NC}"
echo -e "${GREEN}║                                                  ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  URLs${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  📱 ${GREEN}Frontend:${NC}     http://localhost:5173"
echo -e "  🔧 ${GREEN}Backend API:${NC}  http://localhost:5000"
echo -e "  🍃 ${GREEN}MongoDB:${NC}      mongodb://localhost:27017"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}  Login Credentials${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${GREEN}👨‍💼 Admin Account:${NC}"
echo -e "     📧 admin1@example.com"
echo -e "     🔐 password123"
echo ""
echo -e "  ${GREEN}👤 Regular User:${NC}"
echo -e "     📧 john. doe@example.com"
echo -e "     🔐 password123"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Useful Commands${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "  📊 View backend logs:   tail -f backend.log"
echo "  📊 View frontend logs:  tail -f frontend.log"
echo "  🛑 Stop servers:        ./stop-app.sh"
echo "  🔄 Restart:             ./run-app.sh"
echo ""

# Try to open browser
sleep 2
xdg-open http://localhost:5173 2>/dev/null || echo -e "${YELLOW}Please open http://localhost:5173 in your browser${NC}"

echo ""