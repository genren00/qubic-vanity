import { RequestResponseHeader } from "./RequestResponseHeader";
export declare class ReceivedPackage {
    ipAddress: string;
    header: RequestResponseHeader;
    payLoad: Uint8Array;
}
