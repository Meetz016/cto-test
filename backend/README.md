# Backend API

This is the backend API service for the full-stack application.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit environment variables
nano .env

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

The API will be available at http://localhost:5000

## Environment Variables

See `.env.example` for all required variables. Key variables include:

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)
- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CORS_ORIGIN` - Allowed CORS origin (frontend URL)

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues
- `npm run migrate` - Run database migrations
- `npm run migrate:prod` - Run migrations in production
- `npm run seed` - Seed database with sample data

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   ├── config/          # Configuration files
│   └── index.js         # Entry point
├── tests/               # Test files
├── migrations/          # Database migrations
├── seeds/               # Database seeders
├── .env.example         # Environment template
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh` - Refresh access token

### Users
- `GET /api/v1/users` - Get all users (admin)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (admin)

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Database

### Migrations

Run migrations:
```bash
npm run migrate
```

Create new migration:
```bash
npx prisma migrate dev --name migration_name
```

### Seeding

Seed database:
```bash
npm run seed
```

## Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Heroku

```bash
heroku create your-app-name
heroku addons:create heroku-postgresql:mini
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -base64 64)
git push heroku main
heroku run npm run migrate:prod
```

## Contributing

1. Create a feature branch
2. Make changes
3. Add tests
4. Run `npm test` and `npm run lint`
5. Submit pull request

## License

ISC
