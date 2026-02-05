# Findings & Decisions

## Requirements
- Desktop app must look/work the same as the existing web app.
- Downloads should be performed outside the renderer to avoid CORS issues.
- Existing hosted web app behavior must remain unchanged.
- Electron issues to fix: Google login, download state persistence, bulk spinner.
- Hybrid mode requires remote backend for secrets (Podcast Index, Google, DB).

## Research Findings
- `src/lib/downloadEpisodeFile.ts` performs a renderer `fetch` and blob download, which is the CORS pain point.
- `DownloadPodcastButton` routes all episode downloads through `downloadEpisodeFile`.
- `LoginPortal` uses `signIn('google')` which navigates to Google; Electron blocks non-origin navigation.
- Downloaded state only persists for logged-in users via Mongo (`addDownloadedEpisode`).
- Bulk spinner UI depends on `bulkProgress.active` in `EpisodesView`.
- Server components use `auth()` and Podcast Index server actions; Electron build must avoid local secrets.

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Add Electron main + preload with IPC download handler | Moves network fetch to Node/Electron main to avoid CORS while keeping renderer UI intact |
| Add an Electron-only branch in `downloadEpisodeFile` | Keeps web behavior unchanged; only Electron uses IPC |
| Add Electron auth window flow | Keep OAuth cookies in Electron session while avoiding external browser |
| Add local download-state persistence when logged out | Provide desktop-friendly persistence without server login |
| Move Electron-only code into `.electron.ts` helper | Keep renderer code clean and web-safe |
| Use persistent Electron session + userData path | Ensure localStorage survives app restarts |
| Prefer `.electron.*` modules in Electron builds | Keep Electron-specific code isolated from web builds |
| Hybrid mode uses remote API + Electron IPC for auth | No secrets locally; auth via remote session cookies |
| Packaged app starts local Next server | Enables fully local UI with server actions without exposing secrets |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| `rg` not available | Used `grep -R` instead |

## Resources
-
