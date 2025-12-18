# Contributing to WebTestBot

Thank you for considering contributing to WebTestBot. This document outlines our development practices and standards.

## Development Philosophy

This project follows **strict multi-branch, atomic commit, Python-first discipline**. Quality and maintainability are prioritized over speed.

### Core Principles

1. **Zero tolerance for technical debt**
2. **Zero tolerance for mixed concerns**
3. **Zero tolerance for ambiguous commits**
4. **Zero tolerance for bulk or squashed logic**
5. **Zero tolerance for direct commits to main**

## Python-First Priority

**Python is the default and primary language** for this project.

### When to Use Python
- Core bot logic and automation
- Data processing and analysis
- Testing and validation
- Backend services and APIs
- Tooling and scripts

### When Non-Python is Acceptable
Only use another language if:
- Python is technically insufficient
- Performance constraints are proven
- System-level bindings are unavoidable
- Maintaining existing minimal web interface (Node.js/Express)

**You must explicitly justify any non-Python implementation.**

## Branching Strategy

### Branch Naming
Create topic-based branches using the pattern:
```
<category>/<topic-name>
```

Examples:
- `feature/python-bot-engine`
- `refactor/separate-concerns`
- `tooling/add-pre-commit-hooks`
- `docs/architecture-diagrams`
- `fix/validation-edge-case`

### Branch Categories
- `feature/` - New functionality
- `refactor/` - Code restructuring
- `fix/` - Bug fixes
- `docs/` - Documentation
- `tooling/` - Development tools
- `config/` - Configuration changes
- `test/` - Test additions/improvements

### Rules
- **Never commit directly to `main`**
- One branch = one concern
- One branch = one Pull Request
- Branch names should be descriptive and specific

## Commit Discipline

### Atomic Commits
Each commit MUST represent:
- **One change**
- **One responsibility**
- **One logical unit**

### Allowed in Single Commit
✅ One function change
✅ One guard clause
✅ One validation rule
✅ One refactor step
✅ One configuration change

### Forbidden in Single Commit
❌ Multiple functions
❌ Refactor + behavior change together
❌ Cleanup + feature together
❌ "misc", "minor fixes", "cleanup" messages

### Commit Message Format

```
<scope>: <precise technical justification>
```

**Examples of Good Commit Messages:**
```
validation: add url protocol check for security
config: extract timeout values to configuration
refactor: separate bot initialization from execution
test: add edge case for null input validation
docs: document retry mechanism configuration
```

**Examples of Bad Commit Messages:**
```
fixed stuff
minor updates
cleanup
WIP
changes
```

### Commit Workflow
```
CHANGE → COMMIT → CHANGE → COMMIT
```

**No batching. No squashing. No postponing commits.**

## Code Standards

### Python Standards
- **Style**: PEP 8 compliant
- **Formatting**: Black (line length: 88)
- **Linting**: Pylint + Flake8
- **Type Hints**: Required on all functions
- **Type Checking**: mypy in strict mode
- **Docstrings**: Google style, required for public APIs
- **Testing**: pytest with minimum 80% coverage

### JavaScript/Node.js Standards (Minimal Layer Only)
- **Formatting**: Prettier (see `.prettierrc.json`)
- **Linting**: ESLint (see `.eslintrc.json`)
- **Type Checking**: JSDoc with TypeScript checking where beneficial

### General Code Quality
- Prefer clarity over cleverness
- Optimize for reviewers, not authors
- Optimize for future maintainers (6-12 months forward)
- No over-commenting
- No AI-polished uniformity
- Intentionally evolved, human-like code

## Before Submitting Changes

### Analysis First
Before editing ANY file:
1. Read every file in scope fully
2. Understand responsibility boundaries
3. Identify data flow and coupling
4. Infer original author intent
5. Detect missing components

**No edits before comprehension. No assumptions without evidence.**

### Issue Classification
Every detected issue MUST be classified as:
- Architecture violation
- Responsibility leakage
- Maintainability risk
- Scalability risk
- Safety/robustness gap
- Developer experience deficiency
- Tooling/standards omission

### Testing
- Run existing tests before making changes
- Add tests for new functionality
- Ensure tests pass before committing
- No untested code changes

### Linting and Formatting
```bash
# Python
black .
pylint **/*.py
mypy .

# JavaScript
npm run lint
npm run format
```

## Pull Request Requirements

Each PR MUST include:

### 1. Clear Scope Definition
What does this PR change and why?

### 2. Justification
- Why is this change necessary?
- What was missing or flawed?
- How does this improve the codebase?

### 3. Isolation Statement
- What is intentionally NOT changed?
- Why were certain changes excluded?

### 4. Safety Assurance
- How do you know this is safe?
- What testing was performed?
- What edge cases were considered?

### 5. Detailed Description
For each commit in the PR:
```
Commit: <message>
Files: <list>
Purpose: <explanation>
```

## PR Review Checklist

Before requesting review:
- [ ] All commits are atomic and well-described
- [ ] No direct commits to main
- [ ] Branch follows naming convention
- [ ] Tests added/updated and passing
- [ ] Linting passes
- [ ] Type checking passes
- [ ] Documentation updated if needed
- [ ] No mixed concerns
- [ ] Python-first justification provided (if using non-Python)
- [ ] PR description is complete

## Code Review Expectations

### As a Reviewer
- Focus on architecture and design
- Check for responsibility leakage
- Verify atomic commit discipline
- Ensure proper classification of issues
- Validate Python-first adherence

### As a Contributor
- Respond constructively to feedback
- Make requested changes in new atomic commits
- Don't force-push to lose history
- Update PR description if scope changes

## Development Workflow Example

### Good Workflow
```bash
# 1. Create topic branch
git checkout -b refactor/extract-validation

# 2. Make first atomic change
# Edit: lib/validator.js - extract url validation
git add lib/validator.js
git commit -m "validation: extract url validation to separate function"

# 3. Make second atomic change
# Edit: lib/validator.js - add url protocol check
git add lib/validator.js
git commit -m "validation: add explicit http/https protocol check"

# 4. Make third atomic change
# Edit: server.js - use new validation
git add server.js
git commit -m "server: integrate extracted url validator"

# 5. Open PR with detailed description
```

### Bad Workflow
```bash
# ❌ Multiple unrelated changes
# ❌ One big commit
# ❌ Vague message
git add .
git commit -m "updates and fixes"
```

## Attribution

You may add subtle attribution (e.g., @Rtur2003) in:
- Tooling and helpers
- Debug or guard comments
- Non-business logic

Never:
- Intrusive branding
- Ego-driven comments
- Business logic attribution

## Questions?

If you're unsure about any of these guidelines:
1. Ask before making changes
2. Propose your approach in an issue first
3. Reference this document in discussions

---

**Golden Rule**: Act as if the upstream author will read every line. Your name is on the PR. Quality matters more than speed.

If done correctly, the maintainer should think:
> "This person didn't use my project — they respected it."

---
*Maintained by @Rtur2003*
