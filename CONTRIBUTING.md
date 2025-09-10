# Contributing to Product Review Analyzer

We welcome contributions to Product Review Analyzer! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a new branch for your feature or bug fix
4. Make your changes
5. Test your changes thoroughly
6. Submit a pull request

## Development Setup

### Prerequisites

- Python 3.8+
- Node.js 16+
- Amazon Q CLI access

### Local Development

1. Install dependencies:
```bash
pip install -r requirements.txt
cd front && npm install
```

2. Start development servers:
```bash
# Backend
python3 api_server.py

# Frontend
cd front && npm run dev
```

## Code Style

### Python

- Follow PEP 8 style guidelines
- Use type hints where appropriate
- Write docstrings for all functions and classes
- Maximum line length: 100 characters

### TypeScript/JavaScript

- Use Prettier for code formatting
- Follow ESLint rules
- Use TypeScript for type safety
- Prefer functional components with hooks

### Commit Messages

Use conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

## Testing

### Backend Tests

```bash
python3 test_pipeline.py
python3 validate_prompts.py
```

### Frontend Tests

```bash
cd front
npm test
```

## Pull Request Process

1. Ensure your code follows the style guidelines
2. Update documentation as needed
3. Add tests for new functionality
4. Ensure all tests pass
5. Update the README if needed
6. Submit a pull request with a clear description

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests for functionality

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

## Reporting Issues

When reporting issues, please include:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Python version, etc.)
- Relevant logs or error messages

## Feature Requests

For feature requests, please:

- Check existing issues first
- Provide clear use case
- Explain expected behavior
- Consider implementation complexity

## Code Review Process

All submissions require review. We use GitHub pull requests for this purpose. Reviewers will check for:

- Code quality and style
- Test coverage
- Documentation completeness
- Performance implications
- Security considerations

## Community Guidelines

- Be respectful and inclusive
- Provide constructive feedback
- Help newcomers get started
- Follow the Code of Conduct

## Questions?

If you have questions about contributing, please:

- Check existing documentation
- Search closed issues
- Ask in GitHub Discussions
- Contact maintainers directly

Thank you for contributing to Product Review Analyzer!
