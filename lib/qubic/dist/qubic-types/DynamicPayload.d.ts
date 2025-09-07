export declare class DynamicPayload {
    private bytes;
    private filledSize;
    private maxSize;
    /**
     * Create a dynamic payload
     * the maxSize should be set to the max expected size for this paload.
     */
    constructor(maxSize: number);
    setPayload(data: Uint8Array): void;
    getPackageData(): Uint8Array;
    getPackageSize(): number;
}
