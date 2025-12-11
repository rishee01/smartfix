#!/bin/bash

echo "🚀 SmartFix Setup Script"
echo "======================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version)${NC}"

# Backend Setup
echo -e "\n${YELLOW}Setting up Backend...${NC}"
cd backend || exit
npm install
npm run seed
echo -e "${GREEN}✅ Backend ready (port 5000)${NC}"
cd ..

# Frontend Setup
echo -e "\n${YELLOW}Setting up Frontend...${NC}"
cd frontend || exit
npm install
echo -e "${GREEN}✅ Frontend ready (port 5173)${NC}"
cd ..

# Admin Setup
echo -e "\n${YELLOW}Setting up Admin...${NC}"
cd admin || exit
npm install
echo -e "${GREEN}✅ Admin ready (port 5174)${NC}"
cd ..

echo -e "\n${GREEN}✅ SmartFix Setup Complete!${NC}"
echo -e "\n${YELLOW}To start development:${NC}"
echo -e "  Terminal 1: cd backend && npm start"
echo -e "  Terminal 2: cd frontend && npm run dev"
echo -e "  Terminal 3: cd admin && npm run dev"
echo -e "\n${YELLOW}Access:${NC}"
echo -e "  Frontend: http://localhost:5173"
echo -e "  Admin: http://localhost:5174 (admin@smartfix.local / admin123)"
echo -e "  API: http://localhost:5000"
