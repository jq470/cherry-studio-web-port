// Web shim for expo-sqlite, backed by sql.js (real SQLite compiled to WASM) and
// executed on the main thread.
//
// Why not the official web implementation: expo-sqlite's web build drives
// wa-sqlite inside a dedicated Worker and talks to it through SharedArrayBuffer
// + Atomics busy-wait (`invokeWorkerSync`). Under a Metro static export the
// worker is created from a `blob:` URL wrapper and never answers inside the sync
// window, so every `openDatabaseSync()` throws `Sync operation timeout` and the
// app lands on StartupFailureScreen.
//
// sql.js is synchronous SQLite: `db.exec`, `db.prepare`, `stmt.step`, `stmt.get`,
// `stmt.getAsObject`. It supports INSERT ... RETURNING (drizzle's
// `insertWithOrderKey` requires a returned row), so it can back the real drizzle
// session instead of faking empty result sets.
//
// Loading: sql.js instantiates asynchronously, while bootstrap opens the database
// through the *synchronous* `openDatabaseSync`. Two mechanisms make that safe:
//   1. the load starts at module-evaluation time (bundle load), long before
//      DbService.onInit runs;
//   2. `waitForReadySync()` spins with a same-origin synchronous XHR, which in
//      browsers pumps a nested event loop — enough for the pending WASM
//      instantiation and the IndexedDB preload to finish.
//
// Persistence: database bytes are exported after writes and stored in IndexedDB;
// the preload restores them before the first open.
//
// Assets: `sql-wasm.js` / `sql-wasm.wasm` are loaded from `<site-root>/sqljs/`
// when present (CI can vendor them into dist-web), and fall back to jsDelivr
// otherwise. Loading goes through `fetch` so it survives COEP.

const SQLJS_VERSION = '1.13.0';
const IDB_NAME = 'cherry-studio-sqlite';
const IDB_STORE = 'databases';

// ---------------------------------------------------------------------------
// ready gate
// ---------------------------------------------------------------------------

let sqlRuntime = null; // resolved sql.js module (exposes Database)
let readyState = 0; // 0 pending, 1 ready, 2 failed
let readyError = null;
let preloadDone = false;
let sqlJsBase = null; // resolved asset base (local dist-web/sqljs or CDN)
const pendingBytes = new Map(); // db name -> Uint8Array restored from IndexedDB

function originRoot() {
  if (typeof location === 'undefined') return '/';
  try {
    return new URL('/', location.href).href;
  } catch {
    return '/';
  }
}

function markReady(runtime) {
  sqlRuntime = runtime;
  readyState = 1;
}

function markFailed(err) {
  readyError = err instanceof Error ? err : new Error(String(err));
  readyState = 2;
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return response.text();
}

// Load sql.js source with `fetch` (CORS) instead of a <script> tag: a no-cors
// cross-origin script is rejected under COEP, while a CORS fetch is allowed.
async function bootSqlJs() {
  const localBase = `${originRoot()}sqljs/`;
  const cdnBase = `https://cdn.jsdelivr.net/npm/sql.js@${SQLJS_VERSION}/dist/`;
  let code = null;
  try {
    code = await fetchText(`${localBase}sql-wasm.js`);
    sqlJsBase = localBase;
  } catch {
    sqlJsBase = cdnBase;
    code = await fetchText(`${cdnBase}sql-wasm.js`);
  }
  // sql-wasm.js declares `var initSqlJs` in its own scope; evaluate it as a
  // function body and return the symbol it defines.
  const init = new Function(`${code}\n;return typeof initSqlJs !== 'undefined' ? initSqlJs : undefined;`)();
  if (typeof init !== 'function') throw new Error('sql.js did not expose initSqlJs');
  init({ locateFile: (file) => sqlJsBase + file }).then(markReady, markFailed);
}

// ---------------------------------------------------------------------------
// IndexedDB persistence
// ---------------------------------------------------------------------------

