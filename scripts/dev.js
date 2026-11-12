const { spawn } = require("child_process");
const path = require("path");

console.log("\x1b[36m%s\x1b[0m", "=======================================================");
console.log("\x1b[1m\x1b[33m%s\x1b[0m", "🔥 Petro Engineering - Launching Full Stack Workspace");
console.log("\x1b[36m%s\x1b[0m", "=======================================================");
console.log("📡 Backend Server:  http://localhost:5000");
console.log("💻 Frontend Portal:  http://localhost:5173");
console.log("🛑 Press Ctrl + C at any time to stop both servers.\n");

// 1. Spawn Backend Node.js Server with auto-reloading watch mode
const backend = spawn("node", ["--watch", "server/index.js"], {
  stdio: "inherit",
  shell: false,
  env: process.env,
});

// 2. Spawn Vite Frontend Dev Server
const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";
const frontend = spawn(npxCmd, ["vite"], {
  stdio: "inherit",
  shell: process.platform === "win32" ? true : false,
  env: process.env,
});

function cleanup() {
  try {
    if (backend && !backend.killed) {
      if (process.platform === "win32") {
        spawn("taskkill", ["/pid", backend.pid, "/f", "/t"]);
      } else {
        backend.kill("SIGINT");
      }
    }
  } catch (e) {}

  try {
    if (frontend && !frontend.killed) {
      if (process.platform === "win32") {
        spawn("taskkill", ["/pid", frontend.pid, "/f", "/t"]);
      } else {
        frontend.kill("SIGINT");
      }
    }
  } catch (e) {}

  process.exit(0);
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

backend.on("error", (err) => {
  console.error("Backend error:", err);
});

frontend.on("error", (err) => {
  console.error("Frontend error:", err);
});
