# Frontend Application

This is the frontend application for the full-stack project.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit environment variables
nano .env

# Start development server
npm run dev
```

The application will be available at http://localhost:3000

## Environment Variables

See `.env.example` for all required variables. Key variables include:

- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:5000/api/v1)
- `VITE_NODE_ENV` - Environment (development/production)

> **Note**: All environment variables must be prefixed with `VITE_` to be accessible in the application.

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── common/      # Common UI components
│   │   └── layout/      # Layout components
│   ├── pages/           # Page components
│   ├── services/        # API service layer
│   ├── hooks/           # Custom React hooks
│   ├── store/           # State management
│   ├── utils/           # Helper functions
│   ├── styles/          # Global styles
│   ├── assets/          # Static assets
│   ├── App.jsx          # Root component
│   └── main.jsx         # Entry point
├── public/              # Public static files
├── tests/               # Test files
├── .env.example         # Environment template
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
└── package.json
```

## Component Structure

### Example Component

```jsx
// src/components/Button.jsx
import React from 'react';
import './Button.css';

export const Button = ({ children, onClick, variant = 'primary' }) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};
```

### Example Page

```jsx
// src/pages/Home.jsx
import React from 'react';
import { Button } from '../components/Button';

export const Home = () => {
  return (
    <div className="home">
      <h1>Welcome</h1>
      <Button onClick={() => console.log('Clicked!')}>
        Get Started
      </Button>
    </div>
  );
};
```

## API Integration

### API Service Example

```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Using API Service

```javascript
// src/services/userService.js
import api from './api';

export const userService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  updateProfile: async (data) => {
    const response = await api.put('/users/me', data);
    return response.data;
  },
};
```

## State Management

### Example with Context API

```jsx
// src/store/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (email, password) => {
    // API call
    const response = await userService.login(email, password);
    setUser(response.user);
    setToken(response.token);
    localStorage.setItem('token', response.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

## Routing

### Example Routes

```jsx
// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { PrivateRoute } from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

## Testing

### Component Test Example

```jsx
// src/components/__tests__/Button.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

Run tests:
```bash
npm test
```

## Building for Production

Build the application:
```bash
npm run build
```

The build output will be in the `dist/` directory.

Preview the production build locally:
```bash
npm run preview
```

## Deployment

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Deploy to Static Hosting

After building, upload the `dist/` directory to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Cloudflare Pages

## Performance Optimization

### Code Splitting

```jsx
// Lazy load components
import React, { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}
```

### Image Optimization

```jsx
// Use modern image formats and lazy loading
<img 
  src="image.webp" 
  alt="Description" 
  loading="lazy" 
  width="800" 
  height="600"
/>
```

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Contributing

1. Create a feature branch
2. Make changes
3. Add tests
4. Run `npm test` and `npm run lint`
5. Submit pull request

## License

ISC
