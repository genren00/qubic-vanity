"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QubicPackageBuilder = void 0;
const QubicDefinitions_1 = require("./QubicDefinitions");
const crypto_1 = __importDefault(require("./crypto"));
const keyHelper_1 = require("./keyHelper");
class QubicPackageBuilder {
    constructor(size) {
        this.offset = 0;
        // todo: create a dynamic builder
        this.packet = new Uint8Array(size);
    }
    getData() {
        return this.packet;
    }
    sign(seed) {
        return crypto_1.default.then(({ schnorrq, K12 }) => {
            const keyHelper = new keyHelper_1.KeyHelper();
            const privateKey = keyHelper.privateKey(seed, 0, K12);
            const publicKey = keyHelper.createPublicKey(privateKey, schnorrq, K12);
            const digest = new Uint8Array(QubicDefinitions_1.QubicDefinitions.DIGEST_LENGTH);
            const toSign = this.packet.slice(0, this.offset);
            K12(toSign, digest, QubicDefinitions_1.QubicDefinitions.DIGEST_LENGTH);
            const signatur = schnorrq.sign(privateKey, publicKey, digest);
            this.packet.set(signatur, this.offset);
            this.offset += QubicDefinitions_1.QubicDefinitions.SIGNATURE_LENGTH;
            return this.packet.slice(0, this.offset);
        });
    }
    signAndDigest(seed) {
        return crypto_1.default.then(({ schnorrq, K12 }) => {
            const keyHelper = new keyHelper_1.KeyHelper();
            const privateKey = keyHelper.privateKey(seed, 0, K12);
            const publicKey = keyHelper.createPublicKey(privateKey, schnorrq, K12);
            const digest = new Uint8Array(QubicDefinitions_1.QubicDefinitions.DIGEST_LENGTH);
            const toSign = this.packet.slice(0, this.offset);
            K12(toSign, digest, QubicDefinitions_1.QubicDefinitions.DIGEST_LENGTH);
            const signature = schnorrq.sign(privateKey, publicKey, digest);
            this.packet.set(signature, this.offset);
            this.offset += QubicDefinitions_1.QubicDefinitions.SIGNATURE_LENGTH;
            const signedData = this.packet.slice(0, this.offset);
            K12(signedData, digest, QubicDefinitions_1.QubicDefinitions.DIGEST_LENGTH);
            return {
                signedData: signedData,
                digest: digest,
                signature: signature
            };
        });
    }
    add(q) {
        const data = q.getPackageData();
        this.packet.set(data, this.offset);
        this.offset += data.length;
        return this;
    }
    adduint8Array(q) {
        return this.addRaw(q);
    }
    addRaw(q) {
        this.packet.set(q, this.offset);
        this.offset += q.length;
        return this;
    }
    addShort(q /* must be a short */) {
        this.packet.set(this.FromShort(q), this.offset);
        this.offset += 2;
        return this;
    }
    addInt(q /* must be a short */) {
        this.packet.set(this.FromInt(q), this.offset);
        this.offset += 4;
        return this;
    }
    FromInt(num) {
        // If num is a 32-bit integer
        let buffer = new ArrayBuffer(4); // 4 bytes for a 32-bit integer
        let dataview = new DataView(buffer);
        dataview.setInt32(0, num, true); // Use setUint32 if you are dealing with unsigned integers
        return new Uint8Array(buffer);
    }
    FromShort(num) {
        // If num is a 32-bit integer
        let buffer = new ArrayBuffer(2); // 4 bytes for a 32-bit integer
        let dataview = new DataView(buffer);
        dataview.setInt16(0, num, true); // Use setUint32 if you are dealing with unsigned integers
        return new Uint8Array(buffer);
    }
}
exports.QubicPackageBuilder = QubicPackageBuilder;
