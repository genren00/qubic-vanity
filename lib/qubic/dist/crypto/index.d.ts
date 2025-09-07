export const KECCAK_STATE_LENGTH: 200;
export const SIGNATURE_LENGTH: 64;
export const PRIVATE_KEY_LENGTH: 32;
export const PUBLIC_KEY_LENGTH: 32;
export const DIGEST_LENGTH: 32;
export const NONCE_LENGTH: 32;
export const CHECKSUM_LENGTH: 3;
export default crypto;
/**
 * @namespace Crypto
 */
/**
 * A promise which always resolves to object with crypto functions.
 *
 * @constant {Promise<Crypto>}
 * @memberof module:qubic
 */
declare const crypto: Promise<any>;
