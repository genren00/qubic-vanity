import { IQubicBuildPackage } from "./IQubicBuildPackage";
/**
 * typedef struct
* {
*     unsigned short tickDuration;
*     unsigned short epoch;
*     unsigned int tick;
*     unsigned short numberOfAlignedVotes;
*     unsigned short numberOfMisalignedVotes;
* } CurrentTickInfo;
 */
export declare class QubicTickInfo implements IQubicBuildPackage {
    private _internalPackageSize;
    private tickDuration;
    private epoch;
    private tick;
    private numberOfAlignedVotes;
    private numberOfMisalignedVotes;
    private initialTick;
    getTickDuration(): number;
    setTickDuration(tickDuration: number): void;
    getEpoch(): number;
    setEpoch(epoch: number): void;
    getTick(): number;
    setTick(tick: number): void;
    getNumberOfAlignedVotes(): number;
    setNumberOfAlignedVotes(numberOfAlignedVotes: number): void;
    getNumberOfMisalignedVotes(): number;
    setNumberOfMisalignedVotes(numberOfMisalignedVotes: number): void;
    getInitialTick(): number;
    setInitialTick(tick: number): void;
    constructor();
    getPackageSize(): number;
    parse(data: Uint8Array): QubicTickInfo | undefined;
    getPackageData(): Uint8Array;
}
