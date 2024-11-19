import { IQubicBuildPackage } from "./IQubicBuildPackage";
export declare class Long implements IQubicBuildPackage {
    private value;
    constructor(initialValue?: number | bigint | Uint8Array | undefined);
    setNumber(n: number | bigint): void;
    getNumber(): bigint;
    getPackageSize(): number;
    getPackageData(): Uint8Array;
}
