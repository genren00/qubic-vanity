import { IQubicBuildPackage } from "../qubic-types/IQubicBuildPackage";
import { PublicKey } from "../qubic-types/PublicKey";
/**
 *
 * Generic Request Object to receive Qubic Assets
 *
 * struct RequestIssuedAssets, RequestOwnedAssets, RequestPossessedAssets
* {
*     m256i publicKey;
*
*     enum {
*         type = XX,
*     };
* };
 */
export declare class QubicAssetRequest implements IQubicBuildPackage {
    private _internalPackageSize;
    private publicKey;
    getPublicKey(): PublicKey;
    setPublicKey(publicKey: PublicKey): void;
    constructor(publicKey: PublicKey | undefined);
    getPackageSize(): number;
    parse(data: Uint8Array): QubicAssetRequest | undefined;
    getPackageData(): Uint8Array;
}
