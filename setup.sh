#!/bin/bash

# Full-Stack Application Setup Script
# This script helps set up the development environment

set -e

echo "========================================"
echo "Full-Stack Application Setup"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js v18 or higher.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js version: $(node --version)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ npm version: $(npm --version)${NC}"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
if [ -d "backend" ]; then
    echo ""
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    
    # Set up backend environment
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}⚠ Creating backend .env file from .env.example...${NC}"
        cp .env.example .env
        echo -e "${YELLOW}⚠ Please edit backend/.env with your configuration!${NC}"
    else
        echo -e "${GREEN}✓ Backend .env already exists${NC}"
    fi
    
    cd ..
fi

# Install frontend dependencies
if [ -d "frontend" ]; then
    echo ""
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    
    # Set up frontend environment
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}⚠ Creating frontend .env file from .env.example...${NC}"
        cp .env.example .env
        echo -e "${YELLOW}⚠ Please edit frontend/.env with your configuration!${NC}"
    else
        echo -e "${GREEN}✓ Frontend .env already exists${NC}"
    fi
    
    cd ..
fi

echo ""
echo "========================================"
echo -e "${GREEN}✓ Setup completed successfully!${NC}"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Configure your environment variables in .env files"
echo "2. Set up your database and run migrations"
echo "3. Start the development servers with: npm run dev"
echo ""
echo "For detailed instructions, see README.md"
