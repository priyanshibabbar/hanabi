const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 200,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile('index.html');

  // Open DevTools for debugging if needed
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

let screenTime = 0;
let lastActiveTime = Date.now();

ipcMain.on('getScreenTime', (event) => {
  const currentActiveTime = Date.now();
  screenTime += currentActiveTime - lastActiveTime;
  lastActiveTime = currentActiveTime;
  event.returnValue = screenTime;
});

ipcMain.on('startScreenTimeTracking', () => {
  lastActiveTime = Date.now();
});

ipcMain.on('stopScreenTimeTracking', () => {
  const currentActiveTime = Date.now();
  screenTime += currentActiveTime - lastActiveTime;
  lastActiveTime = currentActiveTime;
});

// Create and set application menu
const menuTemplate = [
  {
    label: 'Application',
    submenu: [
      { label: 'About', selector: 'orderFrontStandardAboutPanel:' },
      { type: 'separator' },
      { label: 'Quit', accelerator: 'Command+Q', click: () => app.quit() }
    ]
  }
];

const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);
