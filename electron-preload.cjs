const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  isElectron: true,
  openExternal: (url) => ipcRenderer.invoke("open-external", url),
  writeClipboard: (text) => ipcRenderer.invoke("write-clipboard", text),
});
