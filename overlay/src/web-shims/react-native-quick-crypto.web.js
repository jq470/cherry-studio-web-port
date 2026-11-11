/**
 * Web shim for `react-native-quick-crypto`.
 *
 * - `subtle` maps to the browser's native WebCrypto.subtle (used for Vertex
 *   service-account JWT signing).
 * - `Buffer` is a minimal Uint8Array wrapper covering the `Buffer.from(...)`
 *   calls in the desktop-connection Noise crypto path.
 * - `createHash` / `createCipheriv` / `createDecipheriv` back the Noise
 *   transport for local desktop pairing, which is a native-only feature and
 *   is not reachable in the browser; they expose a compatible shape but throw
 *   a clear error if actually invoked on web.
 */

const subtle =
  (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.subtle) || null;

class WebBuffer extends Uint8Array {
  static from(value, encoding) {
    if (value instanceof Uint8Array) return new WebBuffer(value);
    if (typeof value === 'string') {
      if (encoding === 'base64') {
        const bin = atob(value);
        const out = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
        return new WebBuffer(out);
      }
      const enc = new TextEncoder().encode(value);
      return new WebBuffer(enc);
    }
    return new WebBuffer(value);
  }

  static concat(list) {
    const total = list.reduce((n, b) => n + b.length, 0);
    const out = new Uint8Array(total);
    let off = 0;
    list.forEach((b) => {
      out.set(b, off);
      off += b.length;
    });
    return new WebBuffer(out);
  }

  toString(encoding) {
    if (encoding === 'base64') {
      let bin = '';
      this.forEach((b) => {
        bin += String.fromCharCode(b);
      });
      return btoa(bin);
    }
    return new TextDecoder().decode(this);
  }
}

function unsupported(name) {
  return () => {
    throw new Error(`[web-shim] ${name} is not supported in the browser build (native-only).`);
  };
}

function createHash() {
  return {
    update: unsupported('createHash.update'),
    digest: unsupported('createHash.digest'),
  };
}

function createCipheriv() {
  return {
    setAAD: unsupported('cipher.setAAD'),
    update: unsupported('cipher.update'),
    final: unsupported('cipher.final'),
    getAuthTag: unsupported('cipher.getAuthTag'),
  };
}

function createDecipheriv() {
  return {
    setAAD: unsupported('decipher.setAAD'),
    setAuthTag: unsupported('decipher.setAuthTag'),
    update: unsupported('decipher.update'),
    final: unsupported('decipher.final'),
  };
}

export { subtle, WebBuffer as Buffer, createHash, createCipheriv, createDecipheriv };
export default { subtle, Buffer: WebBuffer, createHash, createCipheriv, createDecipheriv };