function openIdb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      resolve(null);
      return;
    }
    const request = indexedDB.open(IDB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function preloadFromIdb() {
  try {
    const idb = await openIdb();
    if (!idb) return;
    await new Promise((resolve) => {
      const tx = idb.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const names = store.getAllKeys();
      names.onsuccess = () => {
        const keys = names.result || [];
        if (!keys.length) {
          resolve();
          return;
        }
        let left = keys.length;
        for (const key of keys) {
          const get = store.get(key);
          get.onsuccess = () => {
            const value = get.result;
            if (value instanceof Uint8Array) pendingBytes.set(String(key), value);
            else if (value instanceof ArrayBuffer) pendingBytes.set(String(key), new Uint8Array(value));
            if (--left === 0) resolve();
          };
          get.onerror = () => {
            if (--left === 0) resolve();
          };
        }
      };
      names.onerror = () => resolve();
    });
    idb.close();
  } catch {
    /* persistence is best effort */
  } finally {
    preloadDone = true;
  }
}

const pendingWrites = new Map();
let flushTimer = null;

function schedulePersist(name, bytes) {
  pendingWrites.set(name, bytes);
  if (flushTimer) return;
  flushTimer = setTimeout(flushPersist, 150);
}

function flushPersist() {
  flushTimer = null;
  const entries = [...pendingWrites.entries()];
  pendingWrites.clear();
  if (!entries.length) return;
  openIdb()
    .then((idb) => {
      if (!idb) return;
      const tx = idb.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      for (const [name, bytes] of entries) store.put(bytes, name);
      tx.oncomplete = () => idb.close();
      tx.onerror = () => idb.close();
    })
    .catch(() => {});
}

if (typeof addEventListener === 'function') {
  addEventListener('pagehide', flushPersist);
  addEventListener('visibilitychange', () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') flushPersist();
  });
}

// ---------------------------------------------------------------------------
// synchronous readiness gate
// ---------------------------------------------------------------------------

function spinSyncXhr() {
  try {
    const xhr = new XMLHttpRequest();
    // same-origin marker: sync XHR is disallowed cross-origin, and any existing
    // static file works — the point is only to pump the nested event loop.
    xhr.open('GET', `${originRoot()}metadata.json?t=${Date.now()}`, false);
    xhr.send();
    return true;
  } catch {
    return false;
  }
}

