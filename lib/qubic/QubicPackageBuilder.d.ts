import { IQubicBuildPackage } from "./qubic-types/IQubicBuildPackage";
export declare class QubicPackageBuilder {
    private packet;
    private offset;
    constructor(size: number);
    getData(): Uint8Array;
    sign(seed: string): Promise<Uint8Array>;
    signAndDigest(seed: string): Promise<{
        signedData: Uint8Array;
        digest: Uint8Array;
        signature: Uint8Array;
    }>;
    add(q: IQubicBuildPackage): QubicPackageBuilder;
    adduint8Array(q: Uint8Array): QubicPackageBuilder;
    addRaw(q: Uint8Array): QubicPackageBuilder;
    addShort(q: number): QubicPackageBuilder;
    addInt(q: number): QubicPackageBuilder;
    private FromInt;
    private FromShort;
}
