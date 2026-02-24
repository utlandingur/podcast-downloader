const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const net = require('net');
const { fork } = require('child_process');
const { pipeline } = require('stream/promises');

const DEFAULT_START_URL = 'http://localhost:3000';
const DEFAULT_REMOTE_API_BASE = 'https://podcasttomp3.com';
const STORAGE_PARTITION = 'persist:podcasttomp3';
const LOOPBACK_HOST = '127.0.0.1';
const PORT_SCAN_ATTEMPTS = 20;
const SERVER_READY_TIMEOUT_MS = 15000;
const AUTH_HOSTS = new Set(['accounts.google.com']);

const ELECTRON_UA_SEGMENT_REGEX = /\sElectron\/\d+\.\d+\.\d+/;

const toErrorMessage = (error) =>
  error instanceof Error ? error.message : String(error);

const getOrigin = (value) => {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
};

let startUrl = process.env.ELECTRON_START_URL || DEFAULT_START_URL;
let baseOrigin = getOrigin(startUrl);

const USER_DATA_DIR = path.join(app.getPath('appData'), 'PodcastToMp3');
const RESOLVED_REMOTE_API_BASE =
  process.env.ELECTRON_REMOTE_API_BASE ||
  process.env.NEXT_PUBLIC_REMOTE_API_BASE ||
  DEFAULT_REMOTE_API_BASE;
const LOCAL_SERVER_DIR =
  process.env.ELECTRON_APP_DIR ||
  (app.isPackaged ? app.getAppPath() : path.join(__dirname, '..'));
const LOCAL_SERVER_PORT = process.env.ELECTRON_SERVER_PORT
  ? Number.parseInt(process.env.ELECTRON_SERVER_PORT, 10)
  : 3000;

app.setPath('userData', USER_DATA_DIR);

const updateStartUrl = (nextUrl) => {
  startUrl = nextUrl;
  baseOrigin = getOrigin(nextUrl);
};

const isSameOrigin = (url) => {
  if (!baseOrigin) return false;
  return getOrigin(url) === baseOrigin;
};

const getApiBase = () => {
  if (process.env.ELECTRON_REMOTE_API_BASE) {
    return process.env.ELECTRON_REMOTE_API_BASE;
  }
  if (!app.isPackaged && baseOrigin) {
    return baseOrigin;
  }
  return RESOLVED_REMOTE_API_BASE;
};

const getApiOrigin = () => getOrigin(getApiBase());
const getAuthBase = () => process.env.ELECTRON_AUTH_BASE || RESOLVED_REMOTE_API_BASE;
const getAuthOrigin = () => getOrigin(getAuthBase());

const isAuthUrl = (url) => {
  try {
    return AUTH_HOSTS.has(new URL(url).hostname);
  } catch {
    return false;
  }
};

const checkPortAvailable = (port) =>
  new Promise((resolve) => {
    const tester = net
      .createServer()
      .once('error', () => resolve(false))
      .once('listening', () => {
        tester.close(() => resolve(true));
      })
      .listen(port, LOOPBACK_HOST);
  });

const findAvailablePort = async (startPort) => {
  let port = startPort;
  for (let attempt = 0; attempt < PORT_SCAN_ATTEMPTS; attempt += 1) {
    // eslint-disable-next-line no-await-in-loop
    const available = await checkPortAvailable(port);
    if (available) return port;
    port += 1;
  }
  return startPort;
};

const waitForServerReady = (child, timeoutMs = SERVER_READY_TIMEOUT_MS) =>
  new Promise((resolve, reject) => {
    if (!child) {
      reject(new Error('Next server process was not created.'));
      return;
    }

    let settled = false;
    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new Error('Timed out waiting for local Next server to start.'));
    }, timeoutMs);

    const cleanup = () => {
      clearTimeout(timeout);
      child.off('message', onMessage);
      child.off('exit', onExit);
      child.off('error', onError);
    };

    const onMessage = (message) => {
      if (settled) return;
      if (!message || message.type !== 'ready') return;
      settled = true;
      cleanup();
      resolve();
    };

    const onExit = (code, signal) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(
        new Error(
          `Local Next server exited before ready (code=${code ?? 'null'}, signal=${signal ?? 'null'}).`,
        ),
      );
    };

    const onError = (error) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(error);
    };

    child.on('message', onMessage);
    child.on('exit', onExit);
    child.on('error', onError);
  });

const sanitizeFilename = (name) => {
  const trimmed = String(name || '')
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
    .replace(/\s+/g, ' ')
    .trim();
  return trimmed || 'podcast.mp3';
};

