# Task Plan: Electron Desktop App (PodcastToMp3)

## Goal
Create an Electron desktop app that mirrors the existing PodcastToMp3 web UI/UX, while performing episode downloads in the Electron main process (avoiding renderer CORS), without changing behavior of the hosted web app. Fix Electron-specific issues: Google login, download-state persistence, bulk download spinner, and hybrid mode (local UI + remote backend, no secrets locally).

## Current Phase
Phase 6

## Phases

### Phase 1: Requirements & Discovery
- [x] Understand user intent
- [x] Identify constraints
- [x] Document in findings.md
- **Status:** complete

### Phase 2: Planning & Structure
- [x] Define Electron architecture (main/preload/IPC)
- [x] Identify minimal web-app changes (electron-only path)
- [x] Create project structure
- **Status:** complete

### Phase 3: Implementation
- [x] Execute the plan
- [x] Write to files before executing
- **Status:** complete

### Phase 4: Bug Fixes (Electron)
- [x] Enable Google login flow inside Electron
- [x] Persist downloaded state locally when not logged in
- [x] Ensure bulk download spinner shows while active
- **Status:** complete

### Phase 5: Hybrid Architecture (No Secrets Locally)
- [x] Add remote API endpoints on hosted app
- [x] Electron auth/session bridge to remote NextAuth
- [x] Electron overrides for Podcast Index server actions
- [x] Electron user store to call remote user APIs
- [x] Electron page/component overrides for auth-dependent pages
- **Status:** complete

### Phase 6: Testing & Verification
- [ ] Verify requirements met
- [ ] Document test results
- **Status:** in_progress

### Phase 7: Delivery
- [ ] Review outputs
- [ ] Deliver to user
- **Status:** pending

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Add Electron wrapper + preload IPC | Keep web UI identical while moving downloads to main process |
| Use electron-only branch in `downloadEpisodeFile` | Avoid impacting web behavior; no changes when not in Electron |

## Errors Encountered
| Error | Resolution |
|-------|------------|
| `rg` not found | Switched to `grep -R` |
