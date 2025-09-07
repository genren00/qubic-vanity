import { IQubicBuildPackage } from "./IQubicBuildPackage";
import { Signature } from "./Signature";
/**
 * typedef struct
{
    unsigned short computorIndex;
    unsigned short epoch;
    unsigned int tick;

    unsigned short millisecond;
    unsigned char second;
    unsigned char minute;
    unsigned char hour;
    unsigned char day;
    unsigned char month;
    unsigned char year;

    union
    {
        struct
        {
            unsigned char uriSize;
            unsigned char uri[255];
        } proposal;
        struct
        {
            unsigned char zero;
            unsigned char votes[(NUMBER_OF_COMPUTORS * 3 + 7) / 8];
            unsigned char quasiRandomNumber;
        } ballot;
    } varStruct;

    unsigned char timelock[32];
    unsigned char transactionDigests[NUMBER_OF_TRANSACTIONS_PER_TICK][32];
    long long contractFees[MAX_NUMBER_OF_CONTRACTS];

    unsigned char signature[SIGNATURE_SIZE];
} TickData;
 */
export declare class QubicTickData implements IQubicBuildPackage {
    private _internalPackageSize;
    private _unionDataView;
    get unionDataView(): DataView;
    set unionDataView(value: DataView);
    private computorIndex;
    private epoch;
    private tick;
    private millisecond;
    private second;
    private minute;
    private hour;
    private day;
    private month;
    private year;
    private unionData;
    private timeLock;
    private transactionDigests;
    private contractFees;
    private signature;
    getSignature(): Signature;
    setSignature(signature: Signature): void;
    getComputorIndex(): number;
    setComputorIndex(computorIndex: number): void;
    getEpoch(): number;
    setEpoch(epoch: number): void;
    getTick(): number;
    setTick(tick: number): void;
    getMillisecond(): number;
    setMillisecond(millisecond: number): void;
    getSecond(): number;
    setSecond(second: number): void;
    getMinute(): number;
    setMinute(minute: number): void;
    getHour(): number;
    setHour(hour: number): void;
    getDay(): number;
    setDay(day: number): void;
    getMonth(): number;
    setMonth(month: number): void;
    getYear(): number;
    setYear(year: number): void;
    getUnionData(): Uint8Array;
    setUnionData(unionData: Uint8Array): void;
    getTimeLock(): Uint8Array;
    setTimeLock(timeLock: Uint8Array): void;
    setTransactionDigests(transactionDigests: Uint8Array): void;
    getContractFees(): bigint[];
    setContractFees(contractFees: bigint[]): void;
    getProposalUriSize(): number;
    setProposalUriSize(size: number): void;
    getProposalUri(): string;
    setProposalUri(uri: string): void;
    constructor();
    getPackageSize(): number;
    parse(data: Uint8Array): QubicTickData | undefined;
    getPackageData(): Uint8Array;
}
