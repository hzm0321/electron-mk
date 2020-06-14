const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const menuTemplate = require('./src/menuTemplate.js');
const AppWindow = require('./src/AppWindow');
let mainWindow, setWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 680,
    webPreferences: {
      nodeIntegration: true
    }
  })
  const urlLocation = isDev ? 'http://localhost:3000' : 'test';
  mainWindow.loadURL(urlLocation);
  mainWindow.webContents.openDevTools();
  mainWindow.on('closed', () => {
    mainWindow = null;
  })
  // 设置窗口
  ipcMain.on('open-settings-window', () => {
    setWindow = new BrowserWindow({
      width: 500,
      height: 500,
      webPreferences: {
        nodeIntegration: true
      },
      parent: mainWindow
    })
    const setUrlLocation = isDev ? 'http://localhost:3000/set' : 'test';
    setWindow.loadURL(setUrlLocation);
    setWindow.on('closed', () => {
      setWindow = null;
    })
  })
  // 设置菜单
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
})

