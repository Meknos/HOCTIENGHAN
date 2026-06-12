---
name: project-context
description: Current project state, active work, and constraints
type: project
---

# Project Context

## Current Status (2025-03-25)

| Item | Value |
|------|-------|
| **Phase** | Dashboard & Security Tracking Implementation |
| **Focus** | Dashboard analytics, Guard management, Live tracking |
| **Sprint** | Dashboard feature development |

---

## Active Features

### Dashboard Module (apps/web)

- **Status**: In Progress
- **Files**: `apps/web/src/features/dashboard/`
- **Focus**: Charts, analytics, energy trends
- **Why**: Client requested enhanced dashboard visualization

### Security Tracking (apps/security-web + backend)

- **Status**: Phase 1 Complete, Phase 2 in progress
- **Backend**: Guard management, live tracking APIs
- **Frontend**: Live tracking page, guard management UI
- **Database**: Migrations for guard tables executed

### Guard Management Module

- **Endpoints**: CRUD for guards, shift assignments
- **Status**: Backend complete, frontend in progress
- **Files**: `services/ecms-backend/src/modules/guard-management/`

---

## Architecture Decisions

### Two-App Frontend Strategy

- **Decision**: Separate `web` and `security-web` apps
- **Why**: Different user personas (Facility managers vs Security staff)
- **How to apply**: Keep shared components minimal, feature-specific code separate

### Backend Split: api-gateway vs ecms-backend

- **api-gateway**: Amigo Platform integration only (OAuth, token management)
- **ecms-backend**: All business logic, user data, custom features
- **Why**: Separation of concerns, easier to swap external API

### Database: PostgreSQL + TypeORM

- **Migrations**: CLI-based, manual generation
- **Entities**: UUID primary keys, timestamps
- **How to apply**: Always create migrations for schema changes

---

## Constraints

### Technical

- Node.js 20+ required
- PostgreSQL 15+ required
- No MongoDB or other NoSQL databases
- All APIs must be RESTful (no GraphQL)

### Business

- Client is Aeon Vietnam - customize for their operations
- Data sourced from Amigo VEEP Platform - don't replicate
- Energy domain terminology: SLD, telemetry, MCCB, ACB

### Schedule

- MVP was delivered
- Currently in enhancement phase
- No hard deadline pressure

---

## Integration Points

| Integration | Status | Notes |
|-------------|--------|-------|
| Amigo Platform API | ✅ Working | OAuth + Gemini captcha |
| PostgreSQL | ✅ Working | TypeORM migrations |
| Google Gemini | ✅ Working | Captcha solving |
| Redis | ❌ Not used | Optional for caching |

---

## Recent Decisions

1. **2025-03**: Added dashboard module for enhanced analytics
2. **2025-03**: Implemented guard management with separate tables
3. **2025-02**: Split frontend into web + security-web

---

*How to apply*: Reference this for current priorities, avoid rehashing settled decisions, update when phase changes.*