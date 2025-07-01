const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const os = require("os");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 1200,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Handle folder creation
ipcMain.on("create-folder", (event, pin) => {
  const baseDir = path.join(os.homedir(), "JCB_PIN_FOLDERS");
  const folderPath = path.join(baseDir, pin);

  try {
    if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
      console.log("✅ Folder created:", folderPath);
    } else {
      console.log("⚠️ Folder already exists:", folderPath);
    }
  } catch (err) {
    console.error("❌ Failed to create folder:", err);
  }
});
