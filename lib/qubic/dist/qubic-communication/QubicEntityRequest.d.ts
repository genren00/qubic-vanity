import { IQubicBuildPackage } from "../qubic-types/IQubicBuildPackage";
import { PublicKey } from "../qubic-types/PublicKey";
/**
 * typedef struct
* {
*     unsigned char publicKey[32];
* } RequestedEntity;
 */
export declare class QubicEntityRequest implements IQubicBuildPackage {
    private _internalPackageSize;
    private publicKey;
    getPublicKey(): PublicKey;
    setPublicKey(publicKey: PublicKey): void;
    constructor(publicKey: PublicKey | undefined);
    getPackageSize(): number;
    parse(data: Uint8Array): QubicEntityRequest | undefined;
    getPackageData(): Uint8Array;
}
