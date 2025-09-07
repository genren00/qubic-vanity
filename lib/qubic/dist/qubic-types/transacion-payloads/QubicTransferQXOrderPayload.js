"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QubicTransferQXOrderPayload = void 0;
const QubicPackageBuilder_1 = require("../../QubicPackageBuilder");
const DynamicPayload_1 = require("../DynamicPayload");
class QubicTransferQXOrderPayload {
    constructor(actionInput) {
        this._internalPackageSize = 56; // 32 + 8 + 8 + 8 -> 56
        this.qxOrderActionInput = actionInput;
    }
    getPackageSize() {
        return this._internalPackageSize;
    }
    getPackageData() {
        const builder = new QubicPackageBuilder_1.QubicPackageBuilder(this.getPackageSize());
        builder.add(this.qxOrderActionInput.issuer);
        builder.add(this.qxOrderActionInput.assetName);
        builder.add(this.qxOrderActionInput.price);
        builder.add(this.qxOrderActionInput.numberOfShares);
        return builder.getData();
    }
    getTransactionPayload() {
        const payload = new DynamicPayload_1.DynamicPayload(this.getPackageSize());
        payload.setPayload(this.getPackageData());
        return payload;
    }
    getTotalAmount() {
        return BigInt(this.qxOrderActionInput.price.getNumber() * this.qxOrderActionInput.numberOfShares.getNumber());
    }
}
exports.QubicTransferQXOrderPayload = QubicTransferQXOrderPayload;
