import { IQubicBuildPackage } from "./IQubicBuildPackage";
export declare class Signature implements IQubicBuildPackage {
    private bytes;
    constructor(data?: Uint8Array | undefined);
    setSignature(bytes: Uint8Array): void;
    getPackageData(): Uint8Array;
    getPackageSize(): number;
}
