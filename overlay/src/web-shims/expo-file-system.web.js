// Web shim for expo-file-system.
//
// The native package exports `Directory`, `File`, `Paths` classes that call into
// a native filesystem module which does not exist on web; their constructors
// throw `validatePath is not a function` (the web entry only ships a legacy
// singleton). This shim provides browser-safe equivalents backed by an in-memory
// map so the app boots. Real OPFS persistence is a later phase; every operation
// degrades to a safe no-op / empty result instead of crashing.

const FILE_MODE = { ReadOnly: 0, WriteOnly: 1, Append: 2 };
const ENCODING_TYPE = { UTF8: 'utf8', Base64: 'base64' };
const UPLOAD_TYPE = { BINARY_CONTENT: 0, MULTIPART: 1 };

function normalize(parts) {
  return parts
    .flatMap((p) => (p == null ? [] : String(p).split('/')))
    .filter(Boolean)
    .join('/');
}

// In-memory store keyed by uri, so `exists`/`size` are internally consistent.
const store = new Map();

function record(uri, isDirectory) {
  if (!store.has(uri)) store.set(uri, { isDirectory, size: 0, text: '' });
  return store.get(uri);
}

class Entry {
  constructor(...uris) {
    this.uri = normalize(uris);
    record(this.uri, this.constructor === Directory);
  }

  get name() {
    return this.uri.split('/').filter(Boolean).pop() || '';
  }

  get exists() {
    return store.has(this.uri);
  }

  get size() {
    return store.get(this.uri)?.size ?? 0;
  }

  delete() {
    store.delete(this.uri);
  }
}

class Directory extends Entry {
  constructor(...uris) {
    super(...uris);
    record(this.uri, true);
  }

  list() {
    return [];
  }

  create() {}

  createDirectory(name) {
    return new Directory(this.uri, name);
  }

  createFile(name) {
    return new File(this.uri, name);
  }
}

class File extends Entry {
  constructor(...uris) {
    super(...uris);
    record(this.uri, false);
  }

  async readText() {
    return store.get(this.uri)?.text ?? '';
  }

  async writeText(text) {
    const rec = record(this.uri, false);
    rec.text = String(text ?? '');
    rec.size = rec.text.length;
  }

  async arrayBuffer() {
    return new ArrayBuffer(0);
  }

  async json() {
    return null;
  }

  async formData() {
    return new FormData();
  }

  slice() {
    return new File(this.uri);
  }

  open() {
    return 0;
  }

  close() {}
}

class Paths {
  static join(...uris) {
    return normalize(uris);
  }

  static get document() {
    return new Directory('documents');
  }

  static get cache() {
    return new Directory('cache');
  }

  static get bundle() {
    return new Directory('bundle');
  }

  static info() {
    return null;
  }
}

class DownloadResumable {
  constructor() {}
  async downloadAsync() {
    return { uri: '', exists: false, size: 0, md5: undefined };
  }
  async resumeAsync() {
    return { uri: '', exists: false, size: 0 };
  }
  pauseAsync() {}
  cancelAsync() {}
}

const legacy = {
  documentDirectory: 'documents/',
  cacheDirectory: 'cache/',
  getInfoAsync: async (uri) => ({
    exists: store.has(normalize([uri])),
    isDirectory: false,
    size: store.get(normalize([uri]))?.size ?? 0,
    uri: String(uri ?? ''),
    modificationTime: 0,
  }),
  readDirectoryAsync: async () => [],
  makeDirectoryAsync: async () => {},
  deleteAsync: async () => {},
  moveAsync: async () => {},
  copyAsync: async () => {},
  readAsStringAsync: async () => '',
  writeAsStringAsync: async () => {},
  readAsDataURLAsync: async () => '',
  createDownloadResumable: () => new DownloadResumable(),
  getTotalDiskSpaceAsync: async () => 0,
  getFreeDiskStorageAsync: async () => 0,
  DownloadResumable,
  UploadTask: class {},
  DownloadTask: class {},
};

export {
  Paths,
  File,
  Directory,
  FILE_MODE as FileMode,
  ENCODING_TYPE as EncodingType,
  UPLOAD_TYPE as UploadType,
  DownloadResumable,
};

export default legacy;
