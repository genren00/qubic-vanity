"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicPayload = void 0;
class DynamicPayload {
    /**
     * Create a dynamic payload
     * the maxSize should be set to the max expected size for this paload.
     */
    constructor(maxSize) {
        this.filledSize = 0;
        this.maxSize = 0;
        this.bytes = new Uint8Array(maxSize).fill(0);
        this.maxSize = maxSize;
    }
    setPayload(data) {
        if (data.length > this.maxSize)
            throw new Error("data must be lower or equal " + this.maxSize);
        this.bytes = data;
        this.filledSize = this.bytes.length;
    }
    getPackageData() {
        if (this.filledSize == 0)
            return new Uint8Array(0);
        return this.bytes;
    }
    getPackageSize() {
        return this.filledSize;
    }
}
exports.DynamicPayload = DynamicPayload;
