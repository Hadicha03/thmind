import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nodeDir = path.dirname(process.execPath);
const npm = path.join(nodeDir, process.platform === "win32" ? "npm.cmd" : "npm");
const env = { ...process.env, PATH: `${nodeDir}${path.delimiter}${process.env.PATH || ""}` };

let backendProc = null;
let frontendProc = null;
let isShuttingDown = false;

function startBackend() {
  if (isShuttingDown) return;
  console.log("▶️ [Dev Manager] Backend ishga tushirilmoqda...");
  backendProc = spawn(process.execPath, ["src/index.js"], {
    cwd: path.join(root, "backend"),
    stdio: "inherit",
    env,
  });

  backendProc.on("exit", (code) => {
    if (!isShuttingDown) {
      console.warn(`⚠️ [Dev Manager] Backend to'xtadi (kod: ${code}). 1 soniyadan keyin qayta ishga tushiriladi...`);
      setTimeout(startBackend, 1000);
    }
  });
}

function startFrontend() {
  if (isShuttingDown) return;
  console.log("▶️ [Dev Manager] Frontend ishga tushirilmoqda...");
  frontendProc = spawn(npm, ["run", "dev", "--", "--host", "127.0.0.1", "--port", "5173"], {
    cwd: path.join(root, "frontend"),
    stdio: "inherit",
    env,
    shell: process.platform === "win32",
  });

  frontendProc.on("exit", (code) => {
    if (!isShuttingDown) {
      console.warn(`⚠️ [Dev Manager] Frontend to'xtadi (kod: ${code}). 1 soniyadan keyin qayta ishga tushiriladi...`);
      setTimeout(startFrontend, 1000);
    }
  });
}

function shutdown() {
  isShuttingDown = true;
  console.log("🛑 [Dev Manager] Serverlar to'xtatilmoqda...");
  if (backendProc) backendProc.kill();
  if (frontendProc) frontendProc.kill();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startBackend();
startFrontend();
