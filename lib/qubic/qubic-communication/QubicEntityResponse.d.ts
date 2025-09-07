import { IQubicBuildPackage } from "../qubic-types/IQubicBuildPackage";
import { QubicEntity } from "../qubic-types/QubicEntity";
/**
 * typedef struct
 * {
 *     unsigned char publicKey[32];
 *     long long incomingAmount, outgoingAmount;
 *     unsigned int numberOfIncomingTransfers, numberOfOutgoingTransfers;
 *     unsigned int latestIncomingTransferTick, latestOutgoingTransferTick;
 *     unsigned int tick;
 *     int spectrumIndex;
 *     unsigned char siblings[SPECTRUM_DEPTH][32];
 * } RespondedEntity;
 */
export declare class QubicEntityResponse implements IQubicBuildPackage {
    private _internalPackageSize;
    private entity;
    private tick;
    private spectrumIndex;
    private siblings;
    getEntity(): QubicEntity;
    setEntity(entity: QubicEntity): void;
    getTick(): number;
    setTick(tick: number): void;
    getSpectrumIndex(): number;
    setSpectrumIndex(spectrumIndex: number): void;
    getSiblings(): Uint8Array;
    setSiblings(siblings: Uint8Array): void;
    constructor();
    getPackageSize(): number;
    parse(data: Uint8Array): QubicEntityResponse | undefined;
    getPackageData(): Uint8Array;
}
