/* eslint-disable @stylistic/no-tabs */
export const workerScript = `//#region node_modules/interface-store/dist/src/errors.js
var e = class e extends Error {
	static name = "OpenFailedError";
	name = e.name;
	static code = "ERR_OPEN_FAILED";
	code = e.code;
	constructor(e = "Open failed") {
		super(e);
	}
}, t = class e extends Error {
	static name = "PutFailedError";
	name = e.name;
	static code = "ERR_PUT_FAILED";
	code = e.code;
	constructor(e = "Put failed") {
		super(e);
	}
}, n = class e extends Error {
	static name = "GetFailedError";
	name = e.name;
	static code = "ERR_GET_FAILED";
	code = e.code;
	constructor(e = "Get failed") {
		super(e);
	}
}, r = class e extends Error {
	static name = "DeleteFailedError";
	name = e.name;
	static code = "ERR_DELETE_FAILED";
	code = e.code;
	constructor(e = "Delete failed") {
		super(e);
	}
}, i = class e extends Error {
	static name = "NotFoundError";
	name = e.name;
	static code = "ERR_NOT_FOUND";
	code = e.code;
	constructor(e = "Not Found") {
		super(e);
	}
};
//#endregion
//#region node_modules/it-peekable/dist/src/index.js
function a(e) {
	let [t, n] = e[Symbol.asyncIterator] == null ? [e[Symbol.iterator](), Symbol.iterator] : [e[Symbol.asyncIterator](), Symbol.asyncIterator], r = [];
	return {
		peek: () => t.next(),
		push: (e) => {
			r.push(e);
		},
		next: () => r.length > 0 ? {
			done: !1,
			value: r.shift()
		} : t.next(),
		[n]() {
			return this;
		}
	};
}
//#endregion
//#region node_modules/it-map/dist/src/index.js
function o(e) {
	return e[Symbol.asyncIterator] != null;
}
function s(e, t) {
	let n = 0;
	if (o(e)) return (async function* () {
		for await (let r of e) yield t(r, n++);
	})();
	let r = a(e), { value: i, done: s } = r.next();
	if (s === !0) return function* () {}();
	let c = t(i, n++);
	if (typeof c.then == "function") return (async function* () {
		yield await c;
		for (let e of r) yield t(e, n++);
	})();
	let l = t;
	return (function* () {
		yield c;
		for (let e of r) yield l(e, n++);
	})();
}
//#endregion
//#region node_modules/it-batch/dist/src/index.js
function c(e) {
	return e[Symbol.asyncIterator] != null;
}
function l(e, t = 1) {
	return t = Number(t), c(e) ? async function* () {
		let n = [];
		if (t < 1 && (t = 1), t !== Math.round(t)) throw Error("Batch size must be an integer");
		for await (let r of e) for (n.push(r); n.length >= t;) yield n.slice(0, t), n = n.slice(t);
		for (; n.length > 0;) yield n.slice(0, t), n = n.slice(t);
	}() : function* () {
		let n = [];
		if (t < 1 && (t = 1), t !== Math.round(t)) throw Error("Batch size must be an integer");
		for (let r of e) for (n.push(r); n.length >= t;) yield n.slice(0, t), n = n.slice(t);
		for (; n.length > 0;) yield n.slice(0, t), n = n.slice(t);
	}();
}
//#endregion
//#region node_modules/it-parallel-batch/dist/src/index.js
async function* u(e, t = 1) {
	for await (let n of l(e, t)) {
		let e = n.map(async (e) => e().then((e) => ({
			ok: !0,
			value: e
		}), (e) => ({
			ok: !1,
			err: e
		})));
		for (let t = 0; t < e.length; t++) {
			let n = await e[t];
			if (n.ok) yield n.value;
			else throw n.err;
		}
	}
}
//#endregion
//#region node_modules/multiformats/dist/src/bytes.js
function d(e, t) {
	if (e === t) return !0;
	if (e.byteLength !== t.byteLength) return !1;
	for (let n = 0; n < e.byteLength; n++) if (e[n] !== t[n]) return !1;
	return !0;
}
function f(e) {
	if (e instanceof Uint8Array && e.constructor.name === "Uint8Array") return m(e);
	if (e instanceof ArrayBuffer) return new Uint8Array(e);
	if (ArrayBuffer.isView(e)) return m(new Uint8Array(e.buffer, e.byteOffset, e.byteLength));
	throw Error("Unknown type, must be binary type");
}
function p(e) {
	return e?.buffer instanceof ArrayBuffer;
}
function m(e) {
	return p(e) ? e : e.slice();
}
//#endregion
//#region node_modules/multiformats/dist/src/vendor/base-x.js
function h(e, t, n) {
	if (e.length >= 255) throw TypeError("Alphabet too long");
	for (var r = /* @__PURE__ */ new Uint8Array(256), i = 0; i < r.length; i++) r[i] = 255;
	for (var a = 0; a < e.length; a++) {
		var o = e.charAt(a), s = o.charCodeAt(0);
		if (r[s] !== 255) throw TypeError(o + " is ambiguous");
		if (r[s] = a, n) {
			var c = o.toLowerCase().charCodeAt(0), l = o.toUpperCase().charCodeAt(0);
			c !== s && (r[c] = a), l !== s && (r[l] = a);
		}
	}
	var u = e.length, d = e.charAt(0), f = Math.log(u) / Math.log(256), p = Math.log(256) / Math.log(u);
	function m(t) {
		if (t instanceof Uint8Array || (ArrayBuffer.isView(t) ? t = new Uint8Array(t.buffer, t.byteOffset, t.byteLength) : Array.isArray(t) && (t = Uint8Array.from(t))), !(t instanceof Uint8Array)) throw TypeError("Expected Uint8Array");
		if (t.length === 0) return "";
		for (var n = 0, r = 0, i = 0, a = t.length; i !== a && t[i] === 0;) i++, n++;
		for (var o = (a - i) * p + 1 >>> 0, s = new Uint8Array(o); i !== a;) {
			for (var c = t[i], l = 0, f = o - 1; (c !== 0 || l < r) && f !== -1; f--, l++) c += 256 * s[f] >>> 0, s[f] = c % u >>> 0, c = c / u >>> 0;
			if (c !== 0) throw Error("Non-zero carry");
			r = l, i++;
		}
		for (var m = o - r; m !== o && s[m] === 0;) m++;
		for (var h = d.repeat(n); m < o; ++m) h += e.charAt(s[m]);
		return h;
	}
	function h(e) {
		if (typeof e != "string") throw TypeError("Expected String");
		if (e.length === 0) return /* @__PURE__ */ new Uint8Array();
		var t = 0;
		if (e[t] !== " ") {
			for (var n = 0, i = 0; e[t] === d;) n++, t++;
			for (var a = (e.length - t) * f + 1 >>> 0, o = new Uint8Array(a); e[t];) {
				var s = r[e.charCodeAt(t)];
				if (s === 255) return;
				for (var c = 0, l = a - 1; (s !== 0 || c < i) && l !== -1; l--, c++) s += u * o[l] >>> 0, o[l] = s % 256 >>> 0, s = s / 256 >>> 0;
				if (s !== 0) throw Error("Non-zero carry");
				i = c, t++;
			}
			if (e[t] !== " ") {
				for (var p = a - i; p !== a && o[p] === 0;) p++;
				for (var m = new Uint8Array(n + (a - p)), h = n; p !== a;) m[h++] = o[p++];
				return m;
			}
		}
	}
	function g(e) {
		var n = h(e);
		if (n) return n;
		throw Error(\`Non-\${t} character\`);
	}
	return {
		encode: m,
		decodeUnsafe: h,
		decode: g
	};
}
var g = h, ee = class {
	name;
	prefix;
	baseEncode;
	constructor(e, t, n) {
		this.name = e, this.prefix = t, this.baseEncode = n;
	}
	encode(e) {
		if (e instanceof Uint8Array) return \`\${this.prefix}\${this.baseEncode(e)}\`;
		throw Error("Unknown type, must be binary type");
	}
}, _ = class {
	name;
	prefix;
	baseDecode;
	prefixCodePoint;
	constructor(e, t, n) {
		this.name = e, this.prefix = t;
		let r = t.codePointAt(0);
		/* c8 ignore next 3 */
		if (r === void 0) throw Error("Invalid prefix character");
		this.prefixCodePoint = r, this.baseDecode = n;
	}
	decode(e) {
		if (typeof e == "string") {
			if (e.codePointAt(0) !== this.prefixCodePoint) throw Error(\`Unable to decode multibase string \${JSON.stringify(e)}, \${this.name} decoder only supports inputs prefixed with \${this.prefix}\`);
			return this.baseDecode(e.slice(this.prefix.length));
		} else throw Error("Can only multibase decode strings");
	}
	or(e) {
		return y(this, e);
	}
}, v = class {
	decoders;
	constructor(e) {
		this.decoders = e;
	}
	or(e) {
		return y(this, e);
	}
	decode(e) {
		let t = e[0], n = this.decoders[t];
		if (n != null) return n.decode(e);
		throw RangeError(\`Unable to decode multibase string \${JSON.stringify(e)}, only inputs prefixed with \${Object.keys(this.decoders)} are supported\`);
	}
};
function y(e, t) {
	return new v({
		...e.decoders ?? { [e.prefix]: e },
		...t.decoders ?? { [t.prefix]: t }
	});
}
var b = class {
	name;
	prefix;
	baseEncode;
	baseDecode;
	encoder;
	decoder;
	constructor(e, t, n, r) {
		this.name = e, this.prefix = t, this.baseEncode = n, this.baseDecode = r, this.encoder = new ee(e, t, n), this.decoder = new _(e, t, r);
	}
	encode(e) {
		return this.encoder.encode(e);
	}
	decode(e) {
		return this.decoder.decode(e);
	}
};
function x({ name: e, prefix: t, encode: n, decode: r }) {
	return new b(e, t, n, r);
}
function S({ name: e, prefix: t, alphabet: n, caseInsensitive: r = !1 }) {
	let { encode: i, decode: a } = g(n, e, r);
	return x({
		prefix: t,
		name: e,
		encode: i,
		decode: (e) => f(a(e))
	});
}
function te(e, t, n, r) {
	let i = e.length;
	for (; e[i - 1] === "=";) --i;
	let a = new Uint8Array(i * n / 8 | 0), o = 0, s = 0, c = 0;
	for (let l = 0; l < i; ++l) {
		let i = t[e[l]];
		if (i === void 0) throw SyntaxError(\`Non-\${r} character\`);
		s = s << n | i, o += n, o >= 8 && (o -= 8, a[c++] = 255 & s >> o);
	}
	if (o >= n || 255 & s << 8 - o) throw SyntaxError("Unexpected end of data");
	return a;
}
function ne(e, t, n) {
	let r = t[t.length - 1] === "=", i = (1 << n) - 1, a = "", o = 0, s = 0;
	for (let r = 0; r < e.length; ++r) for (s = s << 8 | e[r], o += 8; o > n;) o -= n, a += t[i & s >> o];
	if (o !== 0 && (a += t[i & s << n - o]), r) for (; a.length * n & 7;) a += "=";
	return a;
}
function re(e, t) {
	let n = {};
	for (let r = 0; r < e.length; ++r) if (n[e[r]] = r, t) {
		let t = e[r].toLowerCase(), i = e[r].toUpperCase();
		t !== e[r] && (n[t] = r), i !== e[r] && (n[i] = r);
	}
	return n;
}
function C({ name: e, prefix: t, bitsPerChar: n, alphabet: r, caseInsensitive: i = !1 }) {
	let a = re(r, i);
	return x({
		prefix: t,
		name: e,
		encode(e) {
			return ne(e, r, n);
		},
		decode(t) {
			return te(t, a, n, e);
		}
	});
}
//#endregion
//#region node_modules/multiformats/dist/src/bases/base32.js
var w = C({
	prefix: "b",
	name: "base32",
	alphabet: "abcdefghijklmnopqrstuvwxyz234567",
	bitsPerChar: 5,
	caseInsensitive: !0
});
C({
	prefix: "B",
	name: "base32upper",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
	bitsPerChar: 5,
	caseInsensitive: !0
}), C({
	prefix: "c",
	name: "base32pad",
	alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
	bitsPerChar: 5,
	caseInsensitive: !0
}), C({
	prefix: "C",
	name: "base32padupper",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
	bitsPerChar: 5,
	caseInsensitive: !0
}), C({
	prefix: "v",
	name: "base32hex",
	alphabet: "0123456789abcdefghijklmnopqrstuv",
	bitsPerChar: 5,
	caseInsensitive: !0
}), C({
	prefix: "V",
	name: "base32hexupper",
	alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
	bitsPerChar: 5,
	caseInsensitive: !0
}), C({
	prefix: "t",
	name: "base32hexpad",
	alphabet: "0123456789abcdefghijklmnopqrstuv=",
	bitsPerChar: 5,
	caseInsensitive: !0
}), C({
	prefix: "T",
	name: "base32hexpadupper",
	alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
	bitsPerChar: 5,
	caseInsensitive: !0
}), C({
	prefix: "h",
	name: "base32z",
	alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
	bitsPerChar: 5
});
//#endregion
//#region node_modules/multiformats/dist/src/bases/base36.js
var T = S({
	prefix: "k",
	name: "base36",
	alphabet: "0123456789abcdefghijklmnopqrstuvwxyz",
	caseInsensitive: !0
});
S({
	prefix: "K",
	name: "base36upper",
	alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	caseInsensitive: !0
});
//#endregion
//#region node_modules/multiformats/dist/src/bases/base58.js
var E = S({
	name: "base58btc",
	prefix: "z",
	alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
});
S({
	name: "base58flickr",
	prefix: "Z",
	alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
});
//#endregion
//#region node_modules/multiformats/dist/src/vendor/varint.js
var D = k, O = 128, ie = -128, ae = 2 ** 31;
function k(e, t, n) {
	t ||= [], n ||= 0;
	for (var r = n; e >= ae;) t[n++] = e & 255 | O, e /= 128;
	for (; e & ie;) t[n++] = e & 255 | O, e >>>= 7;
	return t[n] = e | 0, k.bytes = n - r + 1, t;
}
var oe = j, se = 128, A = 127;
function j(e, t) {
	var n = 0, t = t || 0, r = 0, i = t, a, o = e.length;
	do {
		if (i >= o) throw j.bytes = 0, RangeError("Could not decode varint");
		a = e[i++], n += r < 28 ? (a & A) << r : (a & A) * 2 ** r, r += 7;
	} while (a >= se);
	return j.bytes = i - t, n;
}
var ce = 2 ** 7, le = 2 ** 14, ue = 2 ** 21, de = 2 ** 28, fe = 2 ** 35, M = 2 ** 42, N = 2 ** 49, P = 2 ** 56, F = 2 ** 63, I = {
	encode: D,
	decode: oe,
	encodingLength: function(e) {
		return e < ce ? 1 : e < le ? 2 : e < ue ? 3 : e < de ? 4 : e < fe ? 5 : e < M ? 6 : e < N ? 7 : e < P ? 8 : e < F ? 9 : 10;
	}
};
//#endregion
//#region node_modules/multiformats/dist/src/varint.js
function L(e, t = 0) {
	return [I.decode(e, t), I.decode.bytes];
}
function R(e, t, n = 0) {
	return I.encode(e, t, n), t;
}
function z(e) {
	return I.encodingLength(e);
}
//#endregion
//#region node_modules/multiformats/dist/src/hashes/digest.js
function B(e, t) {
	let n = t.byteLength, r = z(e), i = r + z(n), a = new Uint8Array(i + n);
	return R(e, a, 0), R(n, a, r), a.set(t, i), new V(e, n, t, a);
}
function pe(e) {
	let t = f(e), [n, r] = L(t), [i, a] = L(t.subarray(r)), o = t.subarray(r + a);
	if (o.byteLength !== i) throw Error("Incorrect length");
	return new V(n, i, o, t);
}
function me(e, t) {
	if (e === t) return !0;
	{
		let n = t;
		return e.code === n.code && e.size === n.size && n.bytes instanceof Uint8Array && d(e.bytes, n.bytes);
	}
}
var V = class {
	code;
	size;
	digest;
	bytes;
	constructor(e, t, n, r) {
		this.code = e, this.size = t, this.digest = m(n), this.bytes = m(r);
	}
};
//#endregion
//#region node_modules/multiformats/dist/src/cid.js
function H(e, t) {
	let { bytes: n, version: r } = e;
	switch (r) {
		case 0: return ge(n, W(e), t ?? E.encoder);
		default: return _e(n, W(e), t ?? w.encoder);
	}
}
var U = /* @__PURE__ */ new WeakMap();
function W(e) {
	let t = U.get(e);
	if (t == null) {
		let t = /* @__PURE__ */ new Map();
		return U.set(e, t), t;
	}
	return t;
}
var G = class e {
	code;
	version;
	multihash;
	bytes;
	"/";
	constructor(e, t, n, r) {
		this.code = t, this.version = e, this.multihash = n, this.bytes = m(r), this["/"] = this.bytes;
	}
	get asCID() {
		return this;
	}
	get byteOffset() {
		return this.bytes.byteOffset;
	}
	get byteLength() {
		return this.bytes.byteLength;
	}
	toV0() {
		switch (this.version) {
			case 0: return this;
			case 1: {
				let { code: t, multihash: n } = this;
				if (t !== K) throw Error("Cannot convert a non dag-pb CID to CIDv0");
				if (n.code !== ve) throw Error("Cannot convert non sha2-256 multihash CID to CIDv0");
				return e.createV0(n);
			}
			default: throw Error(\`Can not convert CID version \${this.version} to version 0. This is a bug please report\`);
		}
	}
	toV1() {
		switch (this.version) {
			case 0: {
				let { code: t, digest: n } = this.multihash, r = B(t, n);
				return e.createV1(this.code, r);
			}
			case 1: return this;
			default: throw Error(\`Can not convert CID version \${this.version} to version 1. This is a bug please report\`);
		}
	}
	equals(t) {
		return e.equals(this, t);
	}
	static equals(e, t) {
		let n = t;
		return n != null && e.code === n.code && e.version === n.version && me(e.multihash, n.multihash);
	}
	toString(e) {
		return H(this, e);
	}
	toJSON() {
		return { "/": H(this) };
	}
	link() {
		return this;
	}
	[Symbol.toStringTag] = "CID";
	[Symbol.for("nodejs.util.inspect.custom")]() {
		return \`CID(\${this.toString()})\`;
	}
	static asCID(t) {
		if (t == null) return null;
		let n = t;
		if (n instanceof e) return n;
		if (n["/"] != null && n["/"] === n.bytes || n.asCID === n) {
			let { version: t, code: r, multihash: i, bytes: a } = n;
			return new e(t, r, i, a ?? q(t, r, i.bytes));
		} else if (n[J] === !0) {
			let { version: t, multihash: r, code: i } = n, a = pe(r);
			return e.create(t, i, a);
		} else return null;
	}
	static create(t, n, r) {
		if (typeof n != "number") throw Error("String codecs are no longer supported");
		if (!(r.bytes instanceof Uint8Array)) throw Error("Invalid digest");
		switch (t) {
			case 0:
				if (n !== K) throw Error(\`Version 0 CID must use dag-pb (code: \${K}) block encoding\`);
				return new e(t, n, r, r.bytes);
			case 1: return new e(t, n, r, q(t, n, r.bytes));
			default: throw Error("Invalid version");
		}
	}
	static createV0(t) {
		return e.create(0, K, t);
	}
	static createV1(t, n) {
		return e.create(1, t, n);
	}
	static decode(t) {
		let [n, r] = e.decodeFirst(t);
		if (r.length !== 0) throw Error("Incorrect length");
		return n;
	}
	static decodeFirst(t) {
		let n = e.inspectBytes(t), r = n.size - n.multihashSize, i = f(t.subarray(r, r + n.multihashSize));
		if (i.byteLength !== n.multihashSize) throw Error("Incorrect length");
		let a = i.subarray(n.multihashSize - n.digestSize), o = new V(n.multihashCode, n.digestSize, a, i);
		return [n.version === 0 ? e.createV0(o) : e.createV1(n.codec, o), t.subarray(n.size)];
	}
	static inspectBytes(e) {
		let t = 0, n = () => {
			let [n, r] = L(e.subarray(t));
			return t += r, n;
		}, r = n(), i = K;
		if (r === 18 ? (r = 0, t = 0) : i = n(), r !== 0 && r !== 1) throw RangeError(\`Invalid CID version \${r}\`);
		let a = t, o = n(), s = n(), c = t + s, l = c - a;
		return {
			version: r,
			codec: i,
			multihashCode: o,
			digestSize: s,
			multihashSize: l,
			size: c
		};
	}
	static parse(t, n) {
		let [r, i] = he(t, n), a = e.decode(i);
		if (a.version === 0 && t[0] !== "Q") throw Error("Version 0 CID string must not include multibase prefix");
		return W(a).set(r, t), a;
	}
};
function he(e, t) {
	switch (e[0]) {
		case "Q": {
			let n = t ?? E;
			return [E.prefix, n.decode(\`\${E.prefix}\${e}\`)];
		}
		case E.prefix: {
			let n = t ?? E;
			return [E.prefix, n.decode(e)];
		}
		case w.prefix: {
			let n = t ?? w;
			return [w.prefix, n.decode(e)];
		}
		case T.prefix: {
			let n = t ?? T;
			return [T.prefix, n.decode(e)];
		}
		default:
			if (t == null) throw Error("To parse non base32, base36 or base58btc encoded CID multibase decoder must be provided");
			return [e[0], t.decode(e)];
	}
}
function ge(e, t, n) {
	let { prefix: r } = n;
	if (r !== E.prefix) throw Error(\`Cannot string encode V0 in \${n.name} encoding\`);
	let i = t.get(r);
	if (i == null) {
		let i = n.encode(e).slice(1);
		return t.set(r, i), i;
	} else return i;
}
function _e(e, t, n) {
	let { prefix: r } = n, i = t.get(r);
	if (i == null) {
		let i = n.encode(e);
		return t.set(r, i), i;
	} else return i;
}
var K = 112, ve = 18;
function q(e, t, n) {
	let r = z(e), i = r + z(t), a = new Uint8Array(i + n.byteLength);
	return R(e, a, 0), R(t, a, r), a.set(n, i), a;
}
var J = Symbol.for("@ipld/js-cid/CID"), ye = class extends Error {
	static name = "AbortError";
	name = "AbortError";
	constructor(e = "The operation was aborted", ...t) {
		super(e, ...t);
	}
};
//#endregion
//#region src/utils.ts
function Y(e) {
	if (e?.signal?.aborted === !0) throw new ye();
}
async function X(e) {
	if (e instanceof Uint8Array) return e;
	let t = [], n = 0;
	for await (let r of e) t.push(r), n += r.byteLength;
	let r = new Uint8Array(n), i = 0;
	for (let e of t) r.set(e, i), i += e.byteLength;
	return r;
}
function Z(e, t = !1) {
	if (!t && e.byteOffset === 0 && e.byteLength === e.buffer.byteLength && e.buffer instanceof ArrayBuffer) return e.buffer;
	let n = new ArrayBuffer(e.byteLength);
	return new Uint8Array(n).set(e), n;
}
async function* Q(e) {
	yield await e;
}
//#endregion
//#region src/web-worker-fs.ts
var be = class {
	putManyConcurrency;
	getManyConcurrency;
	deleteManyConcurrency;
	path;
	opfsRoot;
	bsRoot;
	constructor(e, t = {}) {
		this.deleteManyConcurrency = t.deleteManyConcurrency ?? 1, this.getManyConcurrency = t.getManyConcurrency ?? 50, this.putManyConcurrency = t.putManyConcurrency ?? 1, this.path = e;
	}
	async open() {
		try {
			this.opfsRoot = await navigator.storage.getDirectory(), this.bsRoot = await this.opfsRoot.getDirectoryHandle(this.path, { create: !0 });
		} catch (t) {
			throw new e(String(t));
		}
	}
	close() {}
	async putWithRetry(e, n = 3, r = 1e3) {
		let i = 0, a = [];
		for (; i < n;) {
			i++;
			try {
				let n = new Promise((e, n) => setTimeout(() => {
					n(new t("Operation timed out"));
				}, r));
				return await Promise.race([e(), n]);
			} catch (e) {
				if (a.push(e), i >= n) throw new t(\`All \${n} attempts failed: \${a.map((e, t) => \`Attempt \${t + 1}: \${e.message}\`).join("; ")}\`);
				await new Promise((e) => setTimeout(e, 100));
			}
		}
		throw new t("Unexpected error in putWithRetry");
	}
	async put(e, n, r) {
		return Y(r), this.putWithRetry(async () => {
			try {
				let r = await this.bsRoot.getFileHandle(e.toString(), { create: !0 }), i = Z(await X(n)), a = await r.createSyncAccessHandle();
				try {
					let e = a.write(i, { at: 0 });
					if (e !== i.byteLength) throw new t(\`write length \${e} !== \${i.byteLength}\`);
					a.truncate(i.byteLength), a.flush();
				} finally {
					a.close();
				}
				return e;
			} catch (e) {
				throw new t(String(e));
			}
		}, 3, 1e3);
	}
	async *putMany(e, t) {
		Y(t), yield* u(s(e, ({ cid: e, bytes: n }) => async () => (await this.put(e, n, t), e)), this.putManyConcurrency);
	}
	get(e, t) {
		return Y(t), Q(this.getBytes(e));
	}
	async getBytes(e) {
		try {
			let t = await (await this.bsRoot.getFileHandle(e.toString(), { create: !1 })).createSyncAccessHandle(), n = t.getSize(), r = new DataView(new ArrayBuffer(n));
			return t.read(r), t.close(), new Uint8Array(r.buffer);
		} catch (e) {
			throw new i(String(e));
		}
	}
	async *getMany(e, t) {
		Y(t), yield* u(s(e, (e) => async () => ({
			cid: e,
			bytes: this.get(e, t)
		})), this.getManyConcurrency);
	}
	async deleteWithRetry(e, t = 3, n = 1e3) {
		let i = 0, a = [];
		for (; i < t;) {
			i++;
			try {
				let t = new Promise((e, t) => setTimeout(() => {
					t(new r("Operation timed out"));
				}, n));
				await Promise.race([e(), t]);
				return;
			} catch (e) {
				if (a.push(e), i >= t) throw new r(\`All \${t} attempts failed: \${a.map((e, t) => \`Attempt \${t + 1}: \${e.message}\`).join("; ")}\`);
				await new Promise((e) => setTimeout(e, 100));
			}
		}
		throw new r("Unexpected error in deleteWithRetry");
	}
	async delete(e, t) {
		return Y(t), this.deleteWithRetry(async () => {
			try {
				await this.bsRoot.removeEntry(e.toString());
			} catch (e) {
				throw new r(String(e));
			}
		}, 3, 1e3);
	}
	async *deleteMany(e, t) {
		Y(t), yield* u(s(e, (e) => async () => (await this.delete(e, t), e)), this.deleteManyConcurrency);
	}
	async has(e, t) {
		Y(t);
		try {
			await this.bsRoot.getFileHandle(e.toString(), { create: !1 });
		} catch {
			return !1;
		}
		return !0;
	}
	async *getAll(e) {
		Y(e);
		try {
			for await (let [e, t] of this.bsRoot.entries()) if (t.kind === "file") {
				let t;
				try {
					t = G.parse(e);
				} catch {
					console.warn(\`Skipping invalid CID filename: \${e}\`);
					continue;
				}
				try {
					let n = await (await this.bsRoot.getFileHandle(e, { create: !1 })).createSyncAccessHandle(), r = n.getSize(), i = new DataView(new ArrayBuffer(r));
					n.read(i), n.close(), yield {
						cid: t,
						bytes: Q(new Uint8Array(i.buffer))
					};
				} catch (e) {
					throw new n(String(e));
				}
			}
		} catch (e) {
			throw new n(String(e));
		}
	}
	async deleteAll() {
		"remove" in FileSystemFileHandle.prototype ? await this.bsRoot.remove({ recursive: !0 }) : await this.opfsRoot.removeEntry(this.path, { recursive: !0 });
	}
	async ls() {
		let e = [];
		for await (let [t] of this.bsRoot) e.push(t);
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
}, $;
self.addEventListener("message", (e) => {
	xe(e).catch((t) => {
		self.postMessage({
			id: e?.data?.id,
			error: t,
			errorName: t?.name,
			errorMessage: t?.message,
			errorStack: t?.stack
		});
	});
});
async function xe(e) {
	let { id: t, method: n, params: r } = e.data;
	switch (n) {
		case "open":
			await Se(t, r);
			break;
		case "close":
			if ($ === void 0) break;
			$.close(), self.postMessage({
				id: t,
				result: null
			});
			break;
		case "put": {
			if ($ === void 0) throw Error("store is not open");
			let e = await $.put(G.parse(r.key), new Uint8Array(r.value));
			self.postMessage({
				id: t,
				result: e
			});
			break;
		}
		case "get": {
			if ($ === void 0) throw Error("store is not open");
			let e = Z(await X($.get(G.parse(r.key))));
			self.postMessage({
				id: t,
				result: e
			}, { transfer: [e] });
			break;
		}
		case "delete":
			if ($ === void 0) throw Error("store is not open");
			await $.delete(G.parse(r.key)), self.postMessage({
				id: t,
				result: null
			});
			break;
		case "deleteAll":
			if ($ === void 0) throw Error("store is not open");
			await $.deleteAll(), self.postMessage({
				id: t,
				result: null
			});
			break;
		case "has": {
			if ($ === void 0) throw Error("store is not open");
			let e = await $.has(G.parse(r.key));
			self.postMessage({
				id: t,
				result: e
			});
			break;
		}
		case "ls": {
			if ($ === void 0) throw Error("store is not open");
			let e = await $.ls();
			self.postMessage({
				id: t,
				result: e
			});
			break;
		}
		case "getMany": throw Error("getMany not implemented");
		case "putMany": throw Error("putAll not implemented");
		case "deleteMany": throw Error("deleteMany not implemented");
		case "getAll": throw Error("getAll not implemented");
		default: throw Error(\`Unknown method: \${n}\`);
	}
}
async function Se(e, t) {
	let { path: n, getManyConcurrency: r, putManyConcurrency: i, deleteManyConcurrency: a } = t;
	$ = new be(n), await $.open(), r !== void 0 && $.setGetManyConcurrency(r), i !== void 0 && $.setPutManyConcurrency(i), a !== void 0 && $.setDeleteManyConcurrency(a), self.postMessage({
		id: e,
		result: null
	});
}
//#endregion`
