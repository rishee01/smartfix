#!/bin/bash
# CivicSense Deployment Script
# Usage: ./deploy.sh [vercel|render|heroku]

set -e

TARGET=${1:-vercel}

echo "🚀 CivicSense Deployment Script"
echo "================================"
echo "Target: $TARGET"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if git is clean
if [[ ! -z $(git status -s) ]]; then
    echo -e "${RED}❌ Error: Uncommitted changes detected${NC}"
    echo "Please commit all changes before deploying"
    exit 1
fi

echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm run install:all

echo -e "${YELLOW}🔨 Building project...${NC}"
npm run build

echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo ""

case $TARGET in
    vercel)
        echo -e "${YELLOW}📤 Deploying to Vercel...${NC}"
        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm install -g vercel
        fi
        vercel --prod
        ;;
    render)
        echo -e "${YELLOW}📤 Deploying to Render...${NC}"
        echo "Please deploy using the Render dashboard:"
        echo "1. Go to render.com"
        echo "2. Connect your repository"
        echo "3. Deploy will start automatically"
        echo ""
        echo "Or use git push:"
        echo "git push render main"
        ;;
    heroku)
        echo -e "${YELLOW}📤 Deploying to Heroku...${NC}"
        if ! command -v heroku &> /dev/null; then
            echo "Heroku CLI not found. Install from: https://devcenter.heroku.com/articles/heroku-cli"
            exit 1
        fi
        git push heroku main
        heroku logs --tail
        ;;
    *)
        echo -e "${RED}❌ Unknown target: $TARGET${NC}"
        echo "Usage: ./deploy.sh [vercel|render|heroku]"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Deployment script completed!${NC}"
