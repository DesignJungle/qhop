# Contributing to QHop

Thank you for your interest in contributing to QHop! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- Android Studio (for mobile development)

### Setup Development Environment

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/yourusername/qhop.git
   cd qhop
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start development server**:
   ```bash
   npm run dev
   ```

## 🔄 Development Workflow

### Branch Naming Convention
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Critical fixes
- `docs/description` - Documentation updates

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(queue): add real-time position updates
fix(auth): resolve login validation issue
docs(readme): update installation instructions
```

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm run test.unit

# E2E tests
npm run test.e2e

# Lint code
npm run lint
```

### Test Requirements
- All new features must include tests
- Bug fixes should include regression tests
- Maintain test coverage above 80%

## 📱 Mobile Development

### Android Testing
```bash
npm run build
npx cap sync android
npx cap run android
```

### iOS Testing (when available)
```bash
npm run build
npx cap sync ios
npx cap run ios
```

## 🎨 Code Style

### TypeScript Guidelines
- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type when possible

### Component Guidelines
- Use functional components with hooks
- Follow the QHop design system
- Implement proper error boundaries

### CSS Guidelines
- Use CSS custom properties for theming
- Follow BEM naming convention for custom classes
- Prefer Ionic components when possible

## 📝 Documentation

### Code Documentation
- Add JSDoc comments for complex functions
- Document component props with TypeScript interfaces
- Include usage examples for new components

### README Updates
- Update README for new features
- Include setup instructions for new dependencies
- Add screenshots for UI changes

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Platform/browser information
- Screenshots if applicable

## 💡 Feature Requests

For new features, please provide:
- Clear use case description
- User story format
- UI/UX considerations
- Technical requirements

## 🔍 Code Review Process

### Before Submitting PR
- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] Self-review completed
- [ ] No merge conflicts

### Review Criteria
- Code quality and readability
- Test coverage
- Performance impact
- Security considerations
- UI/UX consistency

## 🏷️ Release Process

### Version Numbering
We follow [Semantic Versioning](https://semver.org/):
- `MAJOR.MINOR.PATCH`
- Major: Breaking changes
- Minor: New features
- Patch: Bug fixes

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Tagged release

## 📞 Getting Help

- **Issues**: Use GitHub Issues for bugs and features
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact maintainers for security issues

## 🙏 Recognition

Contributors will be recognized in:
- README contributors section
- Release notes
- GitHub contributors page

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to QHop! 🎉
