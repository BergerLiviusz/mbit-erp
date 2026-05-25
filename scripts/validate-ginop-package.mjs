#!/usr/bin/env node
/**
 * GINOP package validáció – backend API guard + modul registry (ERP_PACKAGE=ginop-crm-dms-hr).
 * Futtatás: node scripts/validate-ginop-package.mjs
 */
import { spawn } from 'child_process';
import http from 'http';

const PORT = 3099;
const BASE = `http://127.0.0.1:${PORT}`;
const TIMEOUT_MS = 90000;

function waitForHealth() {
  const deadline = Date.now() + TIMEOUT_MS;
  return new Promise((resolve, reject) => {
    const tick = () => {
      http.get(`${BASE}/health`, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          if (res.statusCode === 200) resolve(JSON.parse(body));
          else if (Date.now() > deadline) reject(new Error('Health timeout'));
          else setTimeout(tick, 500);
        });
      }).on('error', () => {
        if (Date.now() > deadline) reject(new Error('Health timeout'));
        else setTimeout(tick, 500);
      });
    };
    tick();
  });
}

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE}${path}`, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
}

const env = {
  ...process.env,
  PORT: String(PORT),
  ERP_PACKAGE: 'ginop-crm-dms-hr',
  APP_VERSION: '1.0.1a',
  DATABASE_URL: 'file:./prisma/validate-ginop.db',
  DATA_DIR: './data-validate-ginop',
  ELECTRON_RUN_AS_NODE: '1',
  NODE_ENV: 'production',
};

const server = spawn('node', ['dist/main.js'], {
  cwd: new URL('../apps/server', import.meta.url).pathname,
  env,
  stdio: ['ignore', 'pipe', 'pipe'],
});

const results = [];

try {
  await waitForHealth();
  results.push({ ok: true, name: 'Health OK' });

  const version = await get('/system/version');
  const v = JSON.parse(version.body);
  if (v.version === '1.0.1a' && v.packageId === 'ginop-crm-dms-hr') {
    results.push({ ok: true, name: 'GET /system/version' });
  } else {
    results.push({ ok: false, name: 'GET /system/version', detail: v });
  }

  const detailed = await get('/health/detailed');
  const h = JSON.parse(detailed.body);
  if (h.version === '1.0.1a' && h.packageId === 'ginop-crm-dms-hr') {
    results.push({ ok: true, name: 'GET /health/detailed' });
  } else {
    results.push({ ok: false, name: 'GET /health/detailed', detail: h });
  }

  for (const path of ['/logistics/items', '/controlling/dashboard', '/team/boards']) {
    const r = await get(path);
    if (r.status === 403) {
      results.push({ ok: true, name: `${path} → 403` });
    } else {
      results.push({ ok: false, name: `${path} → expected 403`, detail: r.status });
    }
  }

  for (const path of ['/crm/accounts?skip=0&take=1', '/dms/documents?skip=0&take=1', '/hr/employees?skip=0&take=1']) {
    const r = await get(path);
    if (r.status === 200 || r.status === 401) {
      results.push({ ok: true, name: `${path} → allowed (${r.status})` });
    } else if (r.status === 403) {
      results.push({ ok: false, name: `${path} → unexpected 403` });
    } else {
      results.push({ ok: true, name: `${path} → ${r.status}` });
    }
  }
} catch (e) {
  results.push({ ok: false, name: 'Fatal', detail: String(e) });
} finally {
  server.kill('SIGTERM');
}

const failed = results.filter((r) => !r.ok);
for (const r of results) {
  console.log(r.ok ? '✅' : '❌', r.name, r.detail ? JSON.stringify(r.detail) : '');
}
process.exit(failed.length ? 1 : 0);
