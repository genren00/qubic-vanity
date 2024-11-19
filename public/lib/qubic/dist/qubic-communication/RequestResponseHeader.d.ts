import { IQubicBuildPackage } from "../qubic-types/IQubicBuildPackage";
export declare class RequestResponseHeader implements IQubicBuildPackage {
    private size;
    private type;
    private dejaVu;
    /**
     *
     * @param packageType type of the package to send (use QubicPackagetypes statics)
     * @param payloadSize size of the qubic package (header size is added automatically)
     */
    constructor(packageType?: number | undefined, payloadSize?: number | undefined);
    setType(t: number): RequestResponseHeader;
    getType(): number;
    setSize(t: number): RequestResponseHeader;
    getSize(): number;
    setDejaVu(t: number): RequestResponseHeader;
    getDejaVu(): number;
    randomizeDejaVu(): void;
    getPackageSize(): number;
    parse(data: Uint8Array): RequestResponseHeader | undefined;
    getPackageData(): Uint8Array;
}
