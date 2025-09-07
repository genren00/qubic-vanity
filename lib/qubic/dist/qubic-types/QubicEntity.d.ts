import { IQubicBuildPackage } from "./IQubicBuildPackage";
import { Long } from "./Long";
import { PublicKey } from "./PublicKey";
/**
 * typedef struct
 * {
 *     unsigned char publicKey[32];
 *     long long incomingAmount, outgoingAmount;
 *     unsigned int numberOfIncomingTransfers, numberOfOutgoingTransfers;
 *     unsigned int latestIncomingTransferTick, latestOutgoingTransferTick;
 * } Entity;
 */
export declare class QubicEntity implements IQubicBuildPackage {
    private _internalPackageSize;
    private publicKey;
    private incomingAmount;
    private outgoingAmount;
    private numberOfIncomingTransfers;
    private numberOfOutgoingTransfers;
    private latestIncomingTransferTick;
    private latestOutgoingTransferTick;
    getPublicKey(): PublicKey;
    setPublicKey(publicKey: PublicKey): void;
    getIncomingAmount(): Long;
    setIncomingAmount(incomingAcmount: Long): void;
    getOutgoingAmount(): Long;
    setOutgoingAmount(outgoingAmount: Long): void;
    getNumberOfIncomingTransfers(): number;
    setNumberOfIncomingTransfers(numberOfIncomingTransfers: number): void;
    getNumberOfOutgoingTransfers(): number;
    setNumberOfOutgoingTransfers(numberOfOutgoingTransfers: number): void;
    getLatestIncomingTransferTick(): number;
    setLatestIncomingTransferTick(latestIncomingTransferTick: number): void;
    getLatestOutgoingTransferTick(): number;
    setLatestOutgoingTransferTick(latestOutgoingTransferTick: number): void;
    constructor();
    getBalance(): number;
    getPackageSize(): number;
    parse(data: Uint8Array): QubicEntity | undefined;
    getPackageData(): Uint8Array;
}
