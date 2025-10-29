# Deployment Guide

This guide covers various deployment strategies for the full-stack application.

## Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Environment Configuration](#environment-configuration)
- [Deployment Options](#deployment-options)
  - [Option 1: Traditional VPS/Cloud Server](#option-1-traditional-vpscloud-server)
  - [Option 2: Platform as a Service (PaaS)](#option-2-platform-as-a-service-paas)
  - [Option 3: Docker Deployment](#option-3-docker-deployment)
  - [Option 4: Kubernetes](#option-4-kubernetes)
- [Database Deployment](#database-deployment)
- [SSL/HTTPS Configuration](#sslhttps-configuration)
- [Monitoring & Logging](#monitoring--logging)
- [Backup Strategies](#backup-strategies)
- [CI/CD Pipeline](#cicd-pipeline)
- [Rollback Procedures](#rollback-procedures)

## Pre-Deployment Checklist

Before deploying to production, ensure the following:

### Security
- [ ] All environment variables are set correctly
- [ ] Database credentials are secure and not committed to version control
- [ ] JWT secret is a strong, random string
- [ ] CORS is configured to allow only production domain
- [ ] Rate limiting is enabled
- [ ] Security headers are configured (Helmet.js)
- [ ] SQL injection protection is in place
- [ ] XSS protection is enabled
- [ ] HTTPS is enforced

### Performance
- [ ] Database queries are optimized
- [ ] Indexes are created for frequently queried columns
- [ ] Static assets are minified and compressed
- [ ] Caching strategy is implemented
- [ ] CDN is configured for static assets
- [ ] Gzip compression is enabled

### Testing
- [ ] All tests pass successfully
- [ ] Load testing completed
- [ ] Security audit performed (npm audit)
- [ ] Manual testing in staging environment

### Documentation
- [ ] API documentation is up-to-date
- [ ] Deployment procedures documented
- [ ] Environment variables documented
- [ ] Architecture diagrams updated

### Monitoring
- [ ] Logging configured
- [ ] Error tracking setup (e.g., Sentry)
- [ ] Performance monitoring enabled
- [ ] Health check endpoints implemented
- [ ] Alerts configured

## Environment Configuration

### Production Environment Variables

#### Backend (.env)
```env
# Server
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://produser:strongpassword@db.example.com:5432/proddb
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# JWT
JWT_SECRET=<generate-with-openssl-rand-base64-64>
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=<different-secret>
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://yourdomain.com

# API
API_VERSION=v1
API_RATE_LIMIT=100

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/app/app.log

# Email (example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=app-specific-password

# Cloud Storage (example)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
VITE_NODE_ENV=production
VITE_SENTRY_DSN=your-frontend-sentry-dsn
```

### Generate Secure Secrets
```bash
# Generate JWT secret
openssl rand -base64 64

# Generate secure password
openssl rand -base64 32
```

## Deployment Options

### Option 1: Traditional VPS/Cloud Server

Deploy to a VPS (DigitalOcean, AWS EC2, Linode, etc.)

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx
sudo apt install nginx -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install PM2 globally
sudo npm install -g pm2

# Install Git
sudo apt install git -y
```

#### 2. Deploy Backend

```bash
# Create application user
sudo useradd -m -s /bin/bash appuser
sudo su - appuser

# Clone repository
git clone <your-repo-url> /home/appuser/app
cd /home/appuser/app

# Install dependencies
npm run install:backend

# Set up environment
cd backend
cp .env.example .env
nano .env  # Edit with production values

# Run migrations
npm run migrate:prod

# Build if necessary
npm run build

# Start with PM2
cd /home/appuser/app/backend
pm2 start npm --name "api" -- start
pm2 save
pm2 startup  # Follow the instructions
```

#### 3. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/yourdomain
```

**Backend proxy configuration:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Frontend configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /home/appuser/app/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

Enable and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/yourdomain /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 4. Deploy Frontend

```bash
# Build frontend
cd /home/appuser/app/frontend
npm install
npm run build

# Static files are now in dist/ directory
# Nginx will serve them from /home/appuser/app/frontend/dist
```

### Option 2: Platform as a Service (PaaS)

#### Heroku Deployment

**Backend:**
```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
heroku create your-app-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -base64 64)
heroku config:set CORS_ORIGIN=https://your-frontend-app.netlify.app

# Deploy
git subtree push --prefix backend heroku main
# or if backend is in root:
git push heroku main

# Run migrations
heroku run npm run migrate:prod

# View logs
heroku logs --tail
```

Create `Procfile` in backend directory:
```
web: npm start
```

**Frontend (Netlify):**

1. Connect GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
3. Set environment variables in Netlify dashboard
4. Deploy

Or use Netlify CLI:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy from frontend directory
cd frontend
netlify deploy --prod
```

#### Railway Deployment

```bash
# Install Railway CLI
npm install -g railway

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL
railway add --plugin postgresql

# Deploy backend
cd backend
railway up

# Deploy frontend
cd frontend
railway up
```

#### Render Deployment

1. Connect GitHub repository
2. Create new Web Service for backend
3. Create new Static Site for frontend
4. Configure environment variables
5. Deploy

### Option 3: Docker Deployment

#### 1. Create Dockerfiles

**Backend Dockerfile:**
```dockerfile
# backend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

EXPOSE 5000

CMD ["npm", "start"]
```

**Frontend Dockerfile:**
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Frontend nginx.conf:**
```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### 2. Docker Compose

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      - JWT_SECRET=${JWT_SECRET}
      - CORS_ORIGIN=http://localhost
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
```

#### 3. Deploy with Docker

```bash
# Create .env file
cp .env.example .env
nano .env  # Edit values

# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Run migrations
docker-compose exec backend npm run migrate:prod

# Stop services
docker-compose down

# Remove volumes (careful!)
docker-compose down -v
```

### Option 4: Kubernetes

**Example Kubernetes deployment (backend):**

```yaml
# kubernetes/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: your-registry/backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: jwt-secret
              key: secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 5000
  selector:
    app: backend
```

Deploy to Kubernetes:
```bash
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl apply -f kubernetes/frontend-deployment.yaml
kubectl get pods
kubectl get services
```

## Database Deployment

### Managed Database Services

**AWS RDS (PostgreSQL):**
1. Create RDS instance in AWS Console
2. Choose PostgreSQL version
3. Configure instance size and storage
4. Set master username and password
5. Configure security groups
6. Copy connection endpoint
7. Use connection string in DATABASE_URL

**DigitalOcean Managed Database:**
```bash
# Create database cluster
doctl databases create mydb --engine pg --region nyc1

# Get connection info
doctl databases connection mydb
```

### Self-Hosted Database

```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE proddb;
CREATE USER produser WITH PASSWORD 'strongpassword';
GRANT ALL PRIVILEGES ON DATABASE proddb TO produser;
\q

# Configure remote access (if needed)
sudo nano /etc/postgresql/14/main/postgresql.conf
# Set: listen_addresses = '*'

sudo nano /etc/postgresql/14/main/pg_hba.conf
# Add: host all all 0.0.0.0/0 md5

sudo systemctl restart postgresql
```

## SSL/HTTPS Configuration

### Using Let's Encrypt (Free SSL)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Auto-renewal (Certbot sets this up automatically)
# Test renewal
sudo certbot renew --dry-run

# Certbot will modify Nginx config to redirect HTTP to HTTPS
```

### Manual SSL Configuration

If you have SSL certificates from another provider:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # ... rest of configuration
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## Monitoring & Logging

### PM2 Monitoring

```bash
# View status
pm2 status

# View logs
pm2 logs

# Monitor resources
pm2 monit

# Install PM2 web dashboard
pm2 install pm2-server-monit
```

### Application Logging

Use Winston for structured logging:

```javascript
// backend/src/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;
```

### Error Tracking with Sentry

```javascript
// backend/src/index.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// Error handler middleware
app.use(Sentry.Handlers.errorHandler());
```

## Backup Strategies

### Database Backups

**Automated PostgreSQL backups:**

```bash
#!/bin/bash
# /home/appuser/backup-db.sh

BACKUP_DIR="/home/appuser/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="proddb"
DB_USER="produser"

mkdir -p $BACKUP_DIR

# Create backup
pg_dump -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Delete backups older than 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

Set up cron job:
```bash
crontab -e
# Add: 0 2 * * * /home/appuser/backup-db.sh
```

### File Backups

Use rsync for incremental backups:
```bash
rsync -avz --delete /home/appuser/app/ /backup/app/
```

### Cloud Backups

- AWS S3
- DigitalOcean Spaces
- Google Cloud Storage

## CI/CD Pipeline

### GitHub Actions Example

**.github/workflows/deploy.yml:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: |
        npm run install:backend
        npm run install:frontend

    - name: Run tests
      run: npm test

    - name: Build
      run: npm run build

    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /home/appuser/app
          git pull origin main
          npm run install:backend
          npm run build:backend
          pm2 restart api
          npm run install:frontend
          npm run build:frontend
```

## Rollback Procedures

### PM2 Rollback

```bash
# View logs for errors
pm2 logs

# Rollback to previous code
cd /home/appuser/app
git log --oneline  # Find previous commit
git reset --hard <previous-commit-hash>
npm install
pm2 restart all
```

### Database Rollback

```bash
# Using migration tools
npm run migrate:rollback

# Or restore from backup
gunzip -c /home/appuser/backups/backup_20250101_020000.sql.gz | psql -U produser proddb
```

### Docker Rollback

```bash
# Use previous image tag
docker-compose down
docker pull your-registry/backend:previous-tag
docker-compose up -d
```

---

## Support

For deployment issues, check:
- Server logs: `/var/log/nginx/error.log`
- Application logs: `pm2 logs`
- Database logs: `/var/log/postgresql/`

For additional help, consult the [Troubleshooting guide](README.md#troubleshooting).
