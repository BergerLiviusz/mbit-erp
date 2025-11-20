import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  getUserDataPath: () => ipcRenderer.invoke('get-user-data-path'),
  getBackendUrl: () => ipcRenderer.invoke('get-backend-url'),
  openFolder: (path: string) => ipcRenderer.invoke('open-folder-in-explorer', path),
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
});
