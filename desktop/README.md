# PodcastToMp3 Desktop (Electron)

This Electron wrapper loads the existing Next.js app and routes episode downloads through the Electron main process to avoid renderer CORS issues.

## Development

```bash
yarn electron:dev
```

This starts `next dev` (Electron build mode) and then launches Electron pointed at `http://localhost:3000`.

## Production-like run

```bash
yarn build:electron
yarn electron:start
```

This runs `next start` (Electron build mode) and then launches Electron.

## Packaged app behavior

When packaged, Electron auto-starts a local Next server (no terminal required) and loads `http://127.0.0.1:<port>`.
Set `ELECTRON_APP_DIR` if your packaged app stores the Next output in a custom path.
Set `ELECTRON_SERVER_PORT` to override the default port.

## Packaging

```bash
yarn electron:pack
```

Build output is placed in `dist/`.

## Config

- `ELECTRON_START_URL`: override the URL Electron loads (defaults to `http://localhost:3000`).
- `ELECTRON_REMOTE_API_BASE`: remote backend base URL (defaults to `https://podcasttomp3.com`).
- `NEXT_PUBLIC_REMOTE_API_BASE`: same value for the Next server (used by server actions in Electron build).
- Downloads are saved into the OS Downloads folder with collision-safe filenames.
