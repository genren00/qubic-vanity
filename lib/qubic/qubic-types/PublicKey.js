"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicKey = void 0;
const keyHelper_1 = require("../keyHelper");
const QubicDefinitions_1 = require("../QubicDefinitions");
const qubicHelper_1 = require("../qubicHelper");
class PublicKey {
    constructor(identity = undefined) {
        this.bytes = new Uint8Array(QubicDefinitions_1.QubicDefinitions.PUBLIC_KEY_LENGTH).fill(0);
        this.identity = undefined;
        if (typeof identity === "string") {
            this.setIdentityFromString(identity);
        }
        else if (identity !== undefined) {
            this.setIdentity(identity);
        }
    }
    setIdentityFromString(id) {
        this.identity = id;
        this.setIdentity(keyHelper_1.KeyHelper.getIdentityBytes(id));
    }
    async setIdentity(bytes) {
        this.bytes = bytes;
        // convert byte to id
        this.identity = await new qubicHelper_1.QubicHelper().getIdentity(bytes);
    }
    getIdentity() {
        return this.bytes;
    }
    getIdentityAsSring() {
        return this.identity;
    }
    getPackageSize() {
        return this.bytes.length;
    }
    getPackageData() {
        return this.bytes;
    }
    equals(compare) {
        return compare && this.bytes.length === compare.bytes.length && this.bytes.every((value, index) => value === compare.bytes[index]);
    }
    async verifyIdentity() {
        return await new qubicHelper_1.QubicHelper().verifyIdentity(this.identity);
    }
}
exports.PublicKey = PublicKey;
