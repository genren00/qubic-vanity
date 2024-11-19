"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestResponseHeader = void 0;
class RequestResponseHeader {
    /**
     *
     * @param packageType type of the package to send (use QubicPackagetypes statics)
     * @param payloadSize size of the qubic package (header size is added automatically)
     */
    constructor(packageType = undefined, payloadSize = undefined) {
        this.size = 0;
        this.type = 0;
        this.dejaVu = 0;
        if (packageType !== undefined) {
            this.setType(packageType);
        }
        if (payloadSize !== undefined) {
            this.setSize(payloadSize + this.getPackageSize());
        }
        else {
            this.setSize(this.getPackageSize());
        }
    }
    setType(t) {
        this.type = t;
        return this;
    }
    getType() {
        return this.type;
    }
    setSize(t) {
        this.size = t;
        return this;
    }
    getSize() {
        return this.size;
    }
    setDejaVu(t) {
        this.dejaVu = t;
        return this;
    }
    getDejaVu() {
        return this.dejaVu;
    }
    randomizeDejaVu() {
        this.dejaVu = Math.floor(Math.random() * 2147483647);
    }
    getPackageSize() {
        return this.getPackageData().length;
    }
    parse(data) {
        if (data.length < 8) {
            console.error("INVALID PACKAGE SIZE");
            return undefined;
        }
        this.setSize((data[2] << 16) | (data[1] << 8) | data[0]);
        this.setType(data[3]);
        this.setDejaVu((data[2] << 24) | (data[2] << 16) | (data[1] << 8) | data[0]);
        return this;
    }
    getPackageData() {
        // validation of packet
        if (this.size > 16777215) {
            throw new Error("Size cannot be >16777215");
        }
        if (this.type > 255 || this.type < 0) {
            throw new Error("Type must be between 0 and 255");
        }
        var bytes = new Uint8Array(8).fill(0);
        let offset = 0;
        // generate size
        bytes[offset++] = this.size;
        bytes[offset++] = (this.size >> 8);
        bytes[offset++] = (this.size >> 16);
        bytes[offset++] = this.type;
        bytes[offset++] = this.dejaVu;
        bytes[offset++] = (this.dejaVu >> 8);
        bytes[offset++] = (this.dejaVu >> 16);
        bytes[offset++] = (this.dejaVu >> 24);
        return bytes;
    }
}
exports.RequestResponseHeader = RequestResponseHeader;
