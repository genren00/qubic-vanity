import { IQubicBuildPackage } from "./IQubicBuildPackage";
export declare class PublicKey implements IQubicBuildPackage {
    private bytes;
    private identity;
    constructor(identity?: string | Uint8Array | undefined);
    setIdentityFromString(id: string): void;
    setIdentity(bytes: Uint8Array): Promise<void>;
    getIdentity(): Uint8Array;
    getIdentityAsSring(): string | undefined;
    getPackageSize(): number;
    getPackageData(): Uint8Array;
    equals(compare: PublicKey): boolean;
    verifyIdentity(): Promise<boolean>;
}
