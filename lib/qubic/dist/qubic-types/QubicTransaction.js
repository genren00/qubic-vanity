"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QubicTransaction = void 0;
const qubicHelper_1 = require("../qubicHelper");
const DynamicPayload_1 = require("./DynamicPayload");
const Long_1 = require("./Long");
const QubicPackageBuilder_1 = require("../QubicPackageBuilder");
const PublicKey_1 = require("./PublicKey");
const QubicDefinitions_1 = require("../QubicDefinitions");
const Signature_1 = require("./Signature");
/**
 * C+S Struct
 * typedef struct
 * {
 *  unsigned char sourcePublicKey[32];
 *  unsigned char destinationPublicKey[32];
 *  long long amount;
 *  unsigned int tick;
 *  unsigned short inputType;
 *  unsigned short inputSize;
 * } Transaction;
 */
class QubicTransaction {
    constructor() {
        // todo: create getter/setter
        this.sourcePublicKey = new PublicKey_1.PublicKey();
        this.destinationPublicKey = new PublicKey_1.PublicKey();
        this.amount = new Long_1.Long();
        this.tick = 0;
        this.inputType = 0;
        this.inputSize = 0;
        this.payload = new DynamicPayload_1.DynamicPayload(QubicDefinitions_1.QubicDefinitions.MAX_TRANSACTION_SIZE);
        this.signature = new Signature_1.Signature();
    }
    setSourcePublicKey(p) {
        if (p instanceof PublicKey_1.PublicKey)
            this.sourcePublicKey = p;
        else
            this.sourcePublicKey = new PublicKey_1.PublicKey(p);
        return this;
    }
    setDestinationPublicKey(p) {
        if (p instanceof PublicKey_1.PublicKey)
            this.destinationPublicKey = p;
        else
            this.destinationPublicKey = new PublicKey_1.PublicKey(p);
        return this;
    }
    setAmount(p) {
        if (p instanceof Long_1.Long)
            this.amount = p;
        else
            this.amount = new Long_1.Long(p);
        return this;
    }
    setTick(p) {
        this.tick = p;
        return this;
    }
    setInputType(p) {
        this.inputType = p;
        return this;
    }
    setInputSize(p) {
        this.inputSize = p;
        return this;
    }
    setPayload(payload) {
        this.payload = payload;
        this.inputSize = this.payload.getPackageSize();
        return this;
    }
    getPayload() {
        return this.payload;
    }
    _internalSize() {
        return this.sourcePublicKey.getPackageSize()
            + this.destinationPublicKey.getPackageSize()
            + this.amount.getPackageSize()
            + 4 // tick
            + 2 // inputType
            + 2 // inputSize
            + this.inputSize
            + this.signature.getPackageSize();
    }
    getPackageSize() {
        return this._internalSize();
    }
    getId() {
        if (!this.id) {
            console.error("CALL build() BEFORE USING getId() METHOD");
            return "";
        }
        return this.id;
    }
    /**
     * builds the transaction to be sent
     * includes signing with seed
     *
     * @param seed the seed to be used to sign this transacion. the seed should be the same as the sourcePublicKey
     * @returns a complete transaction package
     */
    async build(seed) {
        this.builtData = undefined;
        var builder = new QubicPackageBuilder_1.QubicPackageBuilder(this._internalSize());
        builder.add(this.sourcePublicKey);
        builder.add(this.destinationPublicKey);
        builder.add(this.amount);
        builder.addInt(this.tick);
        builder.addShort(this.inputType);
        builder.addShort(this.inputSize);
        builder.add(this.payload);
        const { signedData, digest, signature } = await builder.signAndDigest(seed);
        this.builtData = signedData;
        this.digest = digest;
        this.signature = new Signature_1.Signature(signature);
        this.id = await new qubicHelper_1.QubicHelper().getHumanReadableBytes(digest);
        return signedData;
    }
    /**
     * The result of build() must be passed through this function,
     * as the `broadcast-transaction` endpoint expects the transaction to be Base64 encoded.
     */
    encodeTransactionToBase64(transaction) {
        const byteArray = new Uint8Array(transaction);
        const str = String.fromCharCode.apply(null, byteArray);
        return btoa(str);
    }
    getPackageData() {
        if (!this.builtData) {
            console.error("CALL build() BEFORE USING getPackageData() METHOD");
        }
        return this.builtData ?? new Uint8Array();
    }
}
exports.QubicTransaction = QubicTransaction;
