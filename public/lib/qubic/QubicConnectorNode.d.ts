import { ReceivedPackage } from "./qubic-communication/ReceivedPackage";
import { QubicEntityResponse } from "./qubic-communication/QubicEntityResponse";
import { PublicKey } from "./qubic-types/PublicKey";
export declare class QubicConnector {
    private PORT;
    private socket;
    private peerConnected;
    private connectedPeerAddress;
    private buffer;
    private bufferWritePosition;
    private bufferReadPosition;
    private currentTick;
    private timer;
    onReady?: () => void;
    onPeerConnected?: () => void;
    onPeerDisconnected?: () => void;
    onBalance?: (entity: QubicEntityResponse) => void;
    onTick?: (tick: number) => void;
    onPackageReceived?: (packet: ReceivedPackage) => void;
    onSocketError?: (packet: any) => void;
    constructor();
    private onPeerConnect;
    private toBase64;
    private connectPeer;
    private disconnectPeer;
    private reconnectPeer;
    private writeBuffer;
    private readFromBuffer;
    private setReadPosition;
    private processBuffer;
    private processPackage;
    private requestTickInfo;
    requestBalance(pkey: PublicKey): void;
    GetPrivatePublicKey(seed: any): Promise<{
        privateKey: any;
        publicKey: any;
    }>;
    private initialize;
    /**
     * connects to a specific peer
     * @param ip node/peer ip address
     */
    connect(ip: string): void;
    sendPackage(data: Uint8Array): boolean;
    private sendTcpPackage;
    /**
     * starts the connection
     */
    start(): void;
    /**
     * stops the web bridge ws connection
     */
    stop(): void;
    destroy(): void;
}
