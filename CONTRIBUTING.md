# Contributing to VizLock

Thank you for your interest in contributing to VizLock! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- npm, yarn, or pnpm installed
- MongoDB installed or access to MongoDB Atlas
- Git installed
- A code editor (VS Code recommended)

### Setting Up Development Environment

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/your-username/visual-lock-security.git
   cd visual-lock-security
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Verify the setup**
   - Open http://localhost:3000
   - You should see the application running

## Development Workflow

### Branch Strategy

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/**: Feature branches (e.g., `feature/add-rate-limiting`)
- **bugfix/**: Bug fix branches (e.g., `bugfix/fix-coordinate-matching`)
- **hotfix/**: Critical production fixes (e.g., `hotfix/security-patch`)

### Creating a Branch

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or use the shorthand
git switch -c feature/your-feature-name
```

### Branch Naming Convention

- Use descriptive names in kebab-case
- Prefix with type: `feature/`, `bugfix/`, `hotfix/`, `docs/`
- Examples:
  - `feature/add-password-reset`
  - `bugfix/fix-login-redirect`
  - `docs/update-api-documentation`

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode (already configured)
- Avoid `any` type; use proper types or `unknown`
- Use interfaces for object shapes
- Use type aliases for unions and intersections

**Example**:
```typescript
// ✅ Good
interface User {
  username: string;
  passwordCoords: Coordinate[];
}

type Status = 'pending' | 'active' | 'inactive';

// ❌ Avoid
const user: any = { ... };
```

### React/Next.js

- Use functional components with hooks
- Prefer Server Components when possible
- Use `'use client'` only when necessary
- Extract reusable logic into custom hooks
- Keep components small and focused

**Example**:
```typescript
// ✅ Good - Server Component
export default async function DashboardPage() {
  const data = await fetchData();
  return <Dashboard data={data} />;
}

// ✅ Good - Client Component when needed
'use client';
export function InteractiveButton() {
  const [state, setState] = useState();
  // ...
}
```

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings (when consistent with project)
- Use semicolons (when consistent with project)
- Maximum line length: 100 characters
- Use meaningful variable and function names

### File Naming

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **API Routes**: lowercase (e.g., `route.ts`)
- **Pages**: lowercase (e.g., `page.tsx`)

### Import Organization

```typescript
// 1. External dependencies
import React from 'react';
import { NextResponse } from 'next/server';

// 2. Internal modules (@ alias)
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

// 3. Relative imports
import { Button } from './components/Button';

// 4. Type imports (if separate)
import type { User as UserType } from '@/types';
```

### Error Handling

- Always handle errors appropriately
- Provide meaningful error messages
- Use try-catch blocks for async operations
- Return proper HTTP status codes in API routes

**Example**:
```typescript
export async function POST(req: Request) {
  try {
    const data = await req.json();
    // Validation
    if (!data.username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }
    // Business logic
    const result = await processData(data);
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Commit Guidelines

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
feat(auth): add password reset functionality

fix(api): correct coordinate matching tolerance

docs(readme): update installation instructions

refactor(components): extract reusable button component

style(ui): format code with prettier
```

### Commit Best Practices

- Make small, focused commits
- Write clear, descriptive commit messages
- One logical change per commit
- Test your changes before committing

## Pull Request Process

### Before Submitting

1. **Update your branch**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run linting**
   ```bash
   npm run lint
   ```

3. **Test your changes**
   - Test manually in the browser
   - Verify no console errors
   - Test edge cases

4. **Update documentation**
   - Update README if needed
   - Add API documentation if adding endpoints
   - Update code comments

### Creating a Pull Request

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create PR on GitHub**
   - Use a descriptive title
   - Provide a detailed description
   - Reference related issues
   - Add screenshots if UI changes

3. **PR Template** (fill out all relevant sections):

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated (if applicable)
```

### PR Review Process

1. **Automated Checks**
   - Linting passes
   - TypeScript compiles
   - No merge conflicts

2. **Code Review**
   - At least one approval required
   - Address review comments
   - Keep PR focused and small

3. **Merge**
   - Squash and merge (preferred)
   - Clean commit history
   - Delete feature branch after merge

## Testing

### Manual Testing

Before submitting, test:

- [ ] Application runs without errors
- [ ] New features work as expected
- [ ] Existing features still work
- [ ] UI looks correct on different screen sizes
- [ ] Dark mode works (if UI changes)

### Test Checklist

- [ ] Registration flow
- [ ] Login flow
- [ ] Logout functionality
- [ ] Dashboard access
- [ ] Route protection
- [ ] Error handling
- [ ] Form validation

### Future: Automated Testing

Consider adding:
- Unit tests (Jest, Vitest)
- Integration tests
- E2E tests (Playwright, Cypress)
- API tests

## Documentation

### Code Documentation

- Add JSDoc comments for functions
- Explain complex logic
- Document API parameters and return types
- Keep comments up-to-date

**Example**:
```typescript
/**
 * Authenticates a user with username and coordinate pattern.
 * 
 * @param username - User's unique identifier
 * @param coords - Array of 5 coordinate objects {x, y}
 * @returns Promise resolving to authentication token or null
 * @throws {Error} If authentication fails
 */
async function authenticateUser(
  username: string,
  coords: Coordinate[]
): Promise<string | null> {
  // Implementation
}
```

### Documentation Updates

When adding features, update:
- README.md (if needed)
- API.md (for API changes)
- ARCHITECTURE.md (for architectural changes)
- Inline code comments

## Reporting Issues

### Bug Reports

When reporting bugs, include:

1. **Description**: Clear description of the bug
2. **Steps to Reproduce**: Detailed steps
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**:
   - OS and version
   - Browser and version
   - Node.js version
6. **Screenshots**: If applicable
7. **Console Errors**: Any error messages

### Issue Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node.js: [e.g., 20.10.0]

**Additional context**
Add any other context about the problem.
```

## Feature Requests

When requesting features:

1. **Clear Description**: What feature do you want?
2. **Use Case**: Why is this feature needed?
3. **Proposed Solution**: How should it work?
4. **Alternatives**: Other solutions considered

### Feature Request Template

```markdown
**Feature Description**
Clear description of the feature.

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should this feature work?

**Alternatives**
Other solutions you've considered.

**Additional Context**
Any other relevant information.
```

## Getting Help

- **Documentation**: Check README.md and other docs
- **Issues**: Search existing issues
- **Discussions**: Use GitHub Discussions (if enabled)
- **Code Review**: Ask questions in PR comments

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to VizLock! 🎉
