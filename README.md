# Full-Stack Application

A comprehensive full-stack application with a modern backend API and frontend interface.

## 🚀 Quick Start

**New to the project?** Check out the [Quick Start Guide](./QUICKSTART.md) to get up and running in 5 minutes!

## 📚 Documentation

- **[Quick Start Guide](./QUICKSTART.md)** - Get started quickly
- **[API Documentation](./docs/API.md)** - Complete API reference
- **[Architecture Overview](./ARCHITECTURE.md)** - System architecture and design
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment instructions
- **[Contributing Guidelines](./CONTRIBUTING.md)** - How to contribute to the project
- **[Changelog](./CHANGELOG.md)** - Version history and updates

## Table of Contents

- [Project Architecture](#project-architecture)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
- [Development Workflow](#development-workflow)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Project Architecture

This is a full-stack application following a monorepo structure with separate backend and frontend codebases:

### Backend
- **Framework**: Node.js with Express (or your preferred framework)
- **Database**: PostgreSQL/MySQL/SQLite with an ORM (Prisma, TypeORM, or Sequelize)
- **Authentication**: JWT-based authentication
- **API Design**: RESTful API with versioning (v1)
- **Testing**: Jest/Mocha for unit and integration tests

### Frontend
- **Framework**: React/Vue/Angular (or your preferred framework)
- **Build Tool**: Vite/Webpack
- **State Management**: Redux/Zustand/Context API
- **Styling**: CSS Modules/Tailwind/Styled Components
- **Testing**: Vitest/Jest with React Testing Library

### Architecture Diagram

```
┌─────────────────┐
│   Frontend      │
│   (Port 3000)   │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│   Backend API   │
│   (Port 5000)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Database     │
└─────────────────┘
```

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js**: v18.x or higher ([Download](https://nodejs.org/))
- **npm** or **yarn**: Latest version (comes with Node.js)
- **Git**: Latest version ([Download](https://git-scm.com/))
- **Database**: PostgreSQL 14+ or MySQL 8+ (or SQLite for development)
  - [PostgreSQL Download](https://www.postgresql.org/download/)
  - [MySQL Download](https://dev.mysql.com/downloads/)
- **Optional**: Docker and Docker Compose for containerized development

### Verify Prerequisites

```bash
node --version  # Should be v18.x or higher
npm --version   # Should be 9.x or higher
git --version   # Should be 2.x or higher
```

## Project Structure

```
.
├── backend/                 # Backend API application
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API route definitions
│   │   ├── middleware/     # Custom middleware
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helper functions
│   │   └── index.js        # Entry point
│   ├── tests/              # Backend tests
│   ├── migrations/         # Database migrations
│   ├── .env.example        # Backend environment template
│   ├── package.json
│   └── README.md           # Backend-specific docs
│
├── frontend/               # Frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── hooks/         # Custom hooks
│   │   ├── store/         # State management
│   │   ├── utils/         # Helper functions
│   │   └── App.jsx        # Root component
│   ├── public/            # Static assets
│   ├── tests/             # Frontend tests
│   ├── .env.example       # Frontend environment template
│   ├── package.json
│   └── README.md          # Frontend-specific docs
│
├── docs/                   # Documentation
│   ├── API.md             # API documentation
│   └── screenshots/       # App screenshots
├── .gitignore             # Git ignore rules
├── package.json           # Root package with scripts
├── setup.sh               # Automated setup script
├── check-env.sh           # Environment checker
└── README.md              # This file
```

## Getting Started

### Automated Setup (Recommended)

Use the automated setup script:

```bash
# Clone the repository
git clone <repository-url>
cd <project-directory>

# Run setup script
chmod +x setup.sh
./setup.sh
```

The setup script will:
- Install all dependencies (root, backend, frontend)
- Create .env files from templates
- Guide you through configuration

After setup, verify your environment:
```bash
./check-env.sh
```

### Manual Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

#### 2. Install Dependencies

**Option A: Install All at Once**
```bash
npm run install:all
```

**Option B: Install Separately**
```bash
# Install root dependencies (concurrently)
npm install

# Install backend dependencies
npm run install:backend

# Install frontend dependencies
npm run install:frontend
```

### Environment Variables

#### Backend Environment Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and configure the following variables:

   **Required Variables:**
   - `NODE_ENV`: Set to `development` for local development
   - `PORT`: Backend server port (default: 5000)
   - `DATABASE_URL`: Your database connection string
   - `JWT_SECRET`: A secure random string for JWT signing (generate with `openssl rand -base64 32`)
   - `CORS_ORIGIN`: Frontend URL (default: http://localhost:3000)

   **Example:**
   ```env
   NODE_ENV=development
   PORT=5000
   DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/mydb
   JWT_SECRET=super-secret-key-change-in-production
   CORS_ORIGIN=http://localhost:3000
   ```

#### Frontend Environment Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and configure:

   **Required Variables:**
   - `VITE_API_BASE_URL`: Backend API URL (default: http://localhost:5000/api/v1)
   
   **Example:**
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   ```

   > **Note**: Variable prefixes depend on your build tool:
   > - Vite: `VITE_`
   > - Create React App: `REACT_APP_`
   > - Next.js: `NEXT_PUBLIC_`

### Database Setup

#### 1. Create Database

**PostgreSQL:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE mydb;

# Create user (if needed)
CREATE USER myuser WITH PASSWORD 'mypassword';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;

# Exit
\q
```

**SQLite (Development Only):**
```bash
# No setup needed - database file will be created automatically
# Just set DATABASE_URL=sqlite:./dev.db in backend/.env
```

#### 2. Run Migrations

```bash
cd backend

# If using Prisma
npx prisma migrate dev

# If using TypeORM
npm run migration:run

# If using Sequelize
npx sequelize-cli db:migrate
```

#### 3. Seed Database (Optional)

```bash
cd backend

# If using Prisma
npx prisma db seed

# Or run custom seed script
npm run seed
```

## Development Workflow

### Running the Full Stack

**Start Both Backend and Frontend:**
```bash
# From the root directory
npm run dev
```

This command uses `concurrently` to run both servers simultaneously:
- Backend will run on http://localhost:5000
- Frontend will run on http://localhost:3000

You'll see color-coded logs from both servers in your terminal.

### Running Services Separately

**Backend Only:**
```bash
npm run dev:backend
# or
cd backend && npm run dev
```

**Frontend Only:**
```bash
npm run dev:frontend
# or
cd frontend && npm run dev
```

### Development Tips

- **Hot Reload**: Both backend and frontend support hot reloading. Changes will be reflected automatically.
- **API Testing**: Use tools like Postman, Insomnia, or Thunder Client to test API endpoints.
- **Database GUI**: Use tools like pgAdmin (PostgreSQL), MySQL Workbench, or Prisma Studio.

## API Documentation

### Base URL

```
Development: http://localhost:5000/api/v1
Production: https://your-domain.com/api/v1
```

### API Routes

#### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/logout` | Logout user | Yes |
| GET | `/auth/me` | Get current user | Yes |
| POST | `/auth/refresh` | Refresh access token | Yes |

**Example Request:**
```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"John Doe"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

#### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users` | Get all users | Yes (Admin) |
| GET | `/users/:id` | Get user by ID | Yes |
| PUT | `/users/:id` | Update user | Yes |
| DELETE | `/users/:id` | Delete user | Yes (Admin) |

#### Additional Endpoints

Add your application-specific endpoints here following the same format.

### Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/v1/protected-endpoint
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

### Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Testing

### Running Tests

**All Tests:**
```bash
# From root directory
npm test
```

**Backend Tests Only:**
```bash
npm run test:backend
# or
cd backend && npm test
```

**Frontend Tests Only:**
```bash
npm run test:frontend
# or
cd frontend && npm test
```

**Watch Mode (during development):**
```bash
cd backend && npm run test:watch
cd frontend && npm run test:watch
```

### Test Coverage

```bash
# Backend coverage
cd backend && npm run test:coverage

# Frontend coverage
cd frontend && npm run test:coverage
```

### Writing Tests

#### Backend Tests (Example using Jest)

```javascript
// backend/tests/auth.test.js
describe('Auth Controller', () => {
  test('should register new user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

#### Frontend Tests (Example using React Testing Library)

```javascript
// frontend/tests/LoginForm.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '../src/components/LoginForm';

describe('LoginForm', () => {
  test('renders login form', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });
});
```

## Deployment

### Prerequisites for Deployment

- Production database (PostgreSQL, MySQL, etc.)
- Node.js environment (v18+)
- Environment variables configured
- Domain name and SSL certificate

### Backend Deployment

#### Option 1: Traditional Server (VPS/EC2)

1. **Setup server environment:**
```bash
# SSH into your server
ssh user@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2
```

2. **Deploy application:**
```bash
# Clone repository
git clone <repository-url>
cd <project-directory>

# Install dependencies
npm run install:all

# Set up environment variables
cd backend
cp .env.example .env
nano .env  # Edit with production values

# Run migrations
npm run migrate:prod

# Build application
npm run build

# Start with PM2
pm2 start npm --name "api" -- start
pm2 save
pm2 startup
```

3. **Setup Nginx reverse proxy:**
```nginx
# /etc/nginx/sites-available/your-app
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Option 2: Platform as a Service (Heroku, Railway, Render)

**Heroku Example:**

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create your-app-name

# Add database
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-key

# Deploy
git push heroku main

# Run migrations
heroku run npm run migrate:prod
```

#### Option 3: Docker Deployment

**Dockerfile (backend):**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

**Deploy with Docker:**
```bash
# Build image
docker build -t your-app-backend ./backend

# Run container
docker run -d -p 5000:5000 --env-file backend/.env your-app-backend
```

### Frontend Deployment

#### Option 1: Static Hosting (Netlify, Vercel, Cloudflare Pages)

**Netlify Example:**

1. Build configuration in `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "frontend/dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Deploy:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

#### Option 2: Same Server as Backend

```nginx
# /etc/nginx/sites-available/your-app
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/your-app/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Environment Variables for Production

**Backend Production Variables:**
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@prod-db.example.com:5432/dbname
JWT_SECRET=very-long-random-secret-generated-securely
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=info
```

**Frontend Production Variables:**
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
VITE_NODE_ENV=production
```

### Post-Deployment Checklist

- [ ] SSL certificate configured (use Let's Encrypt with Certbot)
- [ ] Database migrations run successfully
- [ ] Environment variables set correctly
- [ ] CORS configured for production domain
- [ ] Monitoring and logging setup (e.g., PM2, DataDog, Sentry)
- [ ] Backups configured for database
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Health check endpoint working
- [ ] CI/CD pipeline configured (optional)

## Troubleshooting

### Common Issues

#### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using the port
lsof -i :5000
# or
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>
# or
taskkill /PID <PID> /F  # Windows
```

#### Database Connection Failed

**Problem:** `Error: connect ECONNREFUSED` or `Authentication failed`

**Solutions:**
1. Verify database is running:
   ```bash
   # PostgreSQL
   sudo systemctl status postgresql
   
   # MySQL
   sudo systemctl status mysql
   ```

2. Check connection string in `.env`
3. Verify database user permissions
4. Test connection:
   ```bash
   # PostgreSQL
   psql -U username -d dbname -h localhost
   
   # MySQL
   mysql -u username -p -h localhost dbname
   ```

#### Module Not Found

**Problem:** `Error: Cannot find module 'xxx'`

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use npm ci for clean install
npm ci
```

#### CORS Errors in Frontend

**Problem:** `Access to fetch at 'http://localhost:5000' has been blocked by CORS policy`

**Solution:**
1. Check `CORS_ORIGIN` in backend `.env` matches frontend URL
2. Ensure CORS middleware is properly configured in backend
3. Restart backend server after changes

#### Environment Variables Not Loading

**Problem:** `undefined` when accessing `process.env.VARIABLE_NAME`

**Solutions:**
1. Verify `.env` file exists and is in correct directory
2. Check variable names match exactly (case-sensitive)
3. For frontend, ensure variables have correct prefix (`VITE_`, `REACT_APP_`, `NEXT_PUBLIC_`)
4. Restart development server after changing `.env`

#### Migration Errors

**Problem:** Migration fails or database out of sync

**Solutions:**
```bash
# Reset database (development only!)
npm run migrate:reset

# Check migration status
npm run migrate:status

# Rollback last migration
npm run migrate:rollback
```

### Getting Help

- Check the [Issues](../../issues) page for known problems
- Review logs for detailed error messages
- Consult framework-specific documentation
- Ask for help in project discussions or team channels

### Debugging Tips

1. **Enable Debug Logging:**
   ```env
   LOG_LEVEL=debug
   ```

2. **Use Debugger:**
   ```bash
   # Backend
   node --inspect src/index.js
   
   # Frontend (VSCode)
   # Add launch configuration in .vscode/launch.json
   ```

3. **Check Network Requests:**
   - Use browser DevTools Network tab
   - Check request/response headers and payloads

4. **Database Queries:**
   ```env
   # Enable query logging (Prisma example)
   DATABASE_LOGGING=true
   ```

## Screenshots

<!-- Add screenshots of your application here -->
<!-- Example:
![Homepage](./docs/screenshots/homepage.png)
![Dashboard](./docs/screenshots/dashboard.png)
![API Demo](./docs/screenshots/api-demo.gif)
-->

Screenshots and demo GIFs can be added in the `/docs/screenshots/` directory.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For support, please:
- Open an issue in the repository
- Contact the development team
- Check the documentation in `/docs` directory

---

**Happy Coding! 🚀**
