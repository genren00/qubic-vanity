'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHECKSUM_LENGTH = exports.NONCE_LENGTH = exports.DIGEST_LENGTH = exports.PUBLIC_KEY_LENGTH = exports.PRIVATE_KEY_LENGTH = exports.SIGNATURE_LENGTH = exports.KECCAK_STATE_LENGTH = void 0;
const libFourQ_K12_js_1 = __importDefault(require("./libFourQ_K12.js"));
const keccakp_js_1 = require("./keccakp.js");
const allocU8 = function (l, v) {
    let ptr = libFourQ_K12_js_1.default._malloc(l);
    let chunk = libFourQ_K12_js_1.default.HEAPU8.subarray(ptr, ptr + l);
    if (v) {
        chunk.set(v);
    }
    return chunk;
};
const allocU16 = function (l, v) {
    let ptr = libFourQ_K12_js_1.default._malloc(l);
    let chunk = libFourQ_K12_js_1.default.HEAPU16.subarray(ptr, ptr + l);
    chunk.set(v);
    return chunk;
};
/**
 * @namespace Crypto
 */
/**
 * A promise which always resolves to object with crypto functions.
 *
 * @constant {Promise<Crypto>}
 * @memberof module:qubic
 */
const crypto = new Promise(function (resolve) {
    libFourQ_K12_js_1.default.onRuntimeInitialized = function () {
        /**
         * @memberof Crypto.schnorrq
         * @param {Uint8Array} secretKey
         * @returns {Uint8Array}
         */
        const generatePublicKey = function (secretKey) {
            const sk = allocU8(secretKey.length, secretKey);
            const pk = allocU8(32);
            const free = function () {
                libFourQ_K12_js_1.default._free(sk.byteOffset);
                libFourQ_K12_js_1.default._free(pk.byteOffset);
            };
            libFourQ_K12_js_1.default._SchnorrQ_KeyGeneration(sk.byteOffset, pk.byteOffset);
            const key = pk.slice();
            free();
            return key;
        };
        /**
         * @memberof Crypto.schnorrq
         * @param {Uint8Array} secretKey
         * @param {Uint8Array} publicKey
         * @param {Uint8Array} message
         * @returns {Uint8Array}
         */
        const sign = function (secretKey, publicKey, message) {
            const sk = allocU8(secretKey.length, secretKey);
            const pk = allocU8(publicKey.length, publicKey);
            const m = allocU8(message.length, message);
            const s = allocU8(64);
            const free = function () {
                libFourQ_K12_js_1.default._free(sk.byteOffset);
                libFourQ_K12_js_1.default._free(pk.byteOffset);
                libFourQ_K12_js_1.default._free(m.byteOffset);
                libFourQ_K12_js_1.default._free(s.byteOffset);
            };
            libFourQ_K12_js_1.default._SchnorrQ_Sign(sk.byteOffset, pk.byteOffset, m.byteOffset, message.length, s.byteOffset);
            const sig = s.slice();
            free();
            return sig;
        };
        /**
         * @memberof Crypto.schnorrq
         * @param {Uint8Array} publicKey
         * @param {Uint8Array} message
         * @param {Uint8Array} signature
         * @returns {number} 1 if valid, 0 if invalid
         */
        const verify = function (publicKey, message, signature) {
            const pk = allocU8(publicKey.length, publicKey);
            const m = allocU8(message.length, message);
            const s = allocU8(signature.length, signature);
            const v = allocU16(1, new Uint16Array(1));
            const free = function () {
                libFourQ_K12_js_1.default._free(pk.byteOffset);
                libFourQ_K12_js_1.default._free(m.byteOffset);
                libFourQ_K12_js_1.default._free(s.byteOffset);
                libFourQ_K12_js_1.default._free(v.byteOffset);
            };
            libFourQ_K12_js_1.default._SchnorrQ_Verify(pk.byteOffset, m.byteOffset, message.length, s.byteOffset, v.byteOffset);
            const ver = v[0];
            free();
            return ver;
        };
        /**
         * @memberof Crypto.kex
         * @param {Uint8Array} secretKey
         * @returns {Uint8Array} Public key
         */
        const generateCompressedPublicKey = function (secretKey) {
            const sk = allocU8(secretKey.length, secretKey);
            const pk = allocU8(32);
            const free = function () {
                libFourQ_K12_js_1.default._free(sk.byteOffset);
                libFourQ_K12_js_1.default._free(pk.byteOffset);
            };
            libFourQ_K12_js_1.default._CompressedPublicKeyGeneration(sk.byteOffset, pk.byteOffset);
            const key = pk.slice();
            free();
            return key;
        };
        /**
         * @memberof Crypto.kex
         * @param {Uint8Array} secretKey
         * @param {Uint8Array} publicKey
         * @returns {Uint8Array} Shared key
         */
        const compressedSecretAgreement = function (secretKey, publicKey) {
            const sk = allocU8(secretKey.length, secretKey);
            const pk = allocU8(publicKey.length, publicKey);
            const shk = allocU8(32);
            const free = function () {
                libFourQ_K12_js_1.default._free(sk.byteOffset);
                libFourQ_K12_js_1.default._free(pk.byteOffset);
                libFourQ_K12_js_1.default._free(shk.byteOffset);
            };
            libFourQ_K12_js_1.default._CompressedSecretAgreement(sk.byteOffset, pk.byteOffset, shk.byteOffset);
            const key = shk.slice();
            free();
            return key;
        };
        /**
         * @memberof Crypto
         * @param {Uint8Array} input
         * @param {Uint8Array} output
         * @param {number} outputLength
         * @param {number} outputOffset
         */
        const K12 = function (input, output, outputLength, outputOffset = 0) {
            const i = allocU8(input.length, input);
            const o = allocU8(outputLength, new Uint8Array(outputLength));
            const free = function () {
                libFourQ_K12_js_1.default._free(i.byteOffset);
                libFourQ_K12_js_1.default._free(o.byteOffset);
            };
            libFourQ_K12_js_1.default._KangarooTwelve(i.byteOffset, input.length, o.byteOffset, outputLength, 0, 0);
            output.set(o.slice(), outputOffset);
            free();
        };
        resolve({
            /**
             * @namespace Crypto.schnorrq
             */
            schnorrq: {
                generatePublicKey,
                sign,
                verify,
            },
            /**
             * @namespace Crypto.kex
             */
            kex: {
                generateCompressedPublicKey,
                compressedSecretAgreement,
            },
            K12,
            keccakP160012: keccakp_js_1.keccakP160012,
            KECCAK_STATE_LENGTH: 200,
        });
    };
});
crypto.keccakP160012 = keccakp_js_1.keccakP160012;
exports.KECCAK_STATE_LENGTH = 200;
exports.SIGNATURE_LENGTH = 64;
exports.PRIVATE_KEY_LENGTH = 32;
exports.PUBLIC_KEY_LENGTH = 32;
exports.DIGEST_LENGTH = 32;
exports.NONCE_LENGTH = 32;
exports.CHECKSUM_LENGTH = 3;
exports.default = crypto;
