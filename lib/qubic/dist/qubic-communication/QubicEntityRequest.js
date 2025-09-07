"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QubicEntityRequest = void 0;
const QubicPackageBuilder_1 = require("../QubicPackageBuilder");
const PublicKey_1 = require("../qubic-types/PublicKey");
const QubicDefinitions_1 = require("../QubicDefinitions");
/**
 * typedef struct
* {
*     unsigned char publicKey[32];
* } RequestedEntity;
 */
class QubicEntityRequest {
    getPublicKey() {
        return this.publicKey;
    }
    setPublicKey(publicKey) {
        this.publicKey = publicKey;
    }
    constructor(publicKey) {
        this._internalPackageSize = 32;
        this.publicKey = new PublicKey_1.PublicKey();
        if (publicKey !== undefined)
            this.setPublicKey(publicKey);
    }
    getPackageSize() {
        return this.getPackageData().length;
    }
    parse(data) {
        if (data.length !== this._internalPackageSize) {
            console.error("INVALID PACKAGE SIZE");
            return undefined;
        }
        this.setPublicKey(new PublicKey_1.PublicKey(data.slice(0, QubicDefinitions_1.QubicDefinitions.PUBLIC_KEY_LENGTH)));
        return this;
    }
    getPackageData() {
        const builder = new QubicPackageBuilder_1.QubicPackageBuilder(this._internalPackageSize);
        builder.add(this.publicKey);
        return builder.getData();
    }
}
exports.QubicEntityRequest = QubicEntityRequest;
