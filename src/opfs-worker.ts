export const workerScript = `var he = Object.defineProperty;
var de = (n, e, t) => e in n ? he(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var a = (n, e, t) => de(n, typeof e != "symbol" ? e + "" : e, t);
const U = class U extends Error {
  constructor(t = "Open failed") {
    super(t);
    a(this, "name", U.name);
    a(this, "code", U.code);
  }
};
a(U, "name", "OpenFailedError"), a(U, "code", "ERR_OPEN_FAILED");
let J = U;
const D = class D extends Error {
  constructor(t = "Put failed") {
    super(t);
    a(this, "name", D.name);
    a(this, "code", D.code);
  }
};
a(D, "name", "PutFailedError"), a(D, "code", "ERR_PUT_FAILED");
let R = D;
const O = class O extends Error {
  constructor(t = "Get failed") {
    super(t);
    a(this, "name", O.name);
    a(this, "code", O.code);
  }
};
a(O, "name", "GetFailedError"), a(O, "code", "ERR_GET_FAILED");
let B = O;
const I = class I extends Error {
  constructor(t = "Delete failed") {
    super(t);
    a(this, "name", I.name);
    a(this, "code", I.code);
  }
};
a(I, "name", "DeleteFailedError"), a(I, "code", "ERR_DELETE_FAILED");
let $ = I;
const N = class N extends Error {
  constructor(t = "Not Found") {
    super(t);
    a(this, "name", N.name);
    a(this, "code", N.code);
  }
};
a(N, "name", "NotFoundError"), a(N, "code", "ERR_NOT_FOUND");
let Q = N;
function ue(n) {
  const [e, t] = n[Symbol.asyncIterator] != null ? [n[Symbol.asyncIterator](), Symbol.asyncIterator] : [n[Symbol.iterator](), Symbol.iterator], r = [];
  return {
    peek: () => e.next(),
    push: (s) => {
      r.push(s);
    },
    next: () => r.length > 0 ? {
      done: !1,
      value: r.shift()
    } : e.next(),
    [t]() {
      return this;
    }
  };
}
function fe(n) {
  return n[Symbol.asyncIterator] != null;
}
function q(n, e) {
  let t = 0;
  if (fe(n))
    return async function* () {
      for await (const l of n)
        yield e(l, t++);
    }();
  const r = ue(n), { value: s, done: o } = r.next();
  if (o === !0)
    return function* () {
    }();
  const i = e(s, t++);
  if (typeof i.then == "function")
    return async function* () {
      yield await i;
      for await (const l of r)
        yield e(l, t++);
    }();
  const c = e;
  return function* () {
    yield i;
    for (const l of r)
      yield c(l, t++);
  }();
}
function ye(n) {
  return n[Symbol.asyncIterator] != null;
}
function we(n, e = 1) {
  return e = Number(e), ye(n) ? async function* () {
    let t = [];
    if (e < 1 && (e = 1), e !== Math.round(e))
      throw new Error("Batch size must be an integer");
    for await (const r of n)
      for (t.push(r); t.length >= e; )
        yield t.slice(0, e), t = t.slice(e);
    for (; t.length > 0; )
      yield t.slice(0, e), t = t.slice(e);
  }() : function* () {
    let t = [];
    if (e < 1 && (e = 1), e !== Math.round(e))
      throw new Error("Batch size must be an integer");
    for (const r of n)
      for (t.push(r); t.length >= e; )
        yield t.slice(0, e), t = t.slice(e);
    for (; t.length > 0; )
      yield t.slice(0, e), t = t.slice(e);
  }();
}
async function* j(n, e = 1) {
  for await (const t of we(n, e)) {
    const r = t.map(async (s) => s().then((o) => ({ ok: !0, value: o }), (o) => ({ ok: !1, err: o })));
    for (let s = 0; s < r.length; s++) {
      const o = await r[s];
      if (o.ok)
        yield o.value;
      else
        throw o.err;
    }
  }
}
function pe(n, e) {
  if (n === e)
    return !0;
  if (n.byteLength !== e.byteLength)
    return !1;
  for (let t = 0; t < n.byteLength; t++)
    if (n[t] !== e[t])
      return !1;
  return !0;
}
function Y(n) {
  if (n instanceof Uint8Array && n.constructor.name === "Uint8Array")
    return n;
  if (n instanceof ArrayBuffer)
    return new Uint8Array(n);
  if (ArrayBuffer.isView(n))
    return new Uint8Array(n.buffer, n.byteOffset, n.byteLength);
  throw new Error("Unknown type, must be binary type");
}
function ge(n, e) {
  if (n.length >= 255)
    throw new TypeError("Alphabet too long");
  for (var t = new Uint8Array(256), r = 0; r < t.length; r++)
    t[r] = 255;
  for (var s = 0; s < n.length; s++) {
    var o = n.charAt(s), i = o.charCodeAt(0);
    if (t[i] !== 255)
      throw new TypeError(o + " is ambiguous");
    t[i] = s;
  }
  var c = n.length, l = n.charAt(0), y = Math.log(c) / Math.log(256), w = Math.log(256) / Math.log(c);
  function k(h) {
    if (h instanceof Uint8Array || (ArrayBuffer.isView(h) ? h = new Uint8Array(h.buffer, h.byteOffset, h.byteLength) : Array.isArray(h) && (h = Uint8Array.from(h))), !(h instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (h.length === 0)
      return "";
    for (var f = 0, C = 0, g = 0, m = h.length; g !== m && h[g] === 0; )
      g++, f++;
    for (var v = (m - g) * w + 1 >>> 0, p = new Uint8Array(v); g !== m; ) {
      for (var x = h[g], S = 0, b = v - 1; (x !== 0 || S < C) && b !== -1; b--, S++)
        x += 256 * p[b] >>> 0, p[b] = x % c >>> 0, x = x / c >>> 0;
      if (x !== 0)
        throw new Error("Non-zero carry");
      C = S, g++;
    }
    for (var M = v - C; M !== v && p[M] === 0; )
      M++;
    for (var T = l.repeat(f); M < v; ++M)
      T += n.charAt(p[M]);
    return T;
  }
  function V(h) {
    if (typeof h != "string")
      throw new TypeError("Expected String");
    if (h.length === 0)
      return new Uint8Array();
    var f = 0;
    if (h[f] !== " ") {
      for (var C = 0, g = 0; h[f] === l; )
        C++, f++;
      for (var m = (h.length - f) * y + 1 >>> 0, v = new Uint8Array(m); h[f]; ) {
        var p = t[h.charCodeAt(f)];
        if (p === 255)
          return;
        for (var x = 0, S = m - 1; (p !== 0 || x < g) && S !== -1; S--, x++)
          p += c * v[S] >>> 0, v[S] = p % 256 >>> 0, p = p / 256 >>> 0;
        if (p !== 0)
          throw new Error("Non-zero carry");
        g = x, f++;
      }
      if (h[f] !== " ") {
        for (var b = m - g; b !== m && v[b] === 0; )
          b++;
        for (var M = new Uint8Array(C + (m - b)), T = C; b !== m; )
          M[T++] = v[b++];
        return M;
      }
    }
  }
  function le(h) {
    var f = V(h);
    if (f)
      return f;
    throw new Error(\`Non-\${e} character\`);
  }
  return {
    encode: k,
    decodeUnsafe: V,
    decode: le
  };
}
var be = ge, me = be;
class ve {
  constructor(e, t, r) {
    a(this, "name");
    a(this, "prefix");
    a(this, "baseEncode");
    this.name = e, this.prefix = t, this.baseEncode = r;
  }
  encode(e) {
    if (e instanceof Uint8Array)
      return \`\${this.prefix}\${this.baseEncode(e)}\`;
    throw Error("Unknown type, must be binary type");
  }
}
class xe {
  constructor(e, t, r) {
    a(this, "name");
    a(this, "prefix");
    a(this, "baseDecode");
    a(this, "prefixCodePoint");
    this.name = e, this.prefix = t;
    const s = t.codePointAt(0);
    if (s === void 0)
      throw new Error("Invalid prefix character");
    this.prefixCodePoint = s, this.baseDecode = r;
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
class Me {
  constructor(e) {
    a(this, "decoders");
    this.decoders = e;
  }
  or(e) {
    return ae(this, e);
  }
  decode(e) {
    const t = e[0], r = this.decoders[t];
    if (r != null)
      return r.decode(e);
    throw RangeError(\`Unable to decode multibase string \${JSON.stringify(e)}, only inputs prefixed with \${Object.keys(this.decoders)} are supported\`);
  }
}
function ae(n, e) {
  return new Me({
    ...n.decoders ?? { [n.prefix]: n },
    ...e.decoders ?? { [e.prefix]: e }
  });
}
class Ee {
  constructor(e, t, r, s) {
    a(this, "name");
    a(this, "prefix");
    a(this, "baseEncode");
    a(this, "baseDecode");
    a(this, "encoder");
    a(this, "decoder");
    this.name = e, this.prefix = t, this.baseEncode = r, this.baseDecode = s, this.encoder = new ve(e, t, r), this.decoder = new xe(e, t, s);
  }
  encode(e) {
    return this.encoder.encode(e);
  }
  decode(e) {
    return this.decoder.decode(e);
  }
}
function ie({ name: n, prefix: e, encode: t, decode: r }) {
  return new Ee(n, e, t, r);
}
function W({ name: n, prefix: e, alphabet: t }) {
  const { encode: r, decode: s } = me(t, n);
  return ie({
    prefix: e,
    name: n,
    encode: r,
    decode: (o) => Y(s(o))
  });
}
function Se(n, e, t, r) {
  const s = {};
  for (let w = 0; w < e.length; ++w)
    s[e[w]] = w;
  let o = n.length;
  for (; n[o - 1] === "="; )
    --o;
  const i = new Uint8Array(o * t / 8 | 0);
  let c = 0, l = 0, y = 0;
  for (let w = 0; w < o; ++w) {
    const k = s[n[w]];
    if (k === void 0)
      throw new SyntaxError(\`Non-\${r} character\`);
    l = l << t | k, c += t, c >= 8 && (c -= 8, i[y++] = 255 & l >> c);
  }
  if (c >= t || 255 & l << 8 - c)
    throw new SyntaxError("Unexpected end of data");
  return i;
}
function Ae(n, e, t) {
  const r = e[e.length - 1] === "=", s = (1 << t) - 1;
  let o = "", i = 0, c = 0;
  for (let l = 0; l < n.length; ++l)
    for (c = c << 8 | n[l], i += 8; i > t; )
      i -= t, o += e[s & c >> i];
  if (i !== 0 && (o += e[s & c << t - i]), r)
    for (; o.length * t & 7; )
      o += "=";
  return o;
}
function E({ name: n, prefix: e, bitsPerChar: t, alphabet: r }) {
  return ie({
    prefix: e,
    name: n,
    encode(s) {
      return Ae(s, r, t);
    },
    decode(s) {
      return Se(s, r, t, n);
    }
  });
}
const z = E({
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
const G = W({
  prefix: "k",
  name: "base36",
  alphabet: "0123456789abcdefghijklmnopqrstuvwxyz"
});
W({
  prefix: "K",
  name: "base36upper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
});
const A = W({
  name: "base58btc",
  prefix: "z",
  alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
});
W({
  name: "base58flickr",
  prefix: "Z",
  alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
});
var Ce = ce, ee = 128, Re = 127, ke = ~Re, $e = Math.pow(2, 31);
function ce(n, e, t) {
  e = e || [], t = t || 0;
  for (var r = t; n >= $e; )
    e[t++] = n & 255 | ee, n /= 128;
  for (; n & ke; )
    e[t++] = n & 255 | ee, n >>>= 7;
  return e[t] = n | 0, ce.bytes = t - r + 1, e;
}
var Ue = K, De = 128, te = 127;
function K(n, r) {
  var t = 0, r = r || 0, s = 0, o = r, i, c = n.length;
  do {
    if (o >= c)
      throw K.bytes = 0, new RangeError("Could not decode varint");
    i = n[o++], t += s < 28 ? (i & te) << s : (i & te) * Math.pow(2, s), s += 7;
  } while (i >= De);
  return K.bytes = o - r, t;
}
var Oe = Math.pow(2, 7), Ie = Math.pow(2, 14), Ne = Math.pow(2, 21), Le = Math.pow(2, 28), Ve = Math.pow(2, 35), Te = Math.pow(2, 42), ze = Math.pow(2, 49), Be = Math.pow(2, 56), Fe = Math.pow(2, 63), He = function(n) {
  return n < Oe ? 1 : n < Ie ? 2 : n < Ne ? 3 : n < Le ? 4 : n < Ve ? 5 : n < Te ? 6 : n < ze ? 7 : n < Be ? 8 : n < Fe ? 9 : 10;
}, Pe = {
  encode: Ce,
  decode: Ue,
  encodingLength: He
}, F = Pe;
function X(n, e = 0) {
  return [F.decode(n, e), F.decode.bytes];
}
function H(n, e, t = 0) {
  return F.encode(n, e, t), e;
}
function P(n) {
  return F.encodingLength(n);
}
function We(n, e) {
  const t = e.byteLength, r = P(n), s = r + P(t), o = new Uint8Array(s + t);
  return H(n, o, 0), H(t, o, r), o.set(e, s), new _(n, t, e, o);
}
function qe(n) {
  const e = Y(n), [t, r] = X(e), [s, o] = X(e.subarray(r)), i = e.subarray(r + o);
  if (i.byteLength !== s)
    throw new Error("Incorrect length");
  return new _(t, s, i, e);
}
function je(n, e) {
  if (n === e)
    return !0;
  {
    const t = e;
    return n.code === t.code && n.size === t.size && t.bytes instanceof Uint8Array && pe(n.bytes, t.bytes);
  }
}
class _ {
  /**
   * Creates a multihash digest.
   */
  constructor(e, t, r, s) {
    a(this, "code");
    a(this, "size");
    a(this, "digest");
    a(this, "bytes");
    this.code = e, this.size = t, this.digest = r, this.bytes = s;
  }
}
function ne(n, e) {
  const { bytes: t, version: r } = n;
  switch (r) {
    case 0:
      return Je(t, Z(n), e ?? A.encoder);
    default:
      return Qe(t, Z(n), e ?? z.encoder);
  }
}
const re = /* @__PURE__ */ new WeakMap();
function Z(n) {
  const e = re.get(n);
  if (e == null) {
    const t = /* @__PURE__ */ new Map();
    return re.set(n, t), t;
  }
  return e;
}
var oe;
class u {
  /**
   * @param version - Version of the CID
   * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
   * @param multihash - (Multi)hash of the of the content.
   */
  constructor(e, t, r, s) {
    a(this, "code");
    a(this, "version");
    a(this, "multihash");
    a(this, "bytes");
    a(this, "/");
    a(this, oe, "CID");
    this.code = t, this.version = e, this.multihash = r, this.bytes = s, this["/"] = s;
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
        if (e !== L)
          throw new Error("Cannot convert a non dag-pb CID to CIDv0");
        if (t.code !== Ke)
          throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");
        return u.createV0(t);
      }
      default:
        throw Error(\`Can not convert CID version \${this.version} to version 0. This is a bug please report\`);
    }
  }
  toV1() {
    switch (this.version) {
      case 0: {
        const { code: e, digest: t } = this.multihash, r = We(e, t);
        return u.createV1(this.code, r);
      }
      case 1:
        return this;
      default:
        throw Error(\`Can not convert CID version \${this.version} to version 1. This is a bug please report\`);
    }
  }
  equals(e) {
    return u.equals(this, e);
  }
  static equals(e, t) {
    const r = t;
    return r != null && e.code === r.code && e.version === r.version && je(e.multihash, r.multihash);
  }
  toString(e) {
    return ne(this, e);
  }
  toJSON() {
    return { "/": ne(this) };
  }
  link() {
    return this;
  }
  // Legacy
  [(oe = Symbol.toStringTag, Symbol.for("nodejs.util.inspect.custom"))]() {
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
    if (t instanceof u)
      return t;
    if (t["/"] != null && t["/"] === t.bytes || t.asCID === t) {
      const { version: r, code: s, multihash: o, bytes: i } = t;
      return new u(r, s, o, i ?? se(r, s, o.bytes));
    } else if (t[Xe] === !0) {
      const { version: r, multihash: s, code: o } = t, i = qe(s);
      return u.create(r, o, i);
    } else
      return null;
  }
  /**
   * @param version - Version of the CID
   * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
   * @param digest - (Multi)hash of the of the content.
   */
  static create(e, t, r) {
    if (typeof t != "number")
      throw new Error("String codecs are no longer supported");
    if (!(r.bytes instanceof Uint8Array))
      throw new Error("Invalid digest");
    switch (e) {
      case 0: {
        if (t !== L)
          throw new Error(\`Version 0 CID must use dag-pb (code: \${L}) block encoding\`);
        return new u(e, t, r, r.bytes);
      }
      case 1: {
        const s = se(e, t, r.bytes);
        return new u(e, t, r, s);
      }
      default:
        throw new Error("Invalid version");
    }
  }
  /**
   * Simplified version of \`create\` for CIDv0.
   */
  static createV0(e) {
    return u.create(0, L, e);
  }
  /**
   * Simplified version of \`create\` for CIDv1.
   *
   * @param code - Content encoding format code.
   * @param digest - Multihash of the content.
   */
  static createV1(e, t) {
    return u.create(1, e, t);
  }
  /**
   * Decoded a CID from its binary representation. The byte array must contain
   * only the CID with no additional bytes.
   *
   * An error will be thrown if the bytes provided do not contain a valid
   * binary representation of a CID.
   */
  static decode(e) {
    const [t, r] = u.decodeFirst(e);
    if (r.length !== 0)
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
    const t = u.inspectBytes(e), r = t.size - t.multihashSize, s = Y(e.subarray(r, r + t.multihashSize));
    if (s.byteLength !== t.multihashSize)
      throw new Error("Incorrect length");
    const o = s.subarray(t.multihashSize - t.digestSize), i = new _(t.multihashCode, t.digestSize, o, s);
    return [t.version === 0 ? u.createV0(i) : u.createV1(t.codec, i), e.subarray(t.size)];
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
    const r = () => {
      const [k, V] = X(e.subarray(t));
      return t += V, k;
    };
    let s = r(), o = L;
    if (s === 18 ? (s = 0, t = 0) : o = r(), s !== 0 && s !== 1)
      throw new RangeError(\`Invalid CID version \${s}\`);
    const i = t, c = r(), l = r(), y = t + l, w = y - i;
    return { version: s, codec: o, multihashCode: c, digestSize: l, multihashSize: w, size: y };
  }
  /**
   * Takes cid in a string representation and creates an instance. If \`base\`
   * decoder is not provided will use a default from the configuration. It will
   * throw an error if encoding of the CID is not compatible with supplied (or
   * a default decoder).
   */
  static parse(e, t) {
    const [r, s] = Ge(e, t), o = u.decode(s);
    if (o.version === 0 && e[0] !== "Q")
      throw Error("Version 0 CID string must not include multibase prefix");
    return Z(o).set(r, e), o;
  }
}
function Ge(n, e) {
  switch (n[0]) {
    case "Q": {
      const t = e ?? A;
      return [
        A.prefix,
        t.decode(\`\${A.prefix}\${n}\`)
      ];
    }
    case A.prefix: {
      const t = e ?? A;
      return [A.prefix, t.decode(n)];
    }
    case z.prefix: {
      const t = e ?? z;
      return [z.prefix, t.decode(n)];
    }
    case G.prefix: {
      const t = e ?? G;
      return [G.prefix, t.decode(n)];
    }
    default: {
      if (e == null)
        throw Error("To parse non base32, base36 or base58btc encoded CID multibase decoder must be provided");
      return [n[0], e.decode(n)];
    }
  }
}
function Je(n, e, t) {
  const { prefix: r } = t;
  if (r !== A.prefix)
    throw Error(\`Cannot string encode V0 in \${t.name} encoding\`);
  const s = e.get(r);
  if (s == null) {
    const o = t.encode(n).slice(1);
    return e.set(r, o), o;
  } else
    return s;
}
function Qe(n, e, t) {
  const { prefix: r } = t, s = e.get(r);
  if (s == null) {
    const o = t.encode(n);
    return e.set(r, o), o;
  } else
    return s;
}
const L = 112, Ke = 18;
function se(n, e, t) {
  const r = P(n), s = r + P(e), o = new Uint8Array(s + t.byteLength);
  return H(n, o, 0), H(e, o, r), o.set(t, s), o;
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
  async putWithRetry(e, t = 3, r = 1e3) {
    let s = 0;
    const o = [];
    for (; s < t; ) {
      s++;
      try {
        const i = new Promise(
          (l, y) => setTimeout(() => {
            y(new R("Operation timed out"));
          }, r)
        );
        return await Promise.race([e(), i]);
      } catch (i) {
        if (o.push(i), console.warn(\`Attempt \${s} failed: \${i.message}\`), s >= t) {
          const c = o.map((l, y) => \`Attempt \${y + 1}: \${l.message}\`).join("; ");
          throw new R(\`All \${t} attempts failed: \${c}\`);
        }
        await new Promise((c) => setTimeout(c, 100));
      }
    }
    throw new R("Unexpected error in putWithRetry");
  }
  async put(e, t) {
    const r = async () => {
      try {
        const o = await (await this.bsRoot.getFileHandle(e.toString(), { create: !0 })).createSyncAccessHandle(), i = o.write(t, { at: 0 });
        if (i !== t.byteLength)
          throw o.close(), new R(\`write length \${i} !== \${t.byteLength}\`);
        return o.close(), e;
      } catch (s) {
        throw new R(String(s));
      }
    };
    return this.putWithRetry(r, 3, 1e3);
  }
  async *putMany(e) {
    yield* j(
      q(e, ({ cid: t, block: r }) => async () => (await this.put(t, r), t)),
      this.putManyConcurrency
    );
  }
  async get(e) {
    try {
      const r = await (await this.bsRoot.getFileHandle(e.toString(), { create: !1 })).createSyncAccessHandle(), s = r.getSize(), o = new DataView(new ArrayBuffer(s));
      return r.read(o), r.close(), new Uint8Array(o.buffer);
    } catch (t) {
      throw new Q(String(t));
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
  async deleteWithRetry(e, t = 3, r = 1e3) {
    let s = 0;
    const o = [];
    for (; s < t; ) {
      s++;
      try {
        const i = new Promise(
          (c, l) => setTimeout(() => {
            l(new $("Operation timed out"));
          }, r)
        );
        await Promise.race([e(), i]);
        return;
      } catch (i) {
        if (o.push(i), console.warn(\`Attempt \${s} failed: \${i.message}\`), s >= t) {
          const c = o.map((l, y) => \`Attempt \${y + 1}: \${l.message}\`).join("; ");
          throw new $(\`All \${t} attempts failed: \${c}\`);
        }
        await new Promise((c) => setTimeout(c, 100));
      }
    }
    throw new $("Unexpected error in deleteWithRetry");
  }
  /**
   * Deletes a block by its CID.
   *
   * @param key - CID.
   */
  async delete(e) {
    const t = async () => {
      try {
        await this.bsRoot.removeEntry(e.toString());
      } catch (r) {
        throw new $(String(r));
      }
    };
    return this.deleteWithRetry(t, 3, 1e3);
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
          let r;
          try {
            r = u.parse(e);
          } catch {
            console.warn(\`Skipping invalid CID filename: \${e}\`);
            continue;
          }
          try {
            const o = await (await this.bsRoot.getFileHandle(e, { create: !1 })).createSyncAccessHandle(), i = o.getSize(), c = new DataView(new ArrayBuffer(i));
            o.read(c), o.close(), yield {
              cid: r,
              block: new Uint8Array(c.buffer)
            };
          } catch (s) {
            throw new B(String(s));
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
self.addEventListener("message", (n) => {
  Ye(n).catch((e) => {
    var t;
    self.postMessage(
      {
        id: (t = n == null ? void 0 : n.data) == null ? void 0 : t.id,
        error: e,
        errorName: e == null ? void 0 : e.name,
        errorMessage: e == null ? void 0 : e.message,
        errorStack: e == null ? void 0 : e.stack
      }
    );
  });
});
async function Ye(n) {
  const { id: e, method: t, params: r } = n.data;
  switch (t) {
    case "open": {
      await _e(e, r);
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
      const s = await d.put(r.key, r.value);
      self.postMessage({ id: e, result: s });
      break;
    }
    case "get": {
      if (d === void 0)
        throw new Error("store is not open");
      const s = await d.get(r.key);
      self.postMessage({ id: e, result: s }, { transfer: [s.buffer] });
      break;
    }
    case "delete": {
      if (d === void 0)
        throw new Error("store is not open");
      await d.delete(r.key), self.postMessage({ id: e, result: null });
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
      const s = await d.has(r.key);
      self.postMessage({ id: e, result: s });
      break;
    }
    case "ls": {
      if (d === void 0)
        throw new Error("store is not open");
      const s = await d.ls();
      self.postMessage({ id: e, result: s });
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
async function _e(n, e) {
  const { path: t, getManyConcurrency: r, putManyConcurrency: s, deleteManyConcurrency: o } = e;
  d = new Ze(t), await d.open(), r !== void 0 && d.setGetManyConcurrency(r), s !== void 0 && d.setPutManyConcurrency(s), o !== void 0 && d.setDeleteManyConcurrency(o), self.postMessage({ id: n, result: null });
}`;