function waitForReadySync() {
  if (readyState === 1 && preloadDone) return sqlRuntime;
  const deadline = Date.now() + 20000;
  while (readyState === 0 || !preloadDone) {
    if (readyState === 2) throw readyError;
    if (Date.now() > deadline) {
      throw new Error('sql.js did not initialize within 20s (web sqlite shim)');
    }
    if (!spinSyncXhr()) {
      const until = Date.now() + 25;
      while (Date.now() < until) {
        /* short blocking spin; only when sync XHR is unavailable */
      }
    }
  }
  if (readyState === 2) throw readyError;
  return sqlRuntime;
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

const WRITE_SQL = /^\s*(insert|update|delete|replace|create|drop|alter|vacuum|attach|detach)\b/i;

function isWriteSql(sql) {
  return typeof sql === 'string' && WRITE_SQL.test(sql);
}

function normalizeParam(value) {
  if (value === undefined) return null;
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  return value;
}

function normalizeParams(params) {
  if (params === undefined || params === null) return undefined;
  if (Array.isArray(params)) return params.map(normalizeParam);
  if (params instanceof ArrayBuffer) return [new Uint8Array(params)];
  if (typeof params === 'object') {
    const out = {};
    for (const [key, value] of Object.entries(params)) out[key] = normalizeParam(value);
    return out;
  }
  return [normalizeParam(params)];
}

// ---------------------------------------------------------------------------

class SQLiteStatement {
  constructor(database, sql) {
    this._database = database;
    this._sql = sql;
    this._stmt = null;
    this._rawResults = false;
    this._positioned = false;
    this.changes = 0;
    this.lastInsertRowId = 0;
  }

  _ensure() {
    if (!this._stmt) this._stmt = this._database._handle.prepare(this._sql);
    return this._stmt;
  }

  _run(params, rawResults) {
    const stmt = this._ensure();
    this._rawResults = rawResults;
    try {
      stmt.reset();
    } catch {
      /* fresh statement has nothing to reset */
    }
    const bound = normalizeParams(params);
    if (bound !== undefined) stmt.bind(bound);
    this._positioned = stmt.step();
    this.changes = this._database._rowsModified();
    this.lastInsertRowId = this._database._lastInsertRowId();
    this._database._afterWrite(this.changes, this._sql);
    return this;
  }

  executeSync(params) {
    return this._run(params, false);
  }

  executeForRawResultSync(params) {
    return this._run(params, true);
  }

  bindSync(params) {
    const bound = normalizeParams(params);
    if (bound !== undefined) this._ensure().bind(bound);
    return this;
  }

  resetSync() {
    try {
      this._ensure().reset();
    } catch {
      /* ignore */
    }
    this._positioned = false;
    return this;
  }

  getAllSync() {
    const stmt = this._stmt;
    const rows = [];
    if (!stmt) return rows;
    let onRow = this._positioned;
    while (onRow) {
      rows.push(this._rawResults ? Array.from(stmt.get()) : stmt.getAsObject());
      onRow = stmt.step();
    }
    this._positioned = false;
    return rows;
  }

  getFirstSync() {
    const stmt = this._stmt;
    if (!stmt || !this._positioned) return undefined;
    const row = this._rawResults ? Array.from(stmt.get()) : stmt.getAsObject();
    this._positioned = false;
    return row;
  }

  finalizeSync() {
    if (this._stmt) {
      try {
        this._stmt.free();
      } catch {
        /* ignore */
      }
      this._stmt = null;
    }
    this._positioned = false;
  }

  async executeAsync(params) {
    return this.executeSync(params);
  }

  async executeForRawResultAsync(params) {
    return this.executeForRawResultSync(params);
  }

  async getAllAsync() {
    return this.getAllSync();
  }

  async getFirstAsync() {
    const row = this.getFirstSync();
    return row === undefined ? null : row;
  }

  async finalizeAsync() {
    this.finalizeSync();
  }
}

class SQLiteDatabase {
  constructor(name, options, directory) {
    this._name = name || 'default';
    this._options = options;
    this._directory = directory;
    this._closed = false;
    const runtime = waitForReadySync();
    const restored = pendingBytes.get(this._name);
    this._handle = restored ? new runtime.Database(restored) : new runtime.Database();
    this._rowIdStatement = this._handle.prepare('SELECT last_insert_rowid()');
  }

  get name() {
    return this._name;
  }

  _assertOpen() {
    if (this._closed) throw new Error('database is closed');
  }

  _rowsModified() {
    try {
      return this._handle.getRowsModified();
    } catch {
      return 0;
    }
  }

  _lastInsertRowId() {
    try {
      this._rowIdStatement.reset();
      if (!this._rowIdStatement.step()) return 0;
      return Number(this._rowIdStatement.get()[0] || 0);
    } catch {
      return 0;
    }
  }

  _persistNow() {
    try {
      schedulePersist(this._name, this._handle.export());
    } catch {
      /* ignore */
    }
  }

  _afterWrite(changes, sql) {
    if (!changes) return;
    if (sql && !isWriteSql(sql)) return;
    this._persistNow();
  }

  // ---- synchronous surface (drizzle session, pragmas, migrations) ----

  execSync(sql) {
    this._assertOpen();
    this._handle.exec(sql);
    if (isWriteSql(sql)) this._persistNow();
  }

  prepareSync(sql) {
    this._assertOpen();
    return new SQLiteStatement(this, sql);
  }

  getAllSync(sql, params) {
    const stmt = this.prepareSync(sql);
    try {
      stmt.executeSync(params);
      return stmt.getAllSync();
    } finally {
      stmt.finalizeSync();
    }
  }

  getFirstSync(sql, params) {
    const stmt = this.prepareSync(sql);
    try {
      return stmt.executeSync(params).getFirstSync();
    } finally {
      stmt.finalizeSync();
    }
  }

  runSync(sql, params) {
    const stmt = this.prepareSync(sql);
    try {
      stmt.executeSync(params);
      return { changes: stmt.changes, lastInsertRowId: stmt.lastInsertRowId };
    } finally {
      stmt.finalizeSync();
    }
  }

  closeSync() {
    if (this._closed) return;
    this._persistNow();
    flushPersist();
    try {
      this._rowIdStatement.free();
    } catch {
      /* ignore */
    }
    try {
      this._handle.close();
    } catch {
      /* ignore */
    }
    this._closed = true;
  }

  // ---- asynchronous surface ----

  async execAsync(sql) {
    return this.execSync(sql);
  }

  async prepareAsync(sql) {
    return this.prepareSync(sql);
  }

  async getAllAsync(sql, params) {
    return this.getAllSync(sql, params);
  }

  async getFirstAsync(sql, params) {
    const row = this.getFirstSync(sql, params);
    return row === undefined ? null : row;
  }

  async runAsync(sql, params) {
    return this.runSync(sql, params);
  }

  async transactionAsync(fn) {
    this.execSync('BEGIN');
    try {
      const result = await fn(this);
      this.execSync('COMMIT');
      return result;
    } catch (error) {
      try {
        this.execSync('ROLLBACK');
      } catch {
        /* ignore */
      }
      throw error;
    }
  }

  async withTransactionAsync(fn) {
    return this.transactionAsync(fn);
  }

  async serialize() {
    return this._handle.export();
  }

  serializeSync() {
    return this._handle.export();
  }

  async closeAsync() {
    this.closeSync();
  }
}

// ---------------------------------------------------------------------------
// public API (the subset of expo-sqlite used by the app and drizzle)
// ---------------------------------------------------------------------------

function openDatabaseSync(name, options, directory) {
  return new SQLiteDatabase(name, options, directory);
}

async function openDatabaseAsync(name, options, directory) {
  return new SQLiteDatabase(name, options, directory);
}

async function backupDatabaseAsync(options = {}) {
  const source = options.sourceDatabaseName || 'default';
  const destination = options.destDatabaseName || 'default';
  const bytes = pendingBytes.get(source);
  if (bytes) pendingBytes.set(destination, bytes);
}

async function deleteDatabaseAsync(name) {
  pendingBytes.delete(name);
  const idb = await openIdb();
  if (!idb) return;
  const tx = idb.transaction(IDB_STORE, 'readwrite');
  tx.objectStore(IDB_STORE).delete(name);
  tx.oncomplete = () => idb.close();
  tx.onerror = () => idb.close();
}

async function getDatabasesAsync() {
  const idb = await openIdb();
  if (!idb) return [];
  return new Promise((resolve) => {
    const tx = idb.transaction(IDB_STORE, 'readonly');
    const request = tx.objectStore(IDB_STORE).getAllKeys();
    request.onsuccess = () => {
      resolve((request.result || []).map((name) => ({ name, fileSize: 0 })));
      idb.close();
    };
    request.onerror = () => {
      resolve([]);
      idb.close();
    };
  });
}

function configureWeb() {
  // sql.js always uses the bundled build in dist-web/sqljs/; a custom wasmURL is
  // intentionally ignored.
}

const SQLite = {
  openDatabaseSync,
  openDatabaseAsync,
  backupDatabaseAsync,
  deleteDatabaseAsync,
  getDatabasesAsync,
  configureWeb,
  SQLiteDatabase,
  SQLiteStatement,
};

// kick the load immediately: bundle evaluation happens well before the first
// openDatabaseSync, and the sync gate covers any remaining gap.
bootSqlJs().catch(markFailed);
preloadFromIdb();

export {
  openDatabaseSync,
  openDatabaseAsync,
  backupDatabaseAsync,
  deleteDatabaseAsync,
  getDatabasesAsync,
  configureWeb,
  SQLiteDatabase,
  SQLiteStatement,
};

export default SQLite;
