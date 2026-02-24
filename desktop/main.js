const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const net = require('net');
const { fork } = require('child_process');
const { pipeline } = require('stream/promises');

const DEFAULT_START_URL = 'http://localhost:3000';
let startUrl = process.env.ELECTRON_START_URL || DEFAULT_START_URL;
const STORAGE_PARTITION = 'persist:podcasttomp3';
const USER_DATA_DIR = path.join(app.getPath('appData'), 'PodcastToMp3');
const REMOTE_API_BASE =
  process.env.ELECTRON_REMOTE_API_BASE ||
  process.env.NEXT_PUBLIC_REMOTE_API_BASE ||
  'https://podcasttomp3.com';
const LOCAL_SERVER_DIR =
  process.env.ELECTRON_APP_DIR ||
  (app.isPackaged ? app.getAppPath() : path.join(__dirname, '..'));
const LOCAL_SERVER_PORT = process.env.ELECTRON_SERVER_PORT
  ? Number.parseInt(process.env.ELECTRON_SERVER_PORT, 10)
  : 3000;

app.setPath('userData', USER_DATA_DIR);

let baseOrigin = (() => {
  try {
    return new URL(startUrl).origin;
  } catch {
    return null;
  }
})();

const remoteOrigin = (() => {
  try {
    return new URL(REMOTE_API_BASE).origin;
  } catch {
    return null;
  }
})();

const isSameOrigin = (url) => {
  if (!baseOrigin) return false;
  try {
    return new URL(url).origin === baseOrigin;
  } catch {
    return false;
  }
};

const updateStartUrl = (url) => {
  startUrl = url;
  try {
    baseOrigin = new URL(url).origin;
  } catch {
    baseOrigin = null;
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
      .listen(port, '127.0.0.1');
  });

const findAvailablePort = async (startPort) => {
  let port = startPort;
  for (let i = 0; i < 20; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const available = await checkPortAvailable(port);
    if (available) return port;
    port += 1;
  }
  return startPort;
};


const AUTH_HOSTS = new Set(['accounts.google.com']);
const isAuthUrl = (url) => {
  try {
    const { hostname } = new URL(url);
    return AUTH_HOSTS.has(hostname);
  } catch {
    return false;
  }
};

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
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

let mainWindow;
let authWindow;
let nextServerProcess;

const openAuthWindow = ({ url: authUrl, successOrigin }) =>
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

    const cleanup = (result) => {
      if (authWindow && !authWindow.isDestroyed()) {
        authWindow.close();
      }
      authWindow = null;
      resolve(result);
    };

    authWindow.once('ready-to-show', () => authWindow?.show());
    authWindow.on('closed', () => {
      authWindow = null;
      resolve({ success: false, error: 'Auth window closed.' });
    });

    const isSuccessOrigin = (targetUrl) => {
      if (!successOrigin) return false;
      try {
        return new URL(targetUrl).origin === successOrigin;
      } catch {
        return false;
      }
    };

    const handleNavigate = (url) => {
      if (isSuccessOrigin(url)) {
        cleanup({ success: true });
        return;
      }
      if (isSameOrigin(url)) {
        cleanup({ success: true });
      }
    };

    authWindow.webContents.on('will-navigate', (event, url) => {
      if (isSuccessOrigin(url)) {
        event.preventDefault();
        handleNavigate(url);
        return;
      }
      if (isSameOrigin(url)) {
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
    const sanitizedUA = currentUA.replace(/\sElectron\/\d+\.\d+\.\d+/, '');
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

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isSameOrigin(url)) {
      mainWindow.loadURL(url);
      return { action: 'deny' };
    }
    if (isAuthUrl(url)) {
      openAuthWindow({ url, successOrigin: baseOrigin });
      return { action: 'deny' };
    }
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!isSameOrigin(url)) {
      event.preventDefault();
      if (isAuthUrl(url)) {
        openAuthWindow({ url, successOrigin: baseOrigin });
      } else {
        shell.openExternal(url);
      }
    }
  });
};

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
      NEXT_PUBLIC_REMOTE_API_BASE: REMOTE_API_BASE,
    },
    stdio: 'inherit',
  });

  updateStartUrl(`http://127.0.0.1:${port}`);
};

const fetchRemote = async ({ path, method, headers, body }) => {
  if (!mainWindow || !remoteOrigin) {
    return { ok: false, status: 500, data: { error: 'Remote not available' } };
  }

  const target = new URL(path, REMOTE_API_BASE);
  if (target.origin !== remoteOrigin) {
    return { ok: false, status: 400, data: { error: 'Invalid remote path' } };
  }

  const requestHeaders = { ...(headers || {}) };

  let bodyString = '';
  if (body !== undefined) {
    bodyString = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const requestInit = {
    method: method || 'GET',
    headers: requestHeaders,
  };

  if (body !== undefined) {
    requestInit.body = bodyString;
    if (!requestInit.headers['Content-Type']) {
      requestInit.headers['Content-Type'] = 'application/json';
    }
  }

  const response = await mainWindow.webContents.session.fetch(
    target.toString(),
    { ...requestInit, credentials: 'include' },
  );

  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();
  let data = text;
  if (contentType.includes('application/json')) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  return { ok: response.ok, status: response.status, data };
};

ipcMain.handle('remote-request', async (_event, payload) => {
  if (!payload || typeof payload.path !== 'string') {
    return { ok: false, status: 400, data: { error: 'Invalid payload' } };
  }
  try {
    return await fetchRemote(payload);
  } catch (error) {
    return {
      ok: false,
      status: 500,
      data: { error: error instanceof Error ? error.message : String(error) },
    };
  }
});

ipcMain.handle('auth-sign-in', async () => {
  if (!remoteOrigin) {
    return { success: false, error: 'Remote origin not configured.' };
  }
  const authUrl = `${REMOTE_API_BASE}/api/auth/signin/google?callbackUrl=${encodeURIComponent(
    REMOTE_API_BASE,
  )}`;
  return openAuthWindow({ url: authUrl, successOrigin: remoteOrigin });
});

ipcMain.handle('auth-get-session', async () => {
  const response = await fetchRemote({
    path: '/api/auth/session',
    method: 'GET',
  });
  if (!response.ok) {
    return { session: null, error: response.data?.error || 'Unauthorized' };
  }
  return { session: response.data ?? null };
});

ipcMain.handle('auth-sign-out', async () => {
  if (!mainWindow || !remoteOrigin) {
    return { success: false, error: 'Remote origin not available.' };
  }
  try {
    const cookies = await mainWindow.webContents.session.cookies.get({
      url: remoteOrigin,
    });
    await Promise.all(
      cookies.map((cookie) =>
        mainWindow.webContents.session.cookies.remove(
          remoteOrigin,
          cookie.name,
        ),
      ),
    );
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
});

app.whenReady().then(async () => {
  await startLocalServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (nextServerProcess && !nextServerProcess.killed) {
    nextServerProcess.kill();
  }
});
