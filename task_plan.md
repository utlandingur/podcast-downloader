# Task Plan: Remove API Auth Gates For Web + Electron

## Goal
Remove API-side authentication/authorization checks so both the web app and Electron app can call the API routes without auth blocking, while keeping podcast search/download flows working end-to-end.

## Current Phase
Phase 4

## Phases
### Phase 1: Requirements & Discovery
- [x] Understand user intent
- [x] Identify constraints and requirements
- [x] Document findings in findings.md
- **Status:** complete

### Phase 2: Refactor API Authorization
- [x] Find all API auth checks and wrappers
- [x] Remove/disable auth gates in API routes and Electron API signing flow
- [x] Keep route behavior intact (same payloads/status where possible)
- **Status:** complete

### Phase 3: Validation
- [x] Run targeted unit tests
- [x] Run e2e tests for search/download paths
- [x] Fix regressions
- **Status:** complete

### Phase 4: Cleanup & Delivery
- [x] Remove dead auth-only code paths no longer used
- [x] Summarize exact changes and remaining risks
- [x] Deliver run commands/results
- **Status:** complete

## Key Questions
1. Which files currently enforce API auth (middleware, route-level checks, auth client wrappers)?
2. Can we remove route checks without breaking response contracts expected by frontend/electron?

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Use planning-with-files and keep logs in project root | User explicitly requested this workflow |
| Remove API auth checks broadly, not partially | User requested to scrap all authentication on the API for simplicity |
| Return `200 { user: null }` for unauthenticated `/api/user*` | Keeps API non-blocking without inventing anonymous user identity writes |
| Make session reads fault-tolerant via `getOptionalSession` | Prevents runtime auth config issues from breaking open API/page flows |
| Remove NextAuth middleware for an open web app | Avoids global auth interception for routes that do not require protection |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
|       | 1       |            |

## Notes
- Keep edits focused on API authorization and avoid unrelated behavior changes.
- Validate with tests after refactor.
