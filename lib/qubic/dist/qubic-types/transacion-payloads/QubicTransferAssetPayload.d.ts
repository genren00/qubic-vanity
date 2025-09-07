import { DynamicPayload } from "../DynamicPayload";
import { IQubicBuildPackage } from "../IQubicBuildPackage";
import { Long } from "../Long";
import { PublicKey } from "../PublicKey";
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
export declare class QubicTransferAssetPayload implements IQubicBuildPackage {
    private _internalPackageSize;
    private issuer;
    private newOwnerAndPossessor;
    private assetName;
    private numberOfUnits;
    constructor();
    setIssuer(issuer: PublicKey | string): QubicTransferAssetPayload;
    setNewOwnerAndPossessor(newOwnerAndPossessor: PublicKey | string): QubicTransferAssetPayload;
    setAssetName(assetName: Uint8Array | string): QubicTransferAssetPayload;
    getAssetName(): Uint8Array;
    getIssuer(): PublicKey;
    getNewOwnerAndPossessor(): PublicKey;
    getNumberOfUnits(): Long;
    setNumberOfUnits(numberOfUnits: number | Long): QubicTransferAssetPayload;
    getPackageSize(): number;
    getPackageData(): Uint8Array;
    getTransactionPayload(): DynamicPayload;
    parse(data: Uint8Array): Promise<QubicTransferAssetPayload>;
}
