export const workerScript = `var he = Object.defineProperty;
var de = (r, e, t) => e in r ? he(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var a = (r, e, t) => de(r, typeof e != "symbol" ? e + "" : e, t);
const R = class R extends Error {
  constructor(t = "Open failed") {
    super(t);
    a(this, "name", R.name);
    a(this, "code", R.code);
  }
};
a(R, "name", "OpenFailedError"), a(R, "code", "ERR_OPEN_FAILED");
let J = R;
const U = class U extends Error {
  constructor(t = "Put failed") {
    super(t);
    a(this, "name", U.name);
    a(this, "code", U.code);
  }
};
a(U, "name", "PutFailedError"), a(U, "code", "ERR_PUT_FAILED");
let z = U;
const D = class D extends Error {
  constructor(t = "Get failed") {
    super(t);
    a(this, "name", D.name);
    a(this, "code", D.code);
  }
};
a(D, "name", "GetFailedError"), a(D, "code", "ERR_GET_FAILED");
let B = D;
const $ = class $ extends Error {
  constructor(t = "Delete failed") {
    super(t);
    a(this, "name", $.name);
    a(this, "code", $.code);
  }
};
a($, "name", "DeleteFailedError"), a($, "code", "ERR_DELETE_FAILED");
let Q = $;
const I = class I extends Error {
  constructor(t = "Not Found") {
    super(t);
    a(this, "name", I.name);
    a(this, "code", I.code);
  }
};
a(I, "name", "NotFoundError"), a(I, "code", "ERR_NOT_FOUND");
let K = I;
function fe(r) {
  const [e, t] = r[Symbol.asyncIterator] != null ? [r[Symbol.asyncIterator](), Symbol.asyncIterator] : [r[Symbol.iterator](), Symbol.iterator], n = [];
  return {
    peek: () => e.next(),
    push: (o) => {
      n.push(o);
    },
    next: () => n.length > 0 ? {
      done: !1,
      value: n.shift()
    } : e.next(),
    [t]() {
      return this;
    }
  };
}
function ue(r) {
  return r[Symbol.asyncIterator] != null;
}
function q(r, e) {
  let t = 0;
  if (ue(r))
    return async function* () {
      for await (const h of r)
        yield e(h, t++);
    }();
  const n = fe(r), { value: o, done: s } = n.next();
  if (s === !0)
    return function* () {
    }();
  const i = e(o, t++);
  if (typeof i.then == "function")
    return async function* () {
      yield await i;
      for await (const h of n)
        yield e(h, t++);
    }();
  const c = e;
  return function* () {
    yield i;
    for (const h of n)
      yield c(h, t++);
  }();
}
function ye(r) {
  return r[Symbol.asyncIterator] != null;
}
function we(r, e = 1) {
  return e = Number(e), ye(r) ? async function* () {
    let t = [];
    if (e < 1 && (e = 1), e !== Math.round(e))
      throw new Error("Batch size must be an integer");
    for await (const n of r)
      for (t.push(n); t.length >= e; )
        yield t.slice(0, e), t = t.slice(e);
    for (; t.length > 0; )
      yield t.slice(0, e), t = t.slice(e);
  }() : function* () {
    let t = [];
    if (e < 1 && (e = 1), e !== Math.round(e))
      throw new Error("Batch size must be an integer");
    for (const n of r)
      for (t.push(n); t.length >= e; )
        yield t.slice(0, e), t = t.slice(e);
    for (; t.length > 0; )
      yield t.slice(0, e), t = t.slice(e);
  }();
}
async function* j(r, e = 1) {
  for await (const t of we(r, e)) {
    const n = t.map(async (o) => o().then((s) => ({ ok: !0, value: s }), (s) => ({ ok: !1, err: s })));
    for (let o = 0; o < n.length; o++) {
      const s = await n[o];
      if (s.ok)
        yield s.value;
      else
        throw s.err;
    }
  }
}
function pe(r, e) {
  if (r === e)
    return !0;
  if (r.byteLength !== e.byteLength)
    return !1;
  for (let t = 0; t < r.byteLength; t++)
    if (r[t] !== e[t])
      return !1;
  return !0;
}
function Y(r) {
  if (r instanceof Uint8Array && r.constructor.name === "Uint8Array")
    return r;
  if (r instanceof ArrayBuffer)
    return new Uint8Array(r);
  if (ArrayBuffer.isView(r))
    return new Uint8Array(r.buffer, r.byteOffset, r.byteLength);
  throw new Error("Unknown type, must be binary type");
}
function be(r, e) {
  if (r.length >= 255)
    throw new TypeError("Alphabet too long");
  for (var t = new Uint8Array(256), n = 0; n < t.length; n++)
    t[n] = 255;
  for (var o = 0; o < r.length; o++) {
    var s = r.charAt(o), i = s.charCodeAt(0);
    if (t[i] !== 255)
      throw new TypeError(s + " is ambiguous");
    t[i] = o;
  }
  var c = r.length, h = r.charAt(0), A = Math.log(c) / Math.log(256), y = Math.log(256) / Math.log(c);
  function k(l) {
    if (l instanceof Uint8Array || (ArrayBuffer.isView(l) ? l = new Uint8Array(l.buffer, l.byteOffset, l.byteLength) : Array.isArray(l) && (l = Uint8Array.from(l))), !(l instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (l.length === 0)
      return "";
    for (var u = 0, C = 0, p = 0, g = l.length; p !== g && l[p] === 0; )
      p++, u++;
    for (var m = (g - p) * y + 1 >>> 0, w = new Uint8Array(m); p !== g; ) {
      for (var v = l[p], M = 0, b = m - 1; (v !== 0 || M < C) && b !== -1; b--, M++)
        v += 256 * w[b] >>> 0, w[b] = v % c >>> 0, v = v / c >>> 0;
      if (v !== 0)
        throw new Error("Non-zero carry");
      C = M, p++;
    }
    for (var x = m - C; x !== m && w[x] === 0; )
      x++;
    for (var L = h.repeat(u); x < m; ++x)
      L += r.charAt(w[x]);
    return L;
  }
  function O(l) {
    if (typeof l != "string")
      throw new TypeError("Expected String");
    if (l.length === 0)
      return new Uint8Array();
    var u = 0;
    if (l[u] !== " ") {
      for (var C = 0, p = 0; l[u] === h; )
        C++, u++;
      for (var g = (l.length - u) * A + 1 >>> 0, m = new Uint8Array(g); l[u]; ) {
        var w = t[l.charCodeAt(u)];
        if (w === 255)
          return;
        for (var v = 0, M = g - 1; (w !== 0 || v < p) && M !== -1; M--, v++)
          w += c * m[M] >>> 0, m[M] = w % 256 >>> 0, w = w / 256 >>> 0;
        if (w !== 0)
          throw new Error("Non-zero carry");
        p = v, u++;
      }
      if (l[u] !== " ") {
        for (var b = g - p; b !== g && m[b] === 0; )
          b++;
        for (var x = new Uint8Array(C + (g - b)), L = C; b !== g; )
          x[L++] = m[b++];
        return x;
      }
    }
  }
  function le(l) {
    var u = O(l);
    if (u)
      return u;
    throw new Error(\`Non-\${e} character\`);
  }
  return {
    encode: k,
    decodeUnsafe: O,
    decode: le
  };
}
var ge = be, me = ge;
class ve {
  constructor(e, t, n) {
    a(this, "name");
    a(this, "prefix");
    a(this, "baseEncode");
    this.name = e, this.prefix = t, this.baseEncode = n;
  }
  encode(e) {
    if (e instanceof Uint8Array)
      return \`\${this.prefix}\${this.baseEncode(e)}\`;
    throw Error("Unknown type, must be binary type");
  }
}
class xe {
  constructor(e, t, n) {
    a(this, "name");
    a(this, "prefix");
    a(this, "baseDecode");
    a(this, "prefixCodePoint");
    this.name = e, this.prefix = t;
    const o = t.codePointAt(0);
    if (o === void 0)
      throw new Error("Invalid prefix character");
    this.prefixCodePoint = o, this.baseDecode = n;
  }
  decode(e) {
    if (typeof e == "string") {
      if (e.codePointAt(0) !== this.prefixCodePoint)
        throw Error(\`Unable to decode multibase string \${JSON.stringify(e)}, \${this.name} decoder only supports inputs prefixed with \${this.prefix}\`);
      return this.baseDecode(e.slice(this.prefix.length));
    } else
      throw Error("Can only multibase decode strings");
  }
  or(e) {
    return ae(this, e);
  }
}
class Ee {
  constructor(e) {
    a(this, "decoders");
    this.decoders = e;
  }
  or(e) {
    return ae(this, e);
  }
  decode(e) {
    const t = e[0], n = this.decoders[t];
    if (n != null)
      return n.decode(e);
    throw RangeError(\`Unable to decode multibase string \${JSON.stringify(e)}, only inputs prefixed with \${Object.keys(this.decoders)} are supported\`);
  }
}
function ae(r, e) {
  return new Ee({
    ...r.decoders ?? { [r.prefix]: r },
    ...e.decoders ?? { [e.prefix]: e }
  });
}
class Me {
  constructor(e, t, n, o) {
    a(this, "name");
    a(this, "prefix");
    a(this, "baseEncode");
    a(this, "baseDecode");
    a(this, "encoder");
    a(this, "decoder");
    this.name = e, this.prefix = t, this.baseEncode = n, this.baseDecode = o, this.encoder = new ve(e, t, n), this.decoder = new xe(e, t, o);
  }
  encode(e) {
    return this.encoder.encode(e);
  }
  decode(e) {
    return this.decoder.decode(e);
  }
}
function ie({ name: r, prefix: e, encode: t, decode: n }) {
  return new Me(r, e, t, n);
}
function P({ name: r, prefix: e, alphabet: t }) {
  const { encode: n, decode: o } = me(t, r);
  return ie({
    prefix: e,
    name: r,
    encode: n,
    decode: (s) => Y(o(s))
  });
}
function Se(r, e, t, n) {
  const o = {};
  for (let y = 0; y < e.length; ++y)
    o[e[y]] = y;
  let s = r.length;
  for (; r[s - 1] === "="; )
    --s;
  const i = new Uint8Array(s * t / 8 | 0);
  let c = 0, h = 0, A = 0;
  for (let y = 0; y < s; ++y) {
    const k = o[r[y]];
    if (k === void 0)
      throw new SyntaxError(\`Non-\${n} character\`);
    h = h << t | k, c += t, c >= 8 && (c -= 8, i[A++] = 255 & h >> c);
  }
  if (c >= t || 255 & h << 8 - c)
    throw new SyntaxError("Unexpected end of data");
  return i;
}
function Ce(r, e, t) {
  const n = e[e.length - 1] === "=", o = (1 << t) - 1;
  let s = "", i = 0, c = 0;
  for (let h = 0; h < r.length; ++h)
    for (c = c << 8 | r[h], i += 8; i > t; )
      i -= t, s += e[o & c >> i];
  if (i !== 0 && (s += e[o & c << t - i]), n)
    for (; s.length * t & 7; )
      s += "=";
  return s;
}
function E({ name: r, prefix: e, bitsPerChar: t, alphabet: n }) {
  return ie({
    prefix: e,
    name: r,
    encode(o) {
      return Ce(o, n, t);
    },
    decode(o) {
      return Se(o, n, t, r);
    }
  });
}
const V = E({
  prefix: "b",
  name: "base32",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567",
  bitsPerChar: 5
});
E({
  prefix: "B",
  name: "base32upper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
  bitsPerChar: 5
});
E({
  prefix: "c",
  name: "base32pad",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
  bitsPerChar: 5
});
E({
  prefix: "C",
  name: "base32padupper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
  bitsPerChar: 5
});
E({
  prefix: "v",
  name: "base32hex",
  alphabet: "0123456789abcdefghijklmnopqrstuv",
  bitsPerChar: 5
});
E({
  prefix: "V",
  name: "base32hexupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
  bitsPerChar: 5
});
E({
  prefix: "t",
  name: "base32hexpad",
  alphabet: "0123456789abcdefghijklmnopqrstuv=",
  bitsPerChar: 5
});
E({
  prefix: "T",
  name: "base32hexpadupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
  bitsPerChar: 5
});
E({
  prefix: "h",
  name: "base32z",
  alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
  bitsPerChar: 5
});
const G = P({
  prefix: "k",
  name: "base36",
  alphabet: "0123456789abcdefghijklmnopqrstuvwxyz"
});
P({
  prefix: "K",
  name: "base36upper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
});
const S = P({
  name: "base58btc",
  prefix: "z",
  alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
});
P({
  name: "base58flickr",
  prefix: "Z",
  alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
});
var Ae = ce, ee = 128, ke = 127, Re = ~ke, Ue = Math.pow(2, 31);
function ce(r, e, t) {
  e = e || [], t = t || 0;
  for (var n = t; r >= Ue; )
    e[t++] = r & 255 | ee, r /= 128;
  for (; r & Re; )
    e[t++] = r & 255 | ee, r >>>= 7;
  return e[t] = r | 0, ce.bytes = t - n + 1, e;
}
var De = W, $e = 128, te = 127;
function W(r, n) {
  var t = 0, n = n || 0, o = 0, s = n, i, c = r.length;
  do {
    if (s >= c)
      throw W.bytes = 0, new RangeError("Could not decode varint");
    i = r[s++], t += o < 28 ? (i & te) << o : (i & te) * Math.pow(2, o), o += 7;
  } while (i >= $e);
  return W.bytes = s - n, t;
}
var Ie = Math.pow(2, 7), Ne = Math.pow(2, 14), Oe = Math.pow(2, 21), Le = Math.pow(2, 28), Ve = Math.pow(2, 35), ze = Math.pow(2, 42), Be = Math.pow(2, 49), Fe = Math.pow(2, 56), He = Math.pow(2, 63), Te = function(r) {
  return r < Ie ? 1 : r < Ne ? 2 : r < Oe ? 3 : r < Le ? 4 : r < Ve ? 5 : r < ze ? 6 : r < Be ? 7 : r < Fe ? 8 : r < He ? 9 : 10;
}, Pe = {
  encode: Ae,
  decode: De,
  encodingLength: Te
}, F = Pe;
function X(r, e = 0) {
  return [F.decode(r, e), F.decode.bytes];
}
function H(r, e, t = 0) {
  return F.encode(r, e, t), e;
}
function T(r) {
  return F.encodingLength(r);
}
function qe(r, e) {
  const t = e.byteLength, n = T(r), o = n + T(t), s = new Uint8Array(o + t);
  return H(r, s, 0), H(t, s, n), s.set(e, o), new _(r, t, e, s);
}
function je(r) {
  const e = Y(r), [t, n] = X(e), [o, s] = X(e.subarray(n)), i = e.subarray(n + s);
  if (i.byteLength !== o)
    throw new Error("Incorrect length");
  return new _(t, o, i, e);
}
function Ge(r, e) {
  if (r === e)
    return !0;
  {
    const t = e;
    return r.code === t.code && r.size === t.size && t.bytes instanceof Uint8Array && pe(r.bytes, t.bytes);
  }
}
class _ {
  /**
   * Creates a multihash digest.
   */
  constructor(e, t, n, o) {
    a(this, "code");
    a(this, "size");
    a(this, "digest");
    a(this, "bytes");
    this.code = e, this.size = t, this.digest = n, this.bytes = o;
  }
}
function re(r, e) {
  const { bytes: t, version: n } = r;
  switch (n) {
    case 0:
      return Qe(t, Z(r), e ?? S.encoder);
    default:
      return Ke(t, Z(r), e ?? V.encoder);
  }
}
const ne = /* @__PURE__ */ new WeakMap();
function Z(r) {
  const e = ne.get(r);
  if (e == null) {
    const t = /* @__PURE__ */ new Map();
    return ne.set(r, t), t;
  }
  return e;
}
var se;
class f {
  /**
   * @param version - Version of the CID
   * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
   * @param multihash - (Multi)hash of the of the content.
   */
  constructor(e, t, n, o) {
    a(this, "code");
    a(this, "version");
    a(this, "multihash");
    a(this, "bytes");
    a(this, "/");
    a(this, se, "CID");
    this.code = t, this.version = e, this.multihash = n, this.bytes = o, this["/"] = o;
  }
  /**
   * Signalling \`cid.asCID === cid\` has been replaced with \`cid['/'] === cid.bytes\`
   * please either use \`CID.asCID(cid)\` or switch to new signalling mechanism
   *
   * @deprecated
   */
  get asCID() {
    return this;
  }
  // ArrayBufferView
  get byteOffset() {
    return this.bytes.byteOffset;
  }
  // ArrayBufferView
  get byteLength() {
    return this.bytes.byteLength;
  }
  toV0() {
    switch (this.version) {
      case 0:
        return this;
      case 1: {
        const { code: e, multihash: t } = this;
        if (e !== N)
          throw new Error("Cannot convert a non dag-pb CID to CIDv0");
        if (t.code !== We)
          throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");
        return f.createV0(t);
      }
      default:
        throw Error(\`Can not convert CID version \${this.version} to version 0. This is a bug please report\`);
    }
  }
  toV1() {
    switch (this.version) {
      case 0: {
        const { code: e, digest: t } = this.multihash, n = qe(e, t);
        return f.createV1(this.code, n);
      }
      case 1:
        return this;
      default:
        throw Error(\`Can not convert CID version \${this.version} to version 1. This is a bug please report\`);
    }
  }
  equals(e) {
    return f.equals(this, e);
  }
  static equals(e, t) {
    const n = t;
    return n != null && e.code === n.code && e.version === n.version && Ge(e.multihash, n.multihash);
  }
  toString(e) {
    return re(this, e);
  }
  toJSON() {
    return { "/": re(this) };
  }
  link() {
    return this;
  }
  // Legacy
  [(se = Symbol.toStringTag, Symbol.for("nodejs.util.inspect.custom"))]() {
    return \`CID(\${this.toString()})\`;
  }
  /**
   * Takes any input \`value\` and returns a \`CID\` instance if it was
   * a \`CID\` otherwise returns \`null\`. If \`value\` is instanceof \`CID\`
   * it will return value back. If \`value\` is not instance of this CID
   * class, but is compatible CID it will return new instance of this
   * \`CID\` class. Otherwise returns null.
   *
   * This allows two different incompatible versions of CID library to
   * co-exist and interop as long as binary interface is compatible.
   */
  static asCID(e) {
    if (e == null)
      return null;
    const t = e;
    if (t instanceof f)
      return t;
    if (t["/"] != null && t["/"] === t.bytes || t.asCID === t) {
      const { version: n, code: o, multihash: s, bytes: i } = t;
      return new f(n, o, s, i ?? oe(n, o, s.bytes));
    } else if (t[Xe] === !0) {
      const { version: n, multihash: o, code: s } = t, i = je(o);
      return f.create(n, s, i);
    } else
      return null;
  }
  /**
   * @param version - Version of the CID
   * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
   * @param digest - (Multi)hash of the of the content.
   */
  static create(e, t, n) {
    if (typeof t != "number")
      throw new Error("String codecs are no longer supported");
    if (!(n.bytes instanceof Uint8Array))
      throw new Error("Invalid digest");
    switch (e) {
      case 0: {
        if (t !== N)
          throw new Error(\`Version 0 CID must use dag-pb (code: \${N}) block encoding\`);
        return new f(e, t, n, n.bytes);
      }
      case 1: {
        const o = oe(e, t, n.bytes);
        return new f(e, t, n, o);
      }
      default:
        throw new Error("Invalid version");
    }
  }
  /**
   * Simplified version of \`create\` for CIDv0.
   */
  static createV0(e) {
    return f.create(0, N, e);
  }
  /**
   * Simplified version of \`create\` for CIDv1.
   *
   * @param code - Content encoding format code.
   * @param digest - Multihash of the content.
   */
  static createV1(e, t) {
    return f.create(1, e, t);
  }
  /**
   * Decoded a CID from its binary representation. The byte array must contain
   * only the CID with no additional bytes.
   *
   * An error will be thrown if the bytes provided do not contain a valid
   * binary representation of a CID.
   */
  static decode(e) {
    const [t, n] = f.decodeFirst(e);
    if (n.length !== 0)
      throw new Error("Incorrect length");
    return t;
  }
  /**
   * Decoded a CID from its binary representation at the beginning of a byte
   * array.
   *
   * Returns an array with the first element containing the CID and the second
   * element containing the remainder of the original byte array. The remainder
   * will be a zero-length byte array if the provided bytes only contained a
   * binary CID representation.
   */
  static decodeFirst(e) {
    const t = f.inspectBytes(e), n = t.size - t.multihashSize, o = Y(e.subarray(n, n + t.multihashSize));
    if (o.byteLength !== t.multihashSize)
      throw new Error("Incorrect length");
    const s = o.subarray(t.multihashSize - t.digestSize), i = new _(t.multihashCode, t.digestSize, s, o);
    return [t.version === 0 ? f.createV0(i) : f.createV1(t.codec, i), e.subarray(t.size)];
  }
  /**
   * Inspect the initial bytes of a CID to determine its properties.
   *
   * Involves decoding up to 4 varints. Typically this will require only 4 to 6
   * bytes but for larger multicodec code values and larger multihash digest
   * lengths these varints can be quite large. It is recommended that at least
   * 10 bytes be made available in the \`initialBytes\` argument for a complete
   * inspection.
   */
  static inspectBytes(e) {
    let t = 0;
    const n = () => {
      const [k, O] = X(e.subarray(t));
      return t += O, k;
    };
    let o = n(), s = N;
    if (o === 18 ? (o = 0, t = 0) : s = n(), o !== 0 && o !== 1)
      throw new RangeError(\`Invalid CID version \${o}\`);
    const i = t, c = n(), h = n(), A = t + h, y = A - i;
    return { version: o, codec: s, multihashCode: c, digestSize: h, multihashSize: y, size: A };
  }
  /**
   * Takes cid in a string representation and creates an instance. If \`base\`
   * decoder is not provided will use a default from the configuration. It will
   * throw an error if encoding of the CID is not compatible with supplied (or
   * a default decoder).
   */
  static parse(e, t) {
    const [n, o] = Je(e, t), s = f.decode(o);
    if (s.version === 0 && e[0] !== "Q")
      throw Error("Version 0 CID string must not include multibase prefix");
    return Z(s).set(n, e), s;
  }
}
function Je(r, e) {
  switch (r[0]) {
    case "Q": {
      const t = e ?? S;
      return [
        S.prefix,
        t.decode(\`\${S.prefix}\${r}\`)
      ];
    }
    case S.prefix: {
      const t = e ?? S;
      return [S.prefix, t.decode(r)];
    }
    case V.prefix: {
      const t = e ?? V;
      return [V.prefix, t.decode(r)];
    }
    case G.prefix: {
      const t = e ?? G;
      return [G.prefix, t.decode(r)];
    }
    default: {
      if (e == null)
        throw Error("To parse non base32, base36 or base58btc encoded CID multibase decoder must be provided");
      return [r[0], e.decode(r)];
    }
  }
}
function Qe(r, e, t) {
  const { prefix: n } = t;
  if (n !== S.prefix)
    throw Error(\`Cannot string encode V0 in \${t.name} encoding\`);
  const o = e.get(n);
  if (o == null) {
    const s = t.encode(r).slice(1);
    return e.set(n, s), s;
  } else
    return o;
}
function Ke(r, e, t) {
  const { prefix: n } = t, o = e.get(n);
  if (o == null) {
    const s = t.encode(r);
    return e.set(n, s), s;
  } else
    return o;
}
const N = 112, We = 18;
function oe(r, e, t) {
  const n = T(r), o = n + T(e), s = new Uint8Array(o + t.byteLength);
  return H(r, s, 0), H(e, s, n), s.set(t, o), s;
}
const Xe = Symbol.for("@ipld/js-cid/CID");
class Ze {
  /**
   * @param path - The path to the OPFS directory, without slash
   * @param init - The OPFSBlockstoreInit object.
   */
  constructor(e, t = {}) {
    a(this, "putManyConcurrency");
    a(this, "getManyConcurrency");
    a(this, "deleteManyConcurrency");
    a(this, "path");
    a(this, "opfsRoot");
    a(this, "bsRoot");
    this.deleteManyConcurrency = t.deleteManyConcurrency ?? 50, this.getManyConcurrency = t.getManyConcurrency ?? 50, this.putManyConcurrency = t.putManyConcurrency ?? 50, this.path = e;
  }
  async open() {
    try {
      this.opfsRoot = await navigator.storage.getDirectory(), this.bsRoot = await this.opfsRoot.getDirectoryHandle(this.path, { create: !0 });
    } catch (e) {
      throw new J(String(e));
    }
  }
  close() {
  }
  /**
   * @throws PutFailedError
   * @throws QuotaExceededError
   */
  async put(e, t) {
    try {
      const o = await (await this.bsRoot.getFileHandle(e.toString(), { create: !0 })).createSyncAccessHandle(), s = o.write(t, { at: 0 });
      if (s !== t.byteLength)
        throw o.close(), new z(\`write length \${s} !== \${t.byteLength}\`);
      return o.close(), e;
    } catch (n) {
      throw new z(String(n));
    }
  }
  async *putMany(e) {
    yield* j(
      q(e, ({ cid: t, block: n }) => async () => (await this.put(t, n), t)),
      this.putManyConcurrency
    );
  }
  async get(e) {
    try {
      const n = await (await this.bsRoot.getFileHandle(e.toString(), { create: !1 })).createSyncAccessHandle(), o = n.getSize(), s = new DataView(new ArrayBuffer(o));
      return n.read(s), n.close(), new Uint8Array(s.buffer);
    } catch (t) {
      throw new K(String(t));
    }
  }
  async *getMany(e) {
    yield* j(
      q(e, (t) => async () => ({
        cid: t,
        block: await this.get(t)
      })),
      this.getManyConcurrency
    );
  }
  /**
   * Deletes a block by its CID.
   *
   * @param key - CID.
   */
  async delete(e) {
    try {
      await this.bsRoot.removeEntry(e.toString());
    } catch (t) {
      throw new Q(String(t));
    }
  }
  async *deleteMany(e) {
    yield* j(
      q(e, (t) => async () => (await this.delete(t), t)),
      this.deleteManyConcurrency
    );
  }
  /**
   * Checks if a block exists by its original CID.
   *
   * @param key - The original CID.
   * @returns A boolean indicating existence.
   */
  async has(e) {
    try {
      await this.bsRoot.getFileHandle(e.toString(), { create: !1 });
    } catch {
      return !1;
    }
    return !0;
  }
  async *getAll() {
    try {
      for await (const [e, t] of this.bsRoot.entries())
        if (t.kind === "file") {
          let n;
          try {
            n = f.parse(e);
          } catch {
            console.warn(\`Skipping invalid CID filename: \${e}\`);
            continue;
          }
          try {
            const s = await (await this.bsRoot.getFileHandle(e, { create: !1 })).createSyncAccessHandle(), i = s.getSize(), c = new DataView(new ArrayBuffer(i));
            s.read(c), s.close(), yield { cid: n, block: new Uint8Array(c.buffer) };
          } catch (o) {
            throw new B(String(o));
          }
        }
    } catch (e) {
      throw new B(String(e));
    }
  }
  async deleteAll() {
    "remove" in FileSystemFileHandle.prototype ? await this.bsRoot.remove({ recursive: !0 }) : await this.opfsRoot.removeEntry(this.path, { recursive: !0 });
  }
  async ls() {
    const e = [];
    for await (const [t] of this.bsRoot)
      e.push(t);
    return e;
  }
  setPutManyConcurrency(e) {
    this.putManyConcurrency = e;
  }
  setGetManyConcurrency(e) {
    this.getManyConcurrency = e;
  }
  setDeleteManyConcurrency(e) {
    this.deleteManyConcurrency = e;
  }
}
let d;
self.addEventListener("message", (r) => {
  Ye(r).catch((e) => {
    self.postMessage(
      {
        id: r.data.id,
        error: e,
        errorName: e.name,
        errorMessage: e.message,
        errorStack: e.stack
      }
    );
  });
});
async function Ye(r) {
  const { id: e, method: t, params: n } = r.data;
  switch (t) {
    case "open": {
      await _e(e, n);
      break;
    }
    case "close": {
      if (d === void 0)
        break;
      d.close(), self.postMessage({ id: e, result: null });
      break;
    }
    case "put": {
      if (d === void 0)
        throw new Error("store is not open");
      const o = await d.put(n.key, n.value);
      self.postMessage({ id: e, result: o });
      break;
    }
    case "get": {
      if (d === void 0)
        throw new Error("store is not open");
      const o = await d.get(n.key);
      self.postMessage({ id: e, result: o }, { transfer: [o.buffer] });
      break;
    }
    case "delete": {
      if (d === void 0)
        throw new Error("store is not open");
      await d.delete(n.key), self.postMessage({ id: e, result: null });
      break;
    }
    case "deleteAll": {
      if (d === void 0)
        throw new Error("store is not open");
      await d.deleteAll(), self.postMessage({ id: e, result: null });
      break;
    }
    case "has": {
      if (d === void 0)
        throw new Error("store is not open");
      const o = await d.has(n.key);
      self.postMessage({ id: e, result: o });
      break;
    }
    case "ls": {
      if (d === void 0)
        throw new Error("store is not open");
      const o = await d.ls();
      self.postMessage({ id: e, result: o });
      break;
    }
    case "getMany":
      throw new Error("getMany not implemented");
    case "putMany":
      throw new Error("putAll not implemented");
    case "deleteMany":
      throw new Error("deleteMany not implemented");
    case "getAll":
      throw new Error("getAll not implemented");
    default:
      throw new Error(\`Unknown method: \${t}\`);
  }
}
async function _e(r, e) {
  const { path: t, getManyConcurrency: n, putManyConcurrency: o, deleteManyConcurrency: s } = e;
  d = new Ze(t), await d.open(), n !== void 0 && d.setGetManyConcurrency(n), o !== void 0 && d.setPutManyConcurrency(o), s !== void 0 && d.setDeleteManyConcurrency(s), self.postMessage({ id: r, result: null });
}`;
