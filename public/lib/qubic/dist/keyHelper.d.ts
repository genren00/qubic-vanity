export declare class KeyHelper {
    private SEED_ALPHABET;
    private PRIVATE_KEY_LENGTH;
    private PUBLIC_KEY_LENGTH;
    private CHECKSUM_LENGTH;
    createPublicKey(privateKey: Uint8Array, schnorrq: any, K12: any): Uint8Array;
    private seedToBytes;
    privateKey(seed: string, index: number, K12: any): Uint8Array;
    static getIdentityBytes: (identity: string) => Uint8Array;
}
