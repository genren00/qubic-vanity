"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QubicTickData = void 0;
const QubicDefinitions_1 = require("../QubicDefinitions");
const Signature_1 = require("./Signature");
/**
 * typedef struct
{
    unsigned short computorIndex;
    unsigned short epoch;
    unsigned int tick;

    unsigned short millisecond;
    unsigned char second;
    unsigned char minute;
    unsigned char hour;
    unsigned char day;
    unsigned char month;
    unsigned char year;

    union
    {
        struct
        {
            unsigned char uriSize;
            unsigned char uri[255];
        } proposal;
        struct
        {
            unsigned char zero;
            unsigned char votes[(NUMBER_OF_COMPUTORS * 3 + 7) / 8];
            unsigned char quasiRandomNumber;
        } ballot;
    } varStruct;

    unsigned char timelock[32];
    unsigned char transactionDigests[NUMBER_OF_TRANSACTIONS_PER_TICK][32];
    long long contractFees[MAX_NUMBER_OF_CONTRACTS];

    unsigned char signature[SIGNATURE_SIZE];
} TickData;
 */
class QubicTickData {
    get unionDataView() {
        if (!this._unionDataView)
            this._unionDataView = new DataView(this.unionData.buffer);
        return this._unionDataView;
    }
    set unionDataView(value) {
        this._unionDataView = value;
    }
    getSignature() {
        return this.signature;
    }
    setSignature(signature) {
        this.signature = signature;
    }
    getComputorIndex() {
        return this.computorIndex;
    }
    setComputorIndex(computorIndex) {
        this.computorIndex = computorIndex;
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
    getMillisecond() {
        return this.millisecond;
    }
    setMillisecond(millisecond) {
        this.millisecond = millisecond;
    }
    getSecond() {
        return this.second;
    }
    setSecond(second) {
        this.second = second;
    }
    getMinute() {
        return this.minute;
    }
    setMinute(minute) {
        this.minute = minute;
    }
    getHour() {
        return this.hour;
    }
    setHour(hour) {
        this.hour = hour;
    }
    getDay() {
        return this.day;
    }
    setDay(day) {
        this.day = day;
    }
    getMonth() {
        return this.month;
    }
    setMonth(month) {
        this.month = month;
    }
    getYear() {
        return this.year;
    }
    setYear(year) {
        this.year = year;
    }
    getUnionData() {
        return this.unionData;
    }
    setUnionData(unionData) {
        this.unionData = unionData;
    }
    getTimeLock() {
        return this.timeLock;
    }
    setTimeLock(timeLock) {
        this.timeLock = timeLock;
    }
    // todo: implement
    // public getTransactionDigests(): Uint8Array[][] {
    //     return this.transactionDigests;
    // }
    setTransactionDigests(transactionDigests /* jagged array 1024x32 */) {
        this.transactionDigests = transactionDigests;
    }
    getContractFees() {
        return this.contractFees;
    }
    setContractFees(contractFees) {
        this.contractFees = contractFees;
    }
    /* union data types */
    getProposalUriSize() {
        return this.unionData[0];
    }
    setProposalUriSize(size) {
        this.unionData[0] = size;
    }
    getProposalUri() {
        return new TextDecoder().decode(this.unionData.slice(1, this.getProposalUriSize()));
    }
    setProposalUri(uri) {
        if (uri.length > 255) {
            console.error("URI SIZE MUST BE MAX 255");
            throw "URI SIZE MUST BE MAX 255";
        }
        const bytes = new TextEncoder().encode(uri);
        this.unionData.set(bytes, 1);
        this.setProposalUriSize(uri.length);
    }
    constructor() {
        this._internalPackageSize = 41328;
    }
    getPackageSize() {
        return this._internalPackageSize;
    }
    parse(data) {
        if (data.length !== this._internalPackageSize) {
            console.error("INVALID PACKAGE SIZE");
            return undefined;
        }
        const dataView = new DataView(data.buffer);
        let offset = 0;
        this.setComputorIndex(dataView.getUint16(offset, true));
        offset += 2;
        this.setEpoch(dataView.getUint16(offset, true));
        offset += 2;
        this.setTick(dataView.getUint32(offset, true));
        offset += 4;
        this.setMillisecond(dataView.getUint16(offset, true));
        offset += 2;
        this.setSecond(data[offset++]);
        this.setMinute(data[offset++]);
        this.setHour(data[offset++]);
        this.setDay(data[offset++]);
        this.setMonth(data[offset++]);
        this.setYear(data[offset++]);
        this.setUnionData(data.slice(offset, 256));
        offset += 256;
        this.setTimeLock(data.slice(offset, 32));
        offset += 32;
        this.setTransactionDigests(data.slice(offset, QubicDefinitions_1.QubicDefinitions.NUMBER_OF_TRANSACTIONS_PER_TICK * QubicDefinitions_1.QubicDefinitions.DIGEST_LENGTH));
        offset += QubicDefinitions_1.QubicDefinitions.NUMBER_OF_TRANSACTIONS_PER_TICK * QubicDefinitions_1.QubicDefinitions.DIGEST_LENGTH;
        const contractFees = [];
        for (let i = 0; i < QubicDefinitions_1.QubicDefinitions.MAX_NUMBER_OF_CONTRACTS; i++) {
            contractFees.push(dataView.getBigInt64(offset, true));
            offset += 8;
        }
        this.setContractFees(contractFees);
        this.setSignature(new Signature_1.Signature(data.slice(offset, QubicDefinitions_1.QubicDefinitions.SIGNATURE_LENGTH)));
        offset += QubicDefinitions_1.QubicDefinitions.SIGNATURE_LENGTH;
        return this;
    }
    getPackageData() {
        // todo: implement
        return new Uint8Array();
    }
}
exports.QubicTickData = QubicTickData;