const ensureUniquePath = (dir, filename) => {
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  let candidate = path.join(dir, filename);
  let counter = 1;
  while (fs.existsSync(candidate)) {
    candidate = path.join(dir, `${base} (${counter})${ext}`);
    counter += 1;
  }
  return candidate;
};

const downloadEpisode = async (url, filename) => {
  try {
    if (typeof url !== 'string' || typeof filename !== 'string') {
      throw new Error('Invalid download request.');
    }

    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Unsupported URL protocol.');
    }

    const downloadsDir = app.getPath('downloads');
    const safeName = sanitizeFilename(filename);
    const targetPath = ensureUniquePath(downloadsDir, safeName);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Download failed (${response.status}).`);
    }
    if (!response.body) {
      throw new Error('Download response had no body.');
    }

    await pipeline(response.body, fs.createWriteStream(targetPath));
    return { success: true, path: targetPath };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
};

let mainWindow;
let authWindow;
let nextServerProcess;

const openAuthWindow = ({ url: authUrl, successOrigin, successUrl }) =>
  new Promise((resolve) => {
    if (!mainWindow) {
      resolve({ success: false, error: 'Main window not ready.' });
      return;
    }

    if (authWindow && !authWindow.isDestroyed()) {
      authWindow.focus();
      resolve({ success: false, error: 'Auth window already open.' });
      return;
    }

    authWindow = new BrowserWindow({
      width: 520,
      height: 720,
      parent: mainWindow,
      modal: true,
      show: false,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        session: mainWindow.webContents.session,
      },
    });

    let settled = false;
    const finish = (result, shouldClose = true) => {
      if (settled) return;
      settled = true;
      if (shouldClose && authWindow && !authWindow.isDestroyed()) {
        authWindow.close();
      }
      authWindow = null;
      resolve(result);
    };

    authWindow.once('ready-to-show', () => authWindow?.show());
    authWindow.on('closed', () => {
      finish({ success: false, error: 'Auth window closed.' }, false);
    });

    const matchesSuccessOrigin = (targetUrl) => {
      if (!successOrigin) return false;
      return getOrigin(targetUrl) === successOrigin;
    };

    const matchesSuccessUrl = (targetUrl) => {
      if (!successUrl) return false;
      try {
        const target = new URL(targetUrl);
        const expected = new URL(successUrl);
        return (
          target.origin === expected.origin &&
          target.pathname === expected.pathname &&
          target.search === expected.search
        );
      } catch {
        return false;
      }
    };

    const isPostAuthPage = (targetUrl) => {
      if (!matchesSuccessOrigin(targetUrl)) return false;
      try {
        return !new URL(targetUrl).pathname.startsWith('/api/auth');
      } catch {
        return false;
      }
    };

    const handleNavigate = (url) => {
      if (matchesSuccessUrl(url) || isPostAuthPage(url)) {
        finish({ success: true });
      }
    };

    authWindow.webContents.on('will-navigate', (event, url) => {
      if (matchesSuccessOrigin(url) || isSameOrigin(url)) {
        event.preventDefault();
        handleNavigate(url);
      }
    });

    authWindow.webContents.on('did-navigate', (_event, url) => {
      handleNavigate(url);
    });

    authWindow.webContents.setWindowOpenHandler(({ url }) => {
      authWindow?.loadURL(url);
      return { action: 'deny' };
    });

    const currentUA = mainWindow.webContents.getUserAgent();
    const sanitizedUA = currentUA.replace(ELECTRON_UA_SEGMENT_REGEX, '');
    authWindow.webContents.setUserAgent(sanitizedUA);
    authWindow.loadURL(authUrl);
  });

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      partition: STORAGE_PARTITION,
    },
  });

  mainWindow.loadURL(startUrl);

  const handleExternalNavigation = (url) => {
    if (isAuthUrl(url)) {
      openAuthWindow({ url, successOrigin: baseOrigin });
      return;
    }
    shell.openExternal(url);
  };

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isSameOrigin(url)) {
      mainWindow.loadURL(url);
      return { action: 'deny' };
    }
    handleExternalNavigation(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (isSameOrigin(url)) return;
    event.preventDefault();
    handleExternalNavigation(url);
  });
};

const startLocalServer = async () => {
  if (process.env.ELECTRON_START_URL) {
    updateStartUrl(process.env.ELECTRON_START_URL);
    return;
  }

  if (!app.isPackaged) {
    return;
  }

  const port = await findAvailablePort(LOCAL_SERVER_PORT);
  const serverScript = path.join(__dirname, 'next-server.js');

  nextServerProcess = fork(serverScript, [], {
    env: {
      ...process.env,
      NODE_ENV: 'production',
      NEXT_SERVER_DIR: LOCAL_SERVER_DIR,
      NEXT_SERVER_PORT: String(port),
      NEXT_PUBLIC_REMOTE_API_BASE: getApiBase(),
    },
    stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
  });

  updateStartUrl(`http://${LOOPBACK_HOST}:${port}`);
  await waitForServerReady(nextServerProcess);
};

const parseSessionResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();
  if (!contentType.includes('application/json')) {
    return text;
  }
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const fetchFromBase = async ({ base, origin, path, method, headers, body }) => {
  if (!mainWindow || !origin) {
    return { ok: false, status: 500, data: { error: 'Remote not available' } };
  }

  const target = new URL(path, base);
  if (target.origin !== origin) {
    return { ok: false, status: 400, data: { error: 'Invalid remote path' } };
  }

  const requestHeaders = { ...(headers || {}) };
  const requestInit = {
    method: method || 'GET',
    headers: requestHeaders,
  };

  if (body !== undefined) {
    requestInit.body = typeof body === 'string' ? body : JSON.stringify(body);
    if (!requestInit.headers['Content-Type']) {
      requestInit.headers['Content-Type'] = 'application/json';
    }
  }

  const response = await mainWindow.webContents.session.fetch(target.toString(), {
    ...requestInit,
    credentials: 'include',
  });

  return {
    ok: response.ok,
    status: response.status,
    data: await parseSessionResponse(response),
  };
};

const fetchRemote = async (payload) =>
  fetchFromBase({
    ...payload,
    base: getApiBase(),
    origin: getApiOrigin(),
  });

const registerIpcHandlers = () => {
  ipcMain.handle('download-episode', async (_event, payload) => {
    if (!payload) return { success: false, error: 'Missing payload.' };
    return downloadEpisode(payload.url, payload.filename);
  });

  ipcMain.handle('open-auth-window', async (_event, authUrl) => {
    if (!authUrl || typeof authUrl.url !== 'string') {
      return { success: false, error: 'Invalid auth URL.' };
    }
    return openAuthWindow({
      url: authUrl.url,
      successOrigin: authUrl.successOrigin,
    });
  });

  ipcMain.handle('remote-request', async (_event, payload) => {
    if (!payload || typeof payload.path !== 'string') {
      return { ok: false, status: 400, data: { error: 'Invalid payload' } };
    }
    try {
      return await fetchRemote(payload);
    } catch (error) {
      return { ok: false, status: 500, data: { error: toErrorMessage(error) } };
    }
  });

  ipcMain.handle('auth-sign-in', async () => {
    const authBase = getAuthBase();
    const authOrigin = getAuthOrigin();
    if (!authOrigin) {
      return { success: false, error: 'Remote origin not configured.' };
    }
    const callbackUrl = authBase.replace(/\/$/, '');
    const authUrl = `${authBase}/api/auth/signin/google?callbackUrl=${encodeURIComponent(
      callbackUrl,
    )}`;
    return openAuthWindow({ url: authUrl, successOrigin: authOrigin });
  });

  ipcMain.handle('auth-get-session', async () => {
    const response = await fetchFromBase({
      base: getAuthBase(),
      origin: getAuthOrigin(),
      path: '/api/auth/session',
      method: 'GET',
    });
    if (!response.ok) {
      return { session: null, error: response.data?.error || 'Unauthorized' };
    }
    return { session: response.data ?? null };
  });

  ipcMain.handle('auth-sign-out', async () => {
    const authOrigin = getAuthOrigin();
    if (!mainWindow || !authOrigin) {
      return { success: false, error: 'Remote origin not available.' };
    }
    try {
      const cookies = await mainWindow.webContents.session.cookies.get({
        url: authOrigin,
      });
      await Promise.all(
        cookies.map((cookie) =>
          mainWindow.webContents.session.cookies.remove(authOrigin, cookie.name),
        ),
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: toErrorMessage(error) };
    }
  });
};

const boot = async () => {
  await startLocalServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
};

registerIpcHandlers();

app
  .whenReady()
  .then(boot)
  .catch((error) => {
    console.error('Failed to start Electron app', error);
    app.quit();
  });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (nextServerProcess && !nextServerProcess.killed) {
    nextServerProcess.kill();
  }
});
