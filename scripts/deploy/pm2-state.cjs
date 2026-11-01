const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const [action, filename, expected, extra] = process.argv.slice(2);
const apps = () => JSON.parse(execFileSync("pm2", ["jlist"], { encoding: "utf8" }));
const portfolio = () => {
  const matches = apps().filter((app) => app.name === "portfolio");
  assert.equal(matches.length, 1, "Exactly one portfolio process must exist");
  const app = matches[0];
  assert.equal(app.pm2_env.status, "online", "Portfolio must be online");
  assert.equal(String(app.pm2_env.PORT ?? app.pm2_env.env?.PORT), "3001");
  return app;
};
const write = (value) => fs.writeFileSync(filename, JSON.stringify(value, null, 2), {
  mode: 0o600, flag: "wx",
});

if (action === "capture") {
  const app = portfolio();
  const e = app.pm2_env;
  const cwd = fs.realpathSync(e.pm_cwd);
  const checkout = fs.realpathSync(expected);
  const releases = fs.realpathSync(extra);
  assert.ok(cwd === checkout || cwd.startsWith(`${releases}${path.sep}`), "Known portfolio directory");
  const env = {};
  for (const source of [e.env ?? {}, e]) {
    for (const [key, value] of Object.entries(source)) {
      if (/^[A-Z_][A-Z0-9_]*$/.test(key) && ["string", "number", "boolean"].includes(typeof value)) {
        env[key] = value;
      }
    }
  }
  write({
    apps: [{ name: "portfolio", cwd, script: e.pm_exec_path, args: e.args ?? [],
      interpreter: e.exec_interpreter ?? "node", exec_mode: "fork", env }],
    previousPid: app.pid,
  });
  console.log(cwd);
} else if (action === "unchanged") {
  const saved = JSON.parse(fs.readFileSync(filename, "utf8"));
  const app = portfolio();
  assert.equal(app.pid, saved.previousPid, "Portfolio changed during preparation; refusing cutover");
  assert.equal(fs.realpathSync(app.pm2_env.pm_cwd), saved.apps[0].cwd);
} else if (action === "release") {
  assert.match(extra, /^G-[A-Z0-9]+$/);
  write({ apps: [{ name: "portfolio", cwd: expected, script: process.execPath,
    args: [path.join(expected, "node_modules/next/dist/bin/next"), "start", "--port", "3001"],
    interpreter: "none", exec_mode: "fork", env: {
      NODE_ENV: "production", PORT: "3001", NEXT_BUILD_DIR: ".next", GAID: extra,
    } }] });
} else if (action === "verify") {
  const app = portfolio();
  assert.equal(fs.realpathSync(app.pm2_env.pm_cwd), fs.realpathSync(expected));
  console.log(`Verified portfolio: ${expected}`);
} else {
  throw new Error("Unknown PM2 state operation");
}
