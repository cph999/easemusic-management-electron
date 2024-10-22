import { app, BrowserWindow } from 'electron';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '..');

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

let win;

function createWindow() {
  console.log('Creating window...');
  console.log("__dirname", __dirname)
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'), // 确保预加载文件路径正确
      contextIsolation: true, // 如果需要隔离上下文，请确保这符合你的应用需求
      enableRemoteModule: false, // 根据需要启用或禁用
      nodeIntegration: true, // 如果你的 React 项目需要 Node.js 的 API，则为 `true`
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    console.log('Window finished loading');
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // If VITE_DEV_SERVER_URL is defined, load it (useful for development)
  console.log("VITE_DEV_SERVER_URL", VITE_DEV_SERVER_URL)

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL).catch(err => {
      console.error('Failed to load URL:', err);
    });
  } else {
    // For production, load the index.html from the `dist` folder
    const indexPath = path.join(__dirname, '../dist/index.html');
    console.log('Loading index from:', indexPath);
    win.loadFile(indexPath).catch(err => {
      console.error('Failed to load index.html:', err);
    });

    win.webContents.on('did-finish-load', () => {
      console.log('Page loaded successfully');
    });
  }
}

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// When the app is ready, create the window
app.whenReady().then(() => {
  console.log('App is ready');
  createWindow();
});
