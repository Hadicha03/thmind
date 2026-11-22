import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const env = { ...process.env };

let backendProc = null;
let frontendProc = null;
let isShuttingDown = false;

function isPortAvailable(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", (error) => {
      if (error.code === "EADDRINUSE") resolve(false);
      else reject(error);
    });
    server.listen(port, "127.0.0.1", () => {
      server.close((error) => {
        if (error) reject(error);
        else resolve(true);
      });
    });
  });
}

async function findAvailablePort(startPort) {
  for (let port = startPort; port <= 65535; port += 1) {
    if (await isPortAvailable(port)) return port;
  }
  throw new Error(`Bo'sh port topilmadi (${startPort} dan boshlab).`);
}

function spawnNpm(args, options) {
  if (process.platform === "win32") {
    return spawn(process.env.ComSpec || "cmd.exe", ["/d", "/c", `${npm} ${args.join(" ")}`], options);
  }
  return spawn(npm, args, options);
}

function installDependencies(directory) {
  return new Promise((resolve, reject) => {
    const installProc = spawnNpm(["ci"], {
      cwd: path.join(root, directory),
      stdio: "inherit",
      env,
    });

    installProc.on("error", reject);
    installProc.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`npm ci failed in ${directory} (code: ${code})`));
      }
    });
  });
}

async function ensureDependencies() {
  const packages = [
    { directory: "backend", dependency: "express" },
    { directory: "frontend", dependency: "vite" },
  ];

  for (const { directory, dependency } of packages) {
    const dependencyPath = path.join(root, directory, "node_modules", dependency);
    if (!existsSync(dependencyPath)) {
      console.log(`📦 [Dev Manager] ${directory} paketlari o'rnatilmoqda...`);
      await installDependencies(directory);
    }
  }
}

function stopAfterFailure(message) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.error(message);
  if (backendProc) backendProc.kill();
  if (frontendProc) frontendProc.kill();
  process.exitCode = 1;
}

function watchProcess(proc, name) {
  proc.on("error", (error) => {
    stopAfterFailure(`❌ [Dev Manager] ${name} ishga tushmadi: ${error.message}`);
  });
  proc.on("exit", (code) => {
    if (!isShuttingDown) {
      stopAfterFailure(`❌ [Dev Manager] ${name} to'xtadi (kod: ${code}).`);
    }
  });
}

function startBackend(port) {
  console.log(`▶️ [Dev Manager] Backend ${port}-portda ishga tushirilmoqda...`);
  backendProc = spawn(process.execPath, ["src/index.js"], {
    cwd: path.join(root, "backend"),
    stdio: "inherit",
    env: { ...env, PORT: String(port) },
  });
  watchProcess(backendProc, "Backend");
}

function startFrontend(port, backendPort) {
  console.log(`▶️ [Dev Manager] Frontend ${port}-portda ishga tushirilmoqda...`);
  frontendProc = spawn(process.execPath, [
    path.join(root, "frontend", "node_modules", "vite", "bin", "vite.js"),
    "--host",
    "127.0.0.1",
    "--port",
    String(port),
  ], {
    cwd: path.join(root, "frontend"),
    stdio: "inherit",
    env: { ...env, THMIND_BACKEND_URL: `http://127.0.0.1:${backendPort}` },
  });
  watchProcess(frontendProc, "Frontend");
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

ensureDependencies()
  .then(async () => {
    const backendPort = await findAvailablePort(4000);
    const frontendPort = await findAvailablePort(5173);
    console.log(`🌐 [Dev Manager] Backend: http://127.0.0.1:${backendPort}`);
    console.log(`🌐 [Dev Manager] Frontend: http://127.0.0.1:${frontendPort}`);
    startBackend(backendPort);
    startFrontend(frontendPort, backendPort);
  })
  .catch((error) => {
    stopAfterFailure(`❌ [Dev Manager] Ishga tushirish muvaffaqiyatsiz tugadi: ${error.message}`);
    process.exitCode = 1;
  });
