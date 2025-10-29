# Contributing to This Project

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and professional in all interactions.

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js v18+ installed
- Git installed
- Database (PostgreSQL/MySQL) installed
- Code editor (VS Code recommended)

### Setup Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/project-name.git
   cd project-name
   ```

3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/project-name.git
   ```

4. Install dependencies:
   ```bash
   npm run install:all
   ```

5. Set up environment variables:
   ```bash
   cd backend && cp .env.example .env
   cd ../frontend && cp .env.example .env
   ```

6. Run database migrations:
   ```bash
   cd backend && npm run migrate
   ```

7. Start development servers:
   ```bash
   npm run dev
   ```

## Development Workflow

### Creating a Feature Branch

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/user-authentication`)
- `fix/` - Bug fixes (e.g., `fix/login-error`)
- `docs/` - Documentation changes (e.g., `docs/api-documentation`)
- `refactor/` - Code refactoring (e.g., `refactor/user-service`)
- `test/` - Adding tests (e.g., `test/user-controller`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

### Making Changes

1. Make your changes in your feature branch
2. Write or update tests for your changes
3. Ensure all tests pass: `npm test`
4. Ensure code follows style guidelines: `npm run lint`
5. Commit your changes (see Commit Guidelines below)

## Coding Standards

### JavaScript/Node.js

- Use ES6+ syntax
- Use `const` by default, `let` when reassignment is needed
- Use arrow functions for callbacks
- Use async/await instead of callbacks or raw promises
- Use destructuring when appropriate
- Use template literals for string interpolation

**Example:**
```javascript
// Good
const getUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

// Avoid
function getUserById(id) {
  return User.findById(id).then(function(user) {
    return user;
  });
}
```

### React/Frontend

- Use functional components with hooks
- Use meaningful component names (PascalCase)
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use prop-types or TypeScript for type checking

**Example:**
```jsx
// Good
import React, { useState, useEffect } from 'react';

export const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  if (!user) return <Loading />;

  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
};
```

### File Organization

- One component per file
- Group related files in directories
- Use index files to simplify imports
- Co-locate tests with source files

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.jsx
│   │   ├── Button.test.jsx
│   │   ├── Button.css
│   │   └── index.js
│   └── index.js
```

### Naming Conventions

- **Files**: kebab-case for general files, PascalCase for components
- **Variables/Functions**: camelCase
- **Classes/Components**: PascalCase
- **Constants**: UPPER_SNAKE_CASE
- **Private functions**: prefix with underscore `_functionName`

## Commit Guidelines

### Commit Message Format

Use the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, semicolons, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Examples:**
```bash
feat(auth): add password reset functionality

fix(api): resolve CORS issue for production domain

docs(readme): update installation instructions

test(user): add unit tests for user service

refactor(db): optimize database queries
```

### Commit Best Practices

- Make atomic commits (one logical change per commit)
- Write clear, concise commit messages
- Reference issue numbers when applicable
- Commit early and often

## Pull Request Process

### Before Submitting

1. **Update your branch** with the latest upstream changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run all checks**:
   ```bash
   npm test
   npm run lint
   npm run build
   ```

3. **Update documentation** if needed

4. **Add/update tests** for your changes

### Submitting a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Go to the repository on GitHub and create a Pull Request

3. Fill out the PR template with:
   - Clear description of changes
   - Related issue numbers
   - Screenshots (for UI changes)
   - Testing instructions
   - Checklist completion

### PR Title Format

Use the same format as commit messages:
```
feat(auth): add OAuth login support
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Related Issues
Fixes #123
Related to #456

## Changes Made
- Added OAuth login functionality
- Updated authentication middleware
- Added tests for OAuth flow

## Screenshots (if applicable)
![Screenshot](url)

## Testing Instructions
1. Run the application
2. Click "Login with OAuth"
3. Verify successful login

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Code follows style guidelines
- [ ] All tests passing
- [ ] No breaking changes (or documented)
```

### Review Process

- At least one maintainer approval required
- All CI checks must pass
- Address review comments promptly
- Be open to feedback and suggestions

## Testing Guidelines

### Writing Tests

- Write tests for all new features
- Maintain or increase code coverage
- Test edge cases and error conditions
- Use descriptive test names

### Test Structure

```javascript
describe('UserController', () => {
  describe('createUser', () => {
    it('should create a new user with valid data', async () => {
      // Arrange
      const userData = { email: 'test@example.com', name: 'Test User' };
      
      // Act
      const result = await userController.createUser(userData);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.email).toBe(userData.email);
    });

    it('should throw error with invalid email', async () => {
      // Arrange
      const userData = { email: 'invalid', name: 'Test User' };
      
      // Act & Assert
      await expect(userController.createUser(userData))
        .rejects.toThrow('Invalid email');
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- UserController.test.js
```

## Documentation

### Code Comments

- Comment complex logic
- Avoid obvious comments
- Use JSDoc for functions and classes

```javascript
/**
 * Fetches user by ID from the database
 * @param {string} id - User ID
 * @returns {Promise<User>} User object
 * @throws {NotFoundError} When user doesn't exist
 */
async function getUserById(id) {
  // Implementation
}
```

### README Updates

- Update README for feature changes
- Include usage examples
- Update API documentation
- Add screenshots for UI changes

### API Documentation

- Document all API endpoints
- Include request/response examples
- Document error responses
- Update API version if needed

## Questions?

- Check existing issues and discussions
- Ask in project discussions
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (ISC License).

---

Thank you for contributing! 🎉
