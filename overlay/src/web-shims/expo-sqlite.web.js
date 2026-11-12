// Web shim for expo-sqlite.
//
// On web expo-sqlite drives wa-sqlite inside a dedicated Worker and talks to it
// through SharedArrayBuffer + Atomics busy-wait (`invokeWorkerSync`). In the
// static export / headless smoke run that worker does not reply within the sync
// window, so startup fails with `Error: Sync operation timeout`. Real OPFS /
// wa-sqlite persistence is a later phase that needs a real isolated browser to
// validate the worker + wasm loading chain.
//
// This shim provides an in-memory no-op connection that exposes the full
// expo-sqlite surface the app + drizzle-orm/expo-sqlite call at startup: every
// statement returns an empty result set and writes report zero changes, so the
// app shell renders instead of crashing. No data is persisted.

class FakeStatement {
  constructor(sql) {
    this._sql = sql;
    this.changes = 0;
    this.lastInsertRowId = 0;
  }

  executeSync(params) {
    return this;
  }

  executeForRawResultSync(params) {
    return this;
  }

  bindSync(params) {
    return this;
  }

  bindBlobSync(params) {
    return this;
  }

  resetSync() {
    return this;
  }

  getAllSync() {
    return [];
  }

  getFirstSync() {
    return undefined;
  }

  finalizeSync() {}

  async executeAsync(params) {
    return this;
  }

  async getAllAsync() {
    return [];
  }

  async getFirstAsync() {
    return null;
  }

  async finalizeAsync() {}
}

class FakeDatabase {
  constructor(name, options, directory) {
    this._name = name;
    this._options = options;
    this._directory = directory;
    this._closed = false;
  }

  // ---- synchronous surface (drizzle session + pragmas + custom SQL) ----
  execSync(sql) {}

  prepareSync(sql) {
    return new FakeStatement(sql);
  }

  getAllSync(sql, params) {
    return [];
  }

  getFirstSync(sql, params) {
    return undefined;
  }

  runSync(sql, params) {
    return { changes: 0, lastInsertRowId: 0 };
  }

  closeSync() {
    this._closed = true;
  }

  // ---- asynchronous surface ----
  async execAsync(sql) {
    return undefined;
  }

  async prepareAsync(sql) {
    return new FakeStatement(sql);
  }

  async getAllAsync(sql, params) {
    return [];
  }

  async getFirstAsync(sql, params) {
    return null;
  }

  async runAsync(sql, params) {
    return { changes: 0, lastInsertRowId: 0 };
  }

  async transactionAsync(fn) {
    return fn(this);
  }

  async withTransactionAsync(fn) {
    return fn(this);
  }

  async serialize() {
    return null;
  }

  async closeAsync() {
    this._closed = true;
  }
}

function openDatabaseSync(name, options, directory) {
  return new FakeDatabase(name, options, directory);
}

async function openDatabaseAsync(name, options, directory) {
  return new FakeDatabase(name, options, directory);
}

async function backupDatabaseAsync(/* options */) {}

async function deleteDatabaseAsync(/* name, directory */) {}

async function getDatabasesAsync() {
  return [];
}

const SQLite = {
  openDatabaseSync,
  openDatabaseAsync,
  backupDatabaseAsync,
  deleteDatabaseAsync,
  getDatabasesAsync,
  SQLiteDatabase: FakeDatabase,
  SQLiteStatement: FakeStatement,
};

export {
  openDatabaseSync,
  openDatabaseAsync,
  backupDatabaseAsync,
  deleteDatabaseAsync,
  getDatabasesAsync,
  FakeDatabase as SQLiteDatabase,
  FakeStatement as SQLiteStatement,
};

export default SQLite;
