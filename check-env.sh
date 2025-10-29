#!/bin/bash

# Environment Checker Script
# Verifies that all required tools and configurations are in place

set +e  # Don't exit on error, we want to check everything

echo "========================================"
echo "Environment Configuration Checker"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

# Function to check command existence
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓ $1 is installed${NC}"
        if [ ! -z "$2" ]; then
            VERSION=$($1 $2 2>&1 | head -n1)
            echo "  Version: $VERSION"
        fi
    else
        echo -e "${RED}✗ $1 is not installed${NC}"
        ERRORS=$((ERRORS + 1))
    fi
}

# Function to check file existence
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓ $1 exists${NC}"
    else
        echo -e "${YELLOW}⚠ $1 is missing${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
}

# Function to check directory
check_directory() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓ $1 directory exists${NC}"
    else
        echo -e "${RED}✗ $1 directory is missing${NC}"
        ERRORS=$((ERRORS + 1))
    fi
}

echo "Checking required tools..."
echo ""

# Check Node.js
check_command "node" "--version"

# Check npm
check_command "npm" "--version"

# Check Git
check_command "git" "--version"

echo ""
echo "Checking optional tools..."
echo ""

# Check PostgreSQL (optional)
check_command "psql" "--version"

# Check Docker (optional)
check_command "docker" "--version"

echo ""
echo "Checking project structure..."
echo ""

# Check directories
check_directory "backend"
check_directory "frontend"
check_directory "docs"

echo ""
echo "Checking configuration files..."
echo ""

# Check root files
check_file "package.json"
check_file "README.md"
check_file ".gitignore"

# Check backend files
check_file "backend/package.json"
check_file "backend/.env.example"
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓ backend/.env exists${NC}"
else
    echo -e "${YELLOW}⚠ backend/.env is missing (run: cp backend/.env.example backend/.env)${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Check frontend files
check_file "frontend/package.json"
check_file "frontend/.env.example"
if [ -f "frontend/.env" ]; then
    echo -e "${GREEN}✓ frontend/.env exists${NC}"
else
    echo -e "${YELLOW}⚠ frontend/.env is missing (run: cp frontend/.env.example frontend/.env)${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "Checking dependencies..."
echo ""

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ Root dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠ Root dependencies not installed (run: npm install)${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠ Backend dependencies not installed (run: cd backend && npm install)${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠ Frontend dependencies not installed (run: cd frontend && npm install)${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "Checking environment variables..."
echo ""

# Check backend .env
if [ -f "backend/.env" ]; then
    if grep -q "DATABASE_URL=" backend/.env && [ -n "$(grep DATABASE_URL= backend/.env | cut -d'=' -f2)" ]; then
        echo -e "${GREEN}✓ DATABASE_URL is set${NC}"
    else
        echo -e "${YELLOW}⚠ DATABASE_URL is not configured in backend/.env${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
    
    if grep -q "JWT_SECRET=" backend/.env && [ -n "$(grep JWT_SECRET= backend/.env | cut -d'=' -f2)" ]; then
        echo -e "${GREEN}✓ JWT_SECRET is set${NC}"
    else
        echo -e "${YELLOW}⚠ JWT_SECRET is not configured in backend/.env${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
fi

# Check frontend .env
if [ -f "frontend/.env" ]; then
    if grep -q "VITE_API_BASE_URL=" frontend/.env; then
        echo -e "${GREEN}✓ VITE_API_BASE_URL is set${NC}"
    else
        echo -e "${YELLOW}⚠ VITE_API_BASE_URL is not configured in frontend/.env${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
fi

echo ""
echo "========================================"
echo "Summary"
echo "========================================"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! You're ready to start development.${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Start development servers: npm run dev"
    echo "  2. Run tests: npm test"
    echo "  3. Check API health: curl http://localhost:5000/api/v1/health"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS warning(s) found. Review and fix before proceeding.${NC}"
    exit 0
else
    echo -e "${RED}✗ $ERRORS error(s) found. Please fix before continuing.${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ $WARNINGS warning(s) also found.${NC}"
    fi
    exit 1
fi

echo ""
