"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signature = void 0;
const QubicDefinitions_1 = require("../QubicDefinitions");
class Signature {
    constructor(data = undefined) {
        this.bytes = new Uint8Array(QubicDefinitions_1.QubicDefinitions.SIGNATURE_LENGTH).fill(0);
        if (data) {
            this.setSignature(data);
        }
    }
    setSignature(bytes) {
        this.bytes = bytes;
    }
    getPackageData() {
        return this.bytes;
    }
    getPackageSize() {
        return this.bytes.length;
    }
}
exports.Signature = Signature;
