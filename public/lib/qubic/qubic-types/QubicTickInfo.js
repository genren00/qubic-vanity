"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QubicTickInfo = void 0;
const QubicPackageBuilder_1 = require("../QubicPackageBuilder");
/**
 * typedef struct
* {
*     unsigned short tickDuration;
*     unsigned short epoch;
*     unsigned int tick;
*     unsigned short numberOfAlignedVotes;
*     unsigned short numberOfMisalignedVotes;
* } CurrentTickInfo;
 */
class QubicTickInfo {
    getTickDuration() {
        return this.tickDuration;
    }
    setTickDuration(tickDuration) {
        this.tickDuration = tickDuration;
    }
    getEpoch() {
        return this.epoch;
    }
    setEpoch(epoch) {
        this.epoch = epoch;
    }
    getTick() {
        return this.tick;
    }
    setTick(tick) {
        this.tick = tick;
    }
    getNumberOfAlignedVotes() {
        return this.numberOfAlignedVotes;
    }
    setNumberOfAlignedVotes(numberOfAlignedVotes) {
        this.numberOfAlignedVotes = numberOfAlignedVotes;
    }
    getNumberOfMisalignedVotes() {
        return this.numberOfMisalignedVotes;
    }
    setNumberOfMisalignedVotes(numberOfMisalignedVotes) {
        this.numberOfMisalignedVotes = numberOfMisalignedVotes;
    }
    getInitialTick() {
        return this.initialTick;
    }
    setInitialTick(tick) {
        this.initialTick = tick;
    }
    constructor() {
        this._internalPackageSize = 16;
        this.tickDuration = 0;
        this.epoch = 0;
        this.tick = 0;
        this.numberOfAlignedVotes = 0;
        this.numberOfMisalignedVotes = 0;
        this.initialTick = 0;
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
        this.setTickDuration(dataView.getInt16(0, true));
        offset += 2;
        this.setEpoch(dataView.getInt16(offset, true));
        offset += 2;
        this.setTick(dataView.getInt32(offset, true));
        offset += 4;
        this.setNumberOfAlignedVotes(dataView.getInt16(offset, true));
        offset += 2;
        this.setNumberOfMisalignedVotes(dataView.getInt16(offset, true));
        offset += 2;
        this.setInitialTick(dataView.getInt32(offset, true));
        return this;
    }
    getPackageData() {
        const builder = new QubicPackageBuilder_1.QubicPackageBuilder(this._internalPackageSize);
        builder.addShort(this.tickDuration);
        builder.addShort(this.epoch);
        builder.addInt(this.tick);
        builder.addShort(this.numberOfAlignedVotes);
        builder.addShort(this.numberOfMisalignedVotes);
        builder.addInt(this.initialTick);
        return builder.getData();
    }
}
exports.QubicTickInfo = QubicTickInfo;
