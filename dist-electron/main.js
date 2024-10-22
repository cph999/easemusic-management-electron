import { app as s, BrowserWindow as l } from "electron";
import { createRequire as d } from "node:module";
import { fileURLToPath as c } from "node:url";
import e from "node:path";
d(import.meta.url);
const i = e.dirname(c(import.meta.url));
process.env.APP_ROOT = e.join(i, "..");
const t = process.env.VITE_DEV_SERVER_URL, f = e.join(process.env.APP_ROOT, "dist-electron"), p = e.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = t ? e.join(process.env.APP_ROOT, "public") : p;
let o;
function r() {
  if (console.log("Creating window..."), console.log("__dirname", i), o = new l({
    icon: e.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: e.join(i, "preload.mjs"),
      // 确保预加载文件路径正确
      contextIsolation: !0,
      // 如果需要隔离上下文，请确保这符合你的应用需求
      enableRemoteModule: !1,
      // 根据需要启用或禁用
      nodeIntegration: !0
      // 如果你的 React 项目需要 Node.js 的 API，则为 `true`
    }
  }), o.webContents.on("did-finish-load", () => {
    console.log("Window finished loading"), o == null || o.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), console.log("VITE_DEV_SERVER_URL", t), t)
    o.loadURL(t).catch((n) => {
      console.error("Failed to load URL:", n);
    });
  else {
    const n = e.join(i, "../dist/index.html");
    console.log("Loading index from:", n), o.loadFile(n).catch((a) => {
      console.error("Failed to load index.html:", a);
    }), o.webContents.on("did-finish-load", () => {
      console.log("Page loaded successfully");
    });
  }
}
s.on("window-all-closed", () => {
  process.platform !== "darwin" && (s.quit(), o = null);
});
s.on("activate", () => {
  l.getAllWindows().length === 0 && r();
});
s.whenReady().then(() => {
  console.log("App is ready"), r();
});
export {
  f as MAIN_DIST,
  p as RENDERER_DIST,
  t as VITE_DEV_SERVER_URL
};
