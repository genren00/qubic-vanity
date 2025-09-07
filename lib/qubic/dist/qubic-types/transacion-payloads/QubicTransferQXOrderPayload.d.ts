/**
 *
 * Transaction Payload to create bid / ask orders on QX SC
 *
 * struct qxOrderAction_input {
 *     uint8_t issuer[32];
 *     uint64_t assetName;
 *     long long price;
 *     long long numberOfShares;
 * }
 *
 */
import { IQubicBuildPackage } from "../IQubicBuildPackage";
import { PublicKey } from "../PublicKey";
import { Long } from "../Long";
import { DynamicPayload } from "../DynamicPayload";
export declare class QubicTransferQXOrderPayload implements IQubicBuildPackage {
    private _internalPackageSize;
    private qxOrderActionInput;
    constructor(actionInput: QXOrderActionInput);
    getPackageSize(): number;
    getPackageData(): Uint8Array;
    getTransactionPayload(): DynamicPayload;
    getTotalAmount(): bigint;
}
export interface QXOrderActionInput {
    issuer: PublicKey;
    assetName: Long;
    price: Long;
    numberOfShares: Long;
}
