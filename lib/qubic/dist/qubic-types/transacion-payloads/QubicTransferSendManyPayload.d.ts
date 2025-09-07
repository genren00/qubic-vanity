import { DynamicPayload } from "../DynamicPayload";
import { IQubicBuildPackage } from "../IQubicBuildPackage";
import { Long } from "../Long";
import { PublicKey } from "../PublicKey";
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
export declare class QubicTransferSendManyPayload implements IQubicBuildPackage {
    private _internalPackageSize;
    private sendManyTransfers;
    constructor();
    addTransfer(transfer: SendManyTransfer): QubicTransferSendManyPayload;
    addTranfers(transfers: SendManyTransfer[]): QubicTransferSendManyPayload;
    /**
     *
     * @returns the transfers for this send many request
     */
    getTransfers(): SendManyTransfer[];
    /**
     * the acumulated amount of all transfers
     * @returns
     *
     */
    getTotalAmount(): bigint;
    getPackageSize(): number;
    getPackageData(): Uint8Array;
    getTransactionPayload(): DynamicPayload;
    /**
     * parses raw binary package to js object
     * @param data raw send many input (payload)
     * @returns QubicTransferSendManyPayload
     */
    parse(data: Uint8Array): Promise<QubicTransferSendManyPayload>;
}
/**
 * interface for one send many transer
 */
export interface SendManyTransfer {
    destId: PublicKey;
    amount: Long;
}
