"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QubicTransferSendManyPayload = void 0;
const QubicDefinitions_1 = require("../../QubicDefinitions");
const QubicPackageBuilder_1 = require("../../QubicPackageBuilder");
const qubicHelper_1 = require("../../qubicHelper");
const DynamicPayload_1 = require("../DynamicPayload");
const Long_1 = require("../Long");
const PublicKey_1 = require("../PublicKey");
/**
 *
 * Transaction Payload to use Qutil/SendMany SC
 *
 * struct SendToManyV1_input {
 *   uint8_t addresses[25][32];
 *   int64_t amounts[25];
 * };
 *
 *
 *
 */
class QubicTransferSendManyPayload {
    constructor() {
        this._internalPackageSize = 1000; /* 25 * 32  + 25 * 8 */
        // max 25 transfers allowed
        this.sendManyTransfers = [];
    }
    addTransfer(transfer) {
        if (this.sendManyTransfers.length < 25) {
            this.sendManyTransfers.push(transfer);
        }
        else {
            throw new Error("max 25 send many transfers allowed");
        }
        return this;
    }
    addTranfers(transfers) {
        if (this.sendManyTransfers.length + transfers.length > 25) {
            throw new Error("max 25 send many transfers allowed");
        }
        transfers.forEach((transfer) => {
            this.addTransfer(transfer);
        });
        return this;
    }
    /**
     *
     * @returns the transfers for this send many request
     */
    getTransfers() {
        return this.sendManyTransfers;
    }
    /**
     * the acumulated amount of all transfers
     * @returns
     *
     */
    getTotalAmount() {
        return this.sendManyTransfers.reduce((a, b) => (a += b && b.amount ? b.amount.getNumber() : BigInt(0)), BigInt(0));
    }
    getPackageSize() {
        return this._internalPackageSize;
    }
    getPackageData() {
        const builder = new QubicPackageBuilder_1.QubicPackageBuilder(this.getPackageSize());
        for (let i = 0; i < 25; i++) {
            if (this.sendManyTransfers.length > i &&
                this.sendManyTransfers[i].amount.getNumber() > 0) {
                builder.add(this.sendManyTransfers[i].destId);
            }
            else {
                builder.add(new PublicKey_1.PublicKey(QubicDefinitions_1.QubicDefinitions.EMPTY_ADDRESS)); // add empty address to have 0 in byte
            }
        }
        for (let i = 0; i < 25; i++) {
            if (this.sendManyTransfers.length > i &&
                this.sendManyTransfers[i].amount.getNumber() > 0) {
                const amount = this.sendManyTransfers[i].amount;
                if (typeof amount === "number") {
                    builder.add(new Long_1.Long(amount));
                }
                else {
                    builder.add(amount);
                }
            }
            else {
                builder.add(new Long_1.Long(0));
            }
        }
        return builder.getData();
    }
    getTransactionPayload() {
        const payload = new DynamicPayload_1.DynamicPayload(this.getPackageSize());
        payload.setPayload(this.getPackageData());
        return payload;
    }
    /**
     * parses raw binary package to js object
     * @param data raw send many input (payload)
     * @returns QubicTransferSendManyPayload
     */
    async parse(data) {
        if (data.length !== this._internalPackageSize) {
            console.error("INVALID PACKAGE SIZE");
            return undefined;
        }
        const helper = new qubicHelper_1.QubicHelper();
        const sendManyTransfers = [];
        // a send many tx can have maximum 25 recipients
        for (let i = 0; i < 25; i++) {
            // get the amount for the transfer
            const amount = new Long_1.Long(data.slice(800 + i * 8, 800 + i * 8 + 8));
            // only add transfer to output array if amount > 0; 0 or lower means, no transfer
            if (amount.getNumber() > 0) {
                const dest = data.slice(32 * i, 32 * i + 32);
                this.sendManyTransfers.push({
                    amount: amount,
                    destId: new PublicKey_1.PublicKey(await helper.getIdentity(dest)),
                });
            }
        }
        this.addTranfers(sendManyTransfers);
        return this;
    }
}
exports.QubicTransferSendManyPayload = QubicTransferSendManyPayload;
