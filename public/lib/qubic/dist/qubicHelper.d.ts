/**
 * this class contains a lot of legacy code and should be refactored
 */
export declare class QubicHelper {
    private SEED_ALPHABET;
    private SHIFTED_HEX_CHARS;
    private PRIVATE_KEY_LENGTH;
    private PUBLIC_KEY_LENGTH;
    private SEED_IN_LOWERCASE_LATIN_LENGTH;
    private CHECKSUM_LENGTH;
    /**
     *
     * Creates a complete ID Package based on the provided seed
     *
     * @param seed
     * @returns
     */
    createIdPackage(seed: string): Promise<{
        publicKey: Uint8Array;
        privateKey: Uint8Array;
        publicId: string;
    }>;
    /**
     * creates the checksum for a given key
     *
     * @param publicKey
     * @returns
     */
    private getCheckSum;
    /**
     *
     * Creates the human readable public key from the publickey
     *
     * @param publicKey
     * @param lowerCase
     * @returns
     */
    getIdentity(publicKey: Uint8Array, lowerCase?: boolean): Promise<string>;
    getHumanReadableBytes(publicKey: Uint8Array): Promise<string>;
    seedToBytes(seed: string): Uint8Array;
    privateKey(seed: string, index: number, K12: any): Uint8Array;
    getIdentityBytes: (identity: string) => Uint8Array;
    /**
     * Verifies if a given identity is valid
     * @param identity
     */
    verifyIdentity(identity: string): Promise<boolean>;
    private createPublicKey;
    private REQUEST_RESPONSE_HEADER_SIZE;
    private TRANSACTION_SIZE;
    private IPO_TRANSACTION_SIZE;
    private SET_PROPOSAL_AND_BALLOT_REQUEST_SIZE;
    private TRANSACTION_INPUT_SIZE_OFFSET;
    private TRANSACTION_INPUT_SIZE_LENGTH;
    private SIGNATURE_LENGTH;
    private DIGEST_LENGTH;
    private SPECIAL_COMMAND_SHUT_DOWN;
    private SPECIAL_COMMAND_GET_PROPOSAL_AND_BALLOT_REQUEST;
    private SPECIAL_COMMAND_GET_PROPOSAL_AND_BALLOT_RESPONSE;
    private SPECIAL_COMMAND_SET_PROPOSAL_AND_BALLOT_REQUEST;
    private SPECIAL_COMMAND_SET_PROPOSAL_AND_BALLOT_RESPONSE;
    private PROCESS_SPECIAL_COMMAND;
    createIpo(sourceSeed: string, contractIndex: number, price: number, quantity: number, tick: number): Promise<Uint8Array>;
    createTransaction(sourceSeed: string, destPublicId: string, amount: number, tick: number): Promise<Uint8Array>;
    /**
     *
     * implementation aligned with qubic-cli
     *
     * @param type
     * @returns
     */
    private getIncreasingNonceAndCommandType;
    createProposal(protocol: number, computorIndex: number, operatorSeed: string, url: string): Promise<Uint8Array>;
    private VotesToByteArray;
    createBallotRequests(protocol: number, operatorSeed: string, computorIndices: number[], votes: number[]): Promise<Uint8Array[]>;
    private downloadBlob;
}
