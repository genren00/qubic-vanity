"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QubicEntity = void 0;
const Long_1 = require("./Long");
const QubicPackageBuilder_1 = require("../QubicPackageBuilder");
const PublicKey_1 = require("./PublicKey");
const QubicDefinitions_1 = require("../QubicDefinitions");
/**
 * typedef struct
 * {
 *     unsigned char publicKey[32];
 *     long long incomingAmount, outgoingAmount;
 *     unsigned int numberOfIncomingTransfers, numberOfOutgoingTransfers;
 *     unsigned int latestIncomingTransferTick, latestOutgoingTransferTick;
 * } Entity;
 */
class QubicEntity {
    getPublicKey() {
        return this.publicKey;
    }
    setPublicKey(publicKey) {
        this.publicKey = publicKey;
    }
    getIncomingAmount() {
        return this.incomingAmount;
    }
    setIncomingAmount(incomingAcmount) {
        this.incomingAmount = incomingAcmount;
    }
    getOutgoingAmount() {
        return this.outgoingAmount;
    }
    setOutgoingAmount(outgoingAmount) {
        this.outgoingAmount = outgoingAmount;
    }
    getNumberOfIncomingTransfers() {
        return this.numberOfIncomingTransfers;
    }
    setNumberOfIncomingTransfers(numberOfIncomingTransfers) {
        this.numberOfIncomingTransfers = numberOfIncomingTransfers;
    }
    getNumberOfOutgoingTransfers() {
        return this.numberOfOutgoingTransfers;
    }
    setNumberOfOutgoingTransfers(numberOfOutgoingTransfers) {
        this.numberOfOutgoingTransfers = numberOfOutgoingTransfers;
    }
    getLatestIncomingTransferTick() {
        return this.latestIncomingTransferTick;
    }
    setLatestIncomingTransferTick(latestIncomingTransferTick) {
        this.latestIncomingTransferTick = latestIncomingTransferTick;
    }
    getLatestOutgoingTransferTick() {
        return this.latestOutgoingTransferTick;
    }
    setLatestOutgoingTransferTick(latestOutgoingTransferTick) {
        this.latestOutgoingTransferTick = latestOutgoingTransferTick;
    }
    constructor() {
        this._internalPackageSize = 64;
        this.publicKey = new PublicKey_1.PublicKey();
        this.incomingAmount = new Long_1.Long();
        this.outgoingAmount = new Long_1.Long();
        this.numberOfIncomingTransfers = 0;
        this.numberOfOutgoingTransfers = 0;
        this.latestIncomingTransferTick = 0;
        this.latestOutgoingTransferTick = 0;
    }
    getBalance() {
        return Number(this.getIncomingAmount().getNumber() - this.getOutgoingAmount().getNumber());
    }
    getPackageSize() {
        return this.getPackageData().length;
    }
    parse(data) {
        if (data.length !== this._internalPackageSize) {
            console.error("INVALID PACKAGE SIZE");
            return undefined;
        }
        const dataView = new DataView(data.buffer);
        let offset = 0;
        this.setPublicKey(new PublicKey_1.PublicKey(data.slice(0, QubicDefinitions_1.QubicDefinitions.PUBLIC_KEY_LENGTH)));
        offset += QubicDefinitions_1.QubicDefinitions.PUBLIC_KEY_LENGTH;
        this.setIncomingAmount(new Long_1.Long(dataView.getBigInt64(offset, true)));
        offset += 8;
        this.setOutgoingAmount(new Long_1.Long(dataView.getBigInt64(offset, true)));
        offset += 8;
        this.setNumberOfIncomingTransfers(dataView.getInt32(offset, true));
        offset += 4;
        this.setNumberOfOutgoingTransfers(dataView.getInt32(offset, true));
        offset += 4;
        this.setLatestIncomingTransferTick(dataView.getInt32(offset, true));
        offset += 4;
        this.setLatestOutgoingTransferTick(dataView.getInt32(offset, true));
        offset += 4;
        return this;
    }
    getPackageData() {
        const builder = new QubicPackageBuilder_1.QubicPackageBuilder(this._internalPackageSize);
        builder.add(this.publicKey);
        builder.add(this.incomingAmount);
        builder.add(this.outgoingAmount);
        builder.addInt(this.numberOfIncomingTransfers);
        builder.addInt(this.numberOfOutgoingTransfers);
        builder.addInt(this.latestIncomingTransferTick);
        builder.addInt(this.latestOutgoingTransferTick);
        return builder.getData();
    }
}
exports.QubicEntity = QubicEntity;
