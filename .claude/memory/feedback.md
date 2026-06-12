---
name: feedback-log
description: Learned patterns, corrections, and validated approaches
type: feedback
---

# Feedback Log

## Validated Approaches

### Feature Module Structure

- **Pattern**: `features/{name}/` with components, hooks, services, types
- **Why**: User confirmed this structure works well
- **How to apply**: Follow for all new features

### React Query for Server State

- **Pattern**: Use React Query with 5-minute staleTime default
- **Why**: Works well for this project's data patterns
- **How to apply**: Create hooks in `hooks/use{Feature}.ts`

### TypeORM Migrations

- **Pattern**: Manual generation, explicit naming with timestamp
- **Why**: Gives control over schema changes
- **How to apply**: Always generate migration after entity changes

---

## Corrections & Adjustments

### Monorepo Structure

- **Correction**: User clarified apps/web and apps/security-web are separate concerns
- **Why**: Different user personas and workflows
- **How to apply**: Don't try to merge or share too much between apps

### Backend Separation

- **Correction**: api-gateway is ONLY for Amigo integration
- **Why**: Separates external dependencies
- **How to apply**: Business logic goes in ecms-backend, not api-gateway

---

## Preferences Learned

### Code Generation

- **Preference**: Generate complete, working code (not placeholders)
- **Why**: User prefers to review complete implementations
- **How to apply**: Write full functions, not `// TODO` comments

### Error Handling

- **Preference**: Comprehensive error handling with user-friendly messages
- **Why**: Production-ready code expected
- **How to apply**: Always add try-catch, toast notifications, error boundaries

### Vietnamese Comments

- **Preference**: Acceptable for complex business logic explanations
- **Why**: Team is Vietnamese, helps understanding
- **How to apply**: Use Vietnamese for domain-specific explanations

---

## Anti-Patterns to Avoid

### Over-Engineering

- **Avoid**: Creating abstractions for single-use cases
- **Why**: User prefers simplicity
- **Alternative**: Write straightforward code, refactor when needed

### Hardcoded Values

- **Avoid**: Magic numbers, hardcoded URLs
- **Why**: Maintenance nightmare
- **Alternative**: Constants, environment variables

### Missing Types

- **Avoid**: Using `any` or implicit types
- **Why**: TypeScript strict mode enforced
- **Alternative**: Explicit interfaces, proper typing

---

## Testing Approach

- **Preference**: Unit tests for utilities, integration for APIs
- **Coverage target**: 80%
- **Tools**: Vitest (frontend), Jest (backend), Playwright (E2E)
- **How to apply**: Write tests alongside code, not after

---

## Document Update Rules

1. **When to update**: After explicit feedback or observed patterns
2. **What to record**: Non-obvious preferences, corrections, validated patterns
3. **What to skip**: Already documented in CLAUDE.md, obvious best practices

---

*Last updated: 2025-03-25*