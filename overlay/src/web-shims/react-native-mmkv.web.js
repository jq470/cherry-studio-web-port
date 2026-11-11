/**
 * Web shim for `react-native-mmkv`.
 *
 * MMKV is a native key-value store; it has no browser implementation. This
 * shim keeps the same method surface the app actually calls and persists to
 * localStorage (per-instance id prefix). In private/blocked storage the store
 * degrades to an in-memory Map so the app still boots.
 */

function safeStorage() {
  try {
    if (typeof localStorage !== 'undefined') return localStorage;
  } catch {
    /* fall through to memory */
  }
  return null;
}

class MMKV {
  constructor(id) {
    this.id = id || 'default';
    this.prefix = `mmkv:${this.id}:`;
    this.memory = new Map();
    this.storage = safeStorage();
    // Hydrate memory from localStorage on first load.
    if (this.storage) {
      for (let i = 0; i < this.storage.length; i += 1) {
        const k = this.storage.key(i);
        if (k && k.startsWith(this.prefix)) {
          this.memory.set(k.slice(this.prefix.length), this.storage.getItem(k));
        }
      }
    }
  }

  _persist(key, value) {
    this.memory.set(key, value);
    if (this.storage) {
      try {
        this.storage.setItem(this.prefix + key, value);
      } catch {
        /* storage full / blocked: keep in memory only */
      }
    }
  }

  set(key, value) {
    this._persist(key, String(value));
  }

  getString(key) {
    const v = this.memory.get(key);
    return typeof v === 'string' ? v : undefined;
  }

  getNumber(key) {
    const v = this.memory.get(key);
    return v === undefined ? undefined : Number(v);
  }

  getBoolean(key) {
    const v = this.memory.get(key);
    return v === undefined ? undefined : v === 'true';
  }

  remove(key) {
    this.memory.delete(key);
    if (this.storage) {
      try {
        this.storage.removeItem(this.prefix + key);
      } catch {
        /* ignore */
      }
    }
  }

  delete(key) {
    this.remove(key);
  }

  getAllKeys() {
    return [...this.memory.keys()];
  }

  clearAll() {
    this.memory.clear();
    if (this.storage) {
      const toRemove = [];
      for (let i = 0; i < this.storage.length; i += 1) {
        const k = this.storage.key(i);
        if (k && k.startsWith(this.prefix)) toRemove.push(k);
      }
      toRemove.forEach((k) => {
        try {
          this.storage.removeItem(k);
        } catch {
          /* ignore */
        }
      });
    }
  }
}

export function createMMKV(options) {
  return new MMKV(options && options.id);
}

export { MMKV };
export default { createMMKV, MMKV };
