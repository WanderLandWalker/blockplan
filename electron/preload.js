const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("blockplanShell", {
  platform: "windows",
  version: "0.2.4",
});
