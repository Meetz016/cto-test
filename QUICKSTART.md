# Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- [PostgreSQL](https://www.postgresql.org/) or [MySQL](https://www.mysql.com/) (or use SQLite for development)

## Installation

### Option 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd <project-directory>

# Run setup script
chmod +x setup.sh
./setup.sh
```

The script will:
- Install all dependencies
- Create `.env` files from templates
- Guide you through configuration

### Option 2: Manual Setup

```bash
# Clone the repository
git clone <repository-url>
cd <project-directory>

# Install all dependencies
npm run install:all

# Set up backend environment
cd backend
cp .env.example .env
# Edit .env with your configuration

# Set up frontend environment
cd ../frontend
cp .env.example .env
# Edit .env with your configuration

cd ..
```

## Configuration

### Backend Environment (backend/.env)

Minimum required configuration:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-super-secret-key-here
CORS_ORIGIN=http://localhost:3000
```

**Generate a secure JWT secret:**
```bash
openssl rand -base64 64
```

### Frontend Environment (frontend/.env)

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## Database Setup

### PostgreSQL

```bash
# Create database
createdb myapp_dev

# Or using psql
psql -U postgres
CREATE DATABASE myapp_dev;
\q
```

### SQLite (Development Only)

Simply set in backend/.env:
```env
DATABASE_URL=sqlite:./dev.db
```

### Run Migrations

```bash
cd backend
npm run migrate
```

## Start Development

### Start Both Backend and Frontend

```bash
# From project root
npm run dev
```

This will start:
- Backend API on http://localhost:5000
- Frontend on http://localhost:3000

### Start Individually

**Backend only:**
```bash
npm run dev:backend
# or
cd backend && npm run dev
```

**Frontend only:**
```bash
npm run dev:frontend
# or
cd frontend && npm run dev
```

## Verify Installation

### Check Backend

```bash
curl http://localhost:5000/api/v1/health
```

Should return:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-10-29T10:00:00Z"
  }
}
```

### Check Frontend

Open browser to http://localhost:3000

## Next Steps

1. **Read the Documentation**
   - [Complete README](./README.md)
   - [API Documentation](./docs/API.md)
   - [Architecture Overview](./ARCHITECTURE.md)

2. **Explore the Code**
   - Backend: `backend/src/`
   - Frontend: `frontend/src/`

3. **Run Tests**
   ```bash
   npm test
   ```

4. **Check Code Quality**
   ```bash
   npm run lint
   ```

## Common Issues

### Port Already in Use

If port 5000 or 3000 is already in use:

```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>
```

Or change the port in `.env` files.

### Database Connection Error

- Verify database is running
- Check DATABASE_URL in backend/.env
- Ensure database user has proper permissions

### Module Not Found

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Troubleshooting

For more detailed troubleshooting, see the [Troubleshooting section](./README.md#troubleshooting) in the main README.

## Need Help?

- Check [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- Open an issue for bugs or questions

---

**You're all set! Happy coding! 🚀**
