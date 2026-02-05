const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  downloadEpisode: (payload) => ipcRenderer.invoke('download-episode', payload),
  openAuthWindow: (payload) => ipcRenderer.invoke('open-auth-window', payload),
  authSignIn: () => ipcRenderer.invoke('auth-sign-in'),
  authGetSession: () => ipcRenderer.invoke('auth-get-session'),
  authSignOut: () => ipcRenderer.invoke('auth-sign-out'),
  remoteRequest: (payload) => ipcRenderer.invoke('remote-request', payload),
});
