import { DynamicPayload } from "./DynamicPayload";
import { IQubicBuildPackage } from "./IQubicBuildPackage";
import { Long } from "./Long";
import { PublicKey } from "./PublicKey";
import { Signature } from "./Signature";
/**
 * C+S Struct
 * typedef struct
 * {
 *  unsigned char sourcePublicKey[32];
 *  unsigned char destinationPublicKey[32];
 *  long long amount;
 *  unsigned int tick;
 *  unsigned short inputType;
 *  unsigned short inputSize;
 * } Transaction;
 */
export declare class QubicTransaction implements IQubicBuildPackage {
    private builtData;
    digest: Uint8Array | undefined;
    id: string | undefined;
    sourcePublicKey: PublicKey;
    destinationPublicKey: PublicKey;
    amount: Long;
    tick: number;
    inputType: number;
    inputSize: number;
    payload: IQubicBuildPackage;
    signature: Signature;
    setSourcePublicKey(p: PublicKey | string): QubicTransaction;
    setDestinationPublicKey(p: PublicKey | string): QubicTransaction;
    setAmount(p: Long | number): QubicTransaction;
    setTick(p: number): QubicTransaction;
    setInputType(p: number): QubicTransaction;
    setInputSize(p: number): QubicTransaction;
    setPayload(payload: DynamicPayload | IQubicBuildPackage): QubicTransaction;
    getPayload(): IQubicBuildPackage;
    private _internalSize;
    getPackageSize(): number;
    getId(): string;
    /**
     * builds the transaction to be sent
     * includes signing with seed
     *
     * @param seed the seed to be used to sign this transacion. the seed should be the same as the sourcePublicKey
     * @returns a complete transaction package
     */
    build(seed: string): Promise<Uint8Array>;
    /**
     * The result of build() must be passed through this function,
     * as the `broadcast-transaction` endpoint expects the transaction to be Base64 encoded.
     */
    encodeTransactionToBase64(transaction: Uint8Array): string;
    getPackageData(): Uint8Array;
}
