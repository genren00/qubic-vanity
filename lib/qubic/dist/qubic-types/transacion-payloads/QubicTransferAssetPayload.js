"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QubicTransferAssetPayload = void 0;
const QubicPackageBuilder_1 = require("../../QubicPackageBuilder");
const DynamicPayload_1 = require("../DynamicPayload");
const Long_1 = require("../Long");
const PublicKey_1 = require("../PublicKey");
const qubicHelper_1 = require("../../qubicHelper");
/**
 *
 * Transaction Payload to transfer an Asset
 *
 * typedef struct
* {
*     uint8_t issuer[32];
*     uint8_t newOwnerAndPossessor[32];
*     unsigned long long assetName;
*     long long numberOfUnits;
* } TransferAssetOwnershipAndPossession_input;
 *
 *
 *
 */
class QubicTransferAssetPayload {
    constructor() {
        this._internalPackageSize = 32 + 32 + 8 + 8;
    }
    // todo: think about adding getters
    setIssuer(issuer) {
        if (typeof issuer === "string") {
            this.issuer = new PublicKey_1.PublicKey(issuer);
        }
        else {
            this.issuer = issuer;
        }
        return this;
    }
    setNewOwnerAndPossessor(newOwnerAndPossessor) {
        if (typeof newOwnerAndPossessor === "string") {
            this.newOwnerAndPossessor = new PublicKey_1.PublicKey(newOwnerAndPossessor);
        }
        else {
            this.newOwnerAndPossessor = newOwnerAndPossessor;
        }
        return this;
    }
    setAssetName(assetName) {
        if (typeof assetName === "string") {
            const utf8Encode = new TextEncoder();
            const nameBytes = utf8Encode.encode(assetName);
            this.assetName = new Uint8Array(8);
            nameBytes.forEach((b, i) => {
                this.assetName[i] = b;
            });
        }
        else {
            this.assetName = assetName;
        }
        return this;
    }
    getAssetName() {
        return this.assetName;
    }
    getIssuer() {
        return this.issuer;
    }
    getNewOwnerAndPossessor() {
        return this.newOwnerAndPossessor;
    }
    getNumberOfUnits() {
        return this.numberOfUnits;
    }
    setNumberOfUnits(numberOfUnits) {
        if (typeof numberOfUnits === "number") {
            this.numberOfUnits = new Long_1.Long(numberOfUnits);
        }
        else {
            this.numberOfUnits = numberOfUnits;
        }
        return this;
    }
    getPackageSize() {
        return this._internalPackageSize;
    }
    getPackageData() {
        const builder = new QubicPackageBuilder_1.QubicPackageBuilder(this.getPackageSize());
        builder.add(this.issuer);
        builder.add(this.newOwnerAndPossessor);
        builder.addRaw(this.assetName);
        builder.add(this.numberOfUnits);
        return builder.getData();
    }
    getTransactionPayload() {
        const payload = new DynamicPayload_1.DynamicPayload(this.getPackageSize());
        payload.setPayload(this.getPackageData());
        return payload;
    }
    async parse(data) {
        if (data.length !== this._internalPackageSize) {
            console.error("INVALID PACKAGE SIZE");
            return undefined;
        }
        const helper = new qubicHelper_1.QubicHelper();
        let start = 0;
        let end = 32; // size for issuer and newOwnerAndPossessor
        this.issuer = new PublicKey_1.PublicKey(await helper.getIdentity(data.slice(start, end)));
        start = end;
        end = start + 32; // size for newOwnerAndPossessor
        this.newOwnerAndPossessor = new PublicKey_1.PublicKey(await helper.getIdentity(data.slice(start, end)));
        start = end;
        end = start + 8; // size for asset name
        this.assetName = data.slice(start, end);
        let decoder = new TextDecoder(); // Create a TextDecoder for UTF-8 by default
        const result = decoder.decode(this.assetName); // Convert Uint8Array to string
        start = end;
        end = start + 8; // size for number of units
        this.numberOfUnits = new Long_1.Long(data.slice(start, end));
        return this;
    }
}
exports.QubicTransferAssetPayload = QubicTransferAssetPayload;
