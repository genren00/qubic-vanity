"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QubicEntityResponse = void 0;
const QubicPackageBuilder_1 = require("../QubicPackageBuilder");
const QubicEntity_1 = require("../qubic-types/QubicEntity");
/**
 * typedef struct
 * {
 *     unsigned char publicKey[32];
 *     long long incomingAmount, outgoingAmount;
 *     unsigned int numberOfIncomingTransfers, numberOfOutgoingTransfers;
 *     unsigned int latestIncomingTransferTick, latestOutgoingTransferTick;
 *     unsigned int tick;
 *     int spectrumIndex;
 *     unsigned char siblings[SPECTRUM_DEPTH][32];
 * } RespondedEntity;
 */
class QubicEntityResponse {
    getEntity() {
        return this.entity;
    }
    setEntity(entity) {
        this.entity = entity;
    }
    getTick() {
        return this.tick;
    }
    setTick(tick) {
        this.tick = tick;
    }
    getSpectrumIndex() {
        return this.spectrumIndex;
    }
    setSpectrumIndex(spectrumIndex) {
        this.spectrumIndex = spectrumIndex;
    }
    getSiblings() {
        return this.siblings;
    }
    setSiblings(siblings) {
        this.siblings = siblings;
    }
    constructor() {
        this._internalPackageSize = 840;
        this.entity = new QubicEntity_1.QubicEntity();
        this.tick = 0;
        this.spectrumIndex = 0;
        this.siblings = new Uint8Array();
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
        const entity = new QubicEntity_1.QubicEntity();
        if (entity.parse(data.slice(0, entity.getPackageSize())) !== undefined) {
            this.setEntity(entity);
            offset += entity.getPackageSize();
            this.setTick(dataView.getInt32(offset, true));
            offset += 4;
            this.setSpectrumIndex(dataView.getInt16(offset, true));
            offset += 4;
            this.setSiblings(data.slice(offset));
        }
        return this;
    }
    getPackageData() {
        const builder = new QubicPackageBuilder_1.QubicPackageBuilder(this._internalPackageSize);
        builder.add(this.entity);
        builder.addInt(this.tick);
        builder.addInt(this.spectrumIndex);
        builder.addRaw(this.siblings);
        return builder.getData();
    }
}
exports.QubicEntityResponse = QubicEntityResponse;
