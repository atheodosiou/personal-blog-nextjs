import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

const sha = "a".repeat(40);
const bash = process.platform === "win32" ? "C:/Program Files/Git/bin/bash.exe" : "bash";
const root = new URL("./", import.meta.url);
const quote = (value) => `'${value.replaceAll("'", "'\\''")}'`;
const slash = (value) => value.replaceAll("\\", "/");
const shellPath = (value) => slash(value).replace(/^([A-Za-z]):\//, (_, drive) => `/${drive.toLowerCase()}/`);
const run = (command, args, options = {}) => new Promise((resolve, reject) => {
  const child = spawn(command, args, { ...options, windowsHide: true });
  let output = "";
  child.stdout.on("data", (chunk) => output += chunk);
  child.stderr.on("data", (chunk) => output += chunk);
  child.on("error", reject);
  child.on("close", (code) => resolve({ code, output }));
});

// Only OS/service boundaries are mocked. The real shell orchestration and real
// PM2 snapshot/configuration helper run, with every path confined to a fixture.
async function fixture(scenario, operation) {
  const dir = slash(await mkdtemp(path.join(tmpdir(), "portfolio-deploy-test-")));
  const locations = {
    CHECKOUT: `${dir}/checkout`, RELEASES: `${dir}/releases`,
    ENV_FILE: `${dir}/production.env`, PM2_HELPER: `${dir}/pm2-state.cjs`,
    NODE_FILE: `${dir}/node-path`,
    LOCK_FILE: `${dir}/deploy.lock`,
  };
  try {
    await mkdir(locations.CHECKOUT);
    await mkdir(locations.RELEASES);
    await mkdir(`${dir}/bin`);
    await mkdir(`${dir}/selected`);
    const previous = `${locations.RELEASES}/previous`;
    await mkdir(previous);
    await writeFile(locations.ENV_FILE, "GAID=G-E4G1QVX7T9\n");
    await writeFile(locations.NODE_FILE, `${shellPath(dir)}/selected/node\n`);
    let helper = await readFile(new URL("pm2-state.cjs", root), "utf8");
    if (process.platform === "win32") {
      // Windows cannot exec a shebang-only mock directly; use Git Bash for it.
      helper = helper.replace('execFileSync("pm2", ["jlist"],',
        `execFileSync(${JSON.stringify(bash)}, [${JSON.stringify(`${dir}/bin/pm2`)}, "jlist"],`);
    }
    await writeFile(locations.PM2_HELPER, helper);
    const other = { name: "other-site", pid: 77, pm_id: 2, pm2_env: { status: "online" } };
    const state = { scenario, count: 0, trace: [], other, current: {
      name: "portfolio", pid: 11, pm_id: 4,
      pm2_env: { status: "online", pm_cwd: previous, PORT: "3001",
        pm_exec_path: "/usr/bin/npm", args: ["start"], exec_interpreter: "/usr/bin/node",
        env: { GAID: "G-E4G1QVX7T9", PRIVATE_TEST_VALUE: "do-not-log" } },
    } };
    const stateFile = `${dir}/state.json`;
    await writeFile(stateFile, JSON.stringify(state));
    const mock = `${dir}/mock.cjs`;
    await writeFile(mock, `
const fs=require('fs'),path=require('path');
const [tool,...args]=process.argv.slice(2);
const file=process.env.FIXTURE_STATE, s=JSON.parse(fs.readFileSync(file));
const save=()=>fs.writeFileSync(file,JSON.stringify(s));
const exit=(code=0)=>{save();process.exit(code)};
s.trace.push([tool,...args]);
if(tool==='id'){console.log('0');exit()}
if(tool==='sleep') exit();
if(tool==='flock') exit(s.scenario==='busy'?1:0);
if(tool==='ss'){if(s.scenario==='port-busy')console.log('LISTEN');exit()}
if(tool==='git'){
  if(args[0]==='remote')console.log('git@github.com:atheodosiou/personal-blog-nextjs.git');
  if(args[0]==='fetch'){s.count++;}
  if(args[0]==='rev-parse')console.log(s.scenario==='stale'||(s.scenario==='moved'&&s.count>1)?'b'.repeat(40):'a'.repeat(40));
  exit();
}
if(tool==='npm'){
  if(s.scenario==='build-failure'&&args[1]==='build')exit(12);
  if(args[1]==='build'){
    fs.mkdirSync('.next/server/app',{recursive:true});
    fs.writeFileSync('.next/BUILD_ID','fixture-build');
    fs.writeFileSync('.next/server/app/index.html','G-E4G1QVX7T9');
  }
  exit();
}
if(tool==='pm2'){
  if(args[0]==='jlist'){console.log(JSON.stringify([s.other,...(s.current?[s.current]:[])]));exit()}
  if(args[0]==='delete'){
    if(args[1]!=='portfolio')exit(99);
    s.current=null;exit();
  }
  if(args[0]==='start'){
    const app=JSON.parse(fs.readFileSync(args[1])).apps[0];
    if(app.name!=='portfolio'||args[2]!=='--only'||args[3]!=='portfolio')exit(99);
    if(s.scenario==='start-failure'&&args[1].includes('release.config'))exit(13);
    s.current={name:app.name,pid:22,pm_id:5,pm2_env:{...app.env,status:'online',pm_cwd:app.cwd,pm_exec_path:app.script,args:app.args,exec_interpreter:app.interpreter,env:app.env}};
    exit();
  }
  exit();
}
if(tool==='node'){
  if(args[0]==='-e'&&s.scenario==='unsupported-runtime')exit(16);
  if(args[0]==='node_modules/next/dist/bin/next'){
    save();setInterval(()=>{},1000);process.on('SIGTERM',()=>process.exit(0));
  }else if(s.scenario==='preview-failure'&&args.some(a=>a.includes(':3201')))exit(14);
  else if(s.scenario==='origin-failure'&&args.some(a=>a.includes(':3001')))exit(15);
  else exit();
}else if(tool==='curl')exit();
else if(tool==='systemd-run')exit(s.scenario==='service-failure'?17:0);
else if(tool==='journalctl')exit();
else exit(98);
`);
    const nodeExe = slash(process.execPath);
    for (const tool of ["id", "sleep", "flock", "ss", "git", "npm", "pm2", "curl", "systemd-run", "journalctl"]) {
      await writeFile(`${dir}/bin/${tool}`, `#!/usr/bin/env bash\nexec ${quote(nodeExe)} ${quote(mock)} ${quote(tool)} "$@"\n`, { mode: 0o755 });
    }
    // The fallback runtime deliberately fails: later commands must use the
    // pinned runtime as well as the explicit version preflight invocation.
    await writeFile(`${dir}/bin/node`, '#!/usr/bin/env bash\necho "Wrong fallback Node runtime" >&2\nexit 21\n', { mode: 0o755 });
    await writeFile(`${dir}/selected/node`, `#!/usr/bin/env bash
if [[ "$1" == *pm2-state.cjs ]]; then
  exec ${quote(nodeExe)} "$@"
fi
exec ${quote(nodeExe)} ${quote(mock)} node "$@"
`, { mode: 0o755 });
    const nativePath = process.platform === "win32" ? "/usr/bin:/bin" : process.env.PATH;
    const testPath = `${shellPath(dir)}/bin:${nativePath}`;
    const environment = { ...process.env, FIXTURE_STATE: stateFile };
    let script = await readFile(new URL("portfolio-deploy.sh", root), "utf8");
    // Substitute production paths only in this throwaway copy, never in source.
    script = script.replace(/^export PATH=.*$/m, `export PATH=${quote(testPath)}`)
      .replace(/^export PM2_HOME=.*$/m, `export PM2_HOME=${quote(`${dir}/pm2`)}`);
    for (const [key, value] of Object.entries(locations)) {
      script = script.replace(new RegExp(`^readonly ${key}=.*$`, "m"), `readonly ${key}=${quote(value)}`);
    }
    const scriptFile = `${dir}/deploy.sh`;
    await writeFile(scriptFile, script);
    await operation({ dir, previous, stateFile, scriptFile, testPath, environment,
      execute: () => run(bash, [scriptFile, sha], { env: environment }),
      state: async () => JSON.parse(await readFile(stateFile, "utf8")) });
  } finally {
    await rm(dir, { recursive: true, force: true, maxRetries: 3 });
  }
}

test("successful deployment previews before cutover, saves PM2 and preserves other apps", async () => {
  await fixture("success", async (f) => {
    const result = await f.execute();
    assert.equal(result.code, 0, result.output);
    assert.match(result.output, /DEPLOY PASSED/);
    assert.ok(!result.output.includes("do-not-log"), "Private environment never printed");
    const s = await f.state();
    assert.equal(s.other.pid, 77);
    assert.notEqual(s.current.pm2_env.pm_cwd, f.previous);
    const cutover = s.trace.findIndex(a => a[0] === "pm2" && a[1] === "delete");
    const preview = s.trace.findIndex(a => a[0] === "node" && a[1] === "scripts/check-deployment.mjs" && a[2].includes(":3201"));
    assert.ok(preview >= 0 && cutover > preview);
    assert.ok(s.trace.some(a => a[0] === "pm2" && a[1] === "save"));
    const saved = JSON.parse(await readFile(s.trace.find(a => a[0] === "pm2" && a[1] === "start")[2], "utf8"));
    assert.equal(saved.apps[0].env.GAID, "G-E4G1QVX7T9");
    assert.equal(saved.apps[0].env.PORT, "3001");
  });
});

for (const scenario of ["unsupported-runtime", "build-failure", "preview-failure", "stale", "moved", "busy", "port-busy"]) {
  test(`${scenario}: leaves the running release untouched`, async () => {
    await fixture(scenario, async (f) => {
      const result = await f.execute();
      assert.notEqual(result.code, 0, result.output);
      const s = await f.state();
      const expectedBoundary = {
        "unsupported-runtime": a => a[0] === "node" && a[1] === "-e",
        "build-failure": a => a[0] === "npm" && a[2] === "build",
        "preview-failure": a => a[0] === "node" && a[2]?.includes(":3201"),
        stale: a => a[0] === "git" && a[1] === "rev-parse",
        moved: a => a[0] === "git" && a[1] === "fetch" && s.count === 2,
        busy: a => a[0] === "flock",
        "port-busy": a => a[0] === "ss",
      }[scenario];
      assert.ok(s.trace.some(expectedBoundary), result.output);
      assert.equal(slash(s.current.pm2_env.pm_cwd), f.previous);
      assert.equal(s.current.pid, 11);
      assert.ok(!s.trace.some(a => a[0] === "pm2" && ["delete", "start", "save"].includes(a[1])));
    });
  });
}

for (const scenario of ["start-failure", "origin-failure"]) {
  test(`${scenario}: restores the previous process configuration and saves rollback`, async () => {
    await fixture(scenario, async (f) => {
      const result = await f.execute();
      assert.notEqual(result.code, 0);
      assert.match(result.output, /ROLLBACK PASSED/, result.output);
      const s = await f.state();
      assert.equal(slash(s.current.pm2_env.pm_cwd), f.previous);
      assert.equal(s.current.pm2_env.env.PRIVATE_TEST_VALUE, "do-not-log");
      assert.equal(s.other.pid, 77);
      const starts = s.trace.filter(a => a[0] === "pm2" && a[1] === "start");
      assert.equal(starts.length, 2);
      assert.ok(starts[1][2].includes("rollback.config"));
      assert.ok(s.trace.some(a => a[0] === "pm2" && a[1] === "save"));
    });
  });
}

test("SSH entry rejects shell/forwarding commands and propagates systemd job failure", async () => {
  await fixture("service-failure", async (f) => {
    const source = (await readFile(new URL("portfolio-deploy-ssh.sh", root), "utf8"))
      .replace(/^export PATH=.*$/m, `export PATH=${quote(f.testPath)}`);
    const file = `${f.dir}/entry.sh`;
    await writeFile(file, source);
    for (const command of ["", "bash", `deploy ${sha}; id`, `deploy ${sha}\nwhoami`, `deploy ${"z".repeat(40)}`]) {
      const result = await run(bash, [file], { env: { ...f.environment, SSH_ORIGINAL_COMMAND: command } });
      assert.notEqual(result.code, 0, command);
    }
    assert.equal((await f.state()).trace.length, 0);
    const result = await run(bash, [file], { env: { ...f.environment, SSH_ORIGINAL_COMMAND: `deploy ${sha}` } });
    assert.equal(result.code, 17, result.output);
    const trace = (await f.state()).trace;
    const service = trace.find(a => a[0] === "systemd-run");
    assert.ok(service.includes("--wait") && service.includes("--property=StandardOutput=journal"));
    assert.ok(service.includes("--property=KillMode=mixed"));
    assert.ok(trace.some(a => a[0] === "journalctl"));
  });
});
