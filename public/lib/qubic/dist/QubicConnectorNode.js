"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QubicConnector = void 0;
const QubicPackageType_1 = require("./qubic-communication/QubicPackageType");
const ReceivedPackage_1 = require("./qubic-communication/ReceivedPackage");
const RequestResponseHeader_1 = require("./qubic-communication/RequestResponseHeader");
const net = __importStar(require("net"));
const QubicTickInfo_1 = require("./qubic-types/QubicTickInfo");
const QubicEntityResponse_1 = require("./qubic-communication/QubicEntityResponse");
const QubicPackageBuilder_1 = require("./QubicPackageBuilder");
const QubicEntityRequest_1 = require("./qubic-communication/QubicEntityRequest");
const crypto_1 = __importDefault(require("./crypto"));
const keyHelper_1 = require("./keyHelper");
class QubicConnector {
    constructor() {
        this.PORT = 21841;
        this.peerConnected = false;
        this.buffer = new Uint8Array(4 * 1024 * 1024);
        this.bufferWritePosition = 0;
        this.bufferReadPosition = 0;
        this.currentTick = 0;
        this.socket = new net.Socket();
        if (this.socket) {
            this.socket.on('data', (d) => {
                this.writeBuffer(d);
            });
            this.socket.on('close', (d) => {
                if (this.onPeerDisconnected)
                    this.onPeerDisconnected();
            });
            this.socket.on('error', (er) => {
                if (this.onSocketError)
                    this.onSocketError(er);
            });
        }
    }
    onPeerConnect() {
        this.peerConnected = true;
        if (this.onPeerConnected)
            this.onPeerConnected();
    }
    toBase64(u8) {
        return btoa(String.fromCharCode.apply(null, u8));
    }
    connectPeer(ipAddress) {
        try {
            this.socket?.connect(this.PORT, ipAddress, () => {
                this.onPeerConnect();
            });
            this.connectedPeerAddress = ipAddress;
            return true;
        }
        catch (e) {
            console.error("ERROR in Socket Connection", e);
        }
    }
    disconnectPeer() {
        if (this.connectedPeerAddress) {
            this.socket?.destroy();
            this.connectedPeerAddress = undefined;
            this.peerConnected = false;
        }
    }
    reconnectPeer() {
        this.disconnectPeer(); // disconnect
        if (this.connectedPeerAddress) {
            return this.connectPeer(this.connectedPeerAddress); // conncet
        }
        return false;
    }
    writeBuffer(data) {
        //console.log("writeBuffer", data);
        let writeLength = data.length;
        if (this.bufferWritePosition + data.length > this.buffer.length)
            writeLength = this.buffer.length - this.bufferWritePosition;
        this.buffer.set(data.slice(0, writeLength), this.bufferWritePosition);
        this.bufferWritePosition += writeLength;
        if (writeLength < data.length) {
            this.bufferWritePosition = 0;
            this.buffer.set(data.slice(writeLength, data.length));
            this.bufferWritePosition += data.length - writeLength;
        }
        this.processBuffer();
    }
    readFromBuffer(numberOfBytes, setReadPosition = false) {
        const extract = new Uint8Array(numberOfBytes);
        if (this.bufferReadPosition + numberOfBytes <= this.buffer.length) {
            const readBytes = this.buffer.slice(this.bufferReadPosition, this.bufferReadPosition + numberOfBytes);
            //console.log("BUFFER READ " + this.bufferReadPosition + " - " + numberOfBytes, readBytes);
            extract.set(readBytes);
        }
        else {
            extract.set(this.buffer.slice(this.bufferReadPosition));
            extract.set(this.buffer.slice(0, this.bufferReadPosition + numberOfBytes - this.buffer.length));
        }
        if (setReadPosition)
            this.setReadPosition(numberOfBytes);
        return extract;
    }
    setReadPosition(numberOfReadByts) {
        if (this.bufferReadPosition + numberOfReadByts > this.buffer.length)
            this.bufferReadPosition = 0 + (this.bufferReadPosition + numberOfReadByts - this.buffer.length);
        else
            this.bufferReadPosition += numberOfReadByts;
    }
    processBuffer() {
        while (true) {
            const toReadBytes = Math.abs(this.bufferWritePosition - this.bufferReadPosition);
            if (toReadBytes < 8) /* header size */ {
                break;
            }
            // read header
            const header = new RequestResponseHeader_1.RequestResponseHeader();
            header.parse(this.readFromBuffer(8 /* header size */));
            if (header === undefined || toReadBytes < header?.getSize()) {
                //console.log("NOT ENOUGH BYTES FOR COMPLETE PACKAGE");
                break;
            }
            this.setReadPosition(header.getPackageSize());
            const recPackage = new ReceivedPackage_1.ReceivedPackage();
            recPackage.header = header;
            recPackage.ipAddress = this.connectedPeerAddress ?? "";
            if (header.getSize() > 8) {
                recPackage.payLoad = this.readFromBuffer(header.getSize() - header.getPackageSize(), true);
            }
            else {
                recPackage.payLoad = new Uint8Array(0);
            }
            this.processPackage(recPackage);
            if (this.onPackageReceived)
                this.onPackageReceived(recPackage);
        }
    }
    processPackage(p) {
        if (p.header.getType() == QubicPackageType_1.QubicPackageType.RESPOND_CURRENT_TICK_INFO) {
            const tickInfo = new QubicTickInfo_1.QubicTickInfo().parse(p.payLoad);
            if (tickInfo && this.currentTick < tickInfo.getTick()) {
                this.currentTick = tickInfo.getTick();
                if (this.onTick)
                    this.onTick(this.currentTick);
            }
        }
        else if (p.header.getType() == QubicPackageType_1.QubicPackageType.RESPOND_ENTITY && this.onBalance) {
            const entityResponse = new QubicEntityResponse_1.QubicEntityResponse().parse(p.payLoad);
            this.onBalance(entityResponse);
        }
    }
    requestTickInfo() {
        if (this.peerConnected) {
            const header = new RequestResponseHeader_1.RequestResponseHeader(QubicPackageType_1.QubicPackageType.REQUEST_CURRENT_TICK_INFO);
            header.randomizeDejaVu();
            this.sendPackage(header.getPackageData());
        }
    }
    requestBalance(pkey) {
        if (!this.peerConnected)
            return;
        const header = new RequestResponseHeader_1.RequestResponseHeader(QubicPackageType_1.QubicPackageType.REQUEST_ENTITY, pkey.getPackageSize());
        header.randomizeDejaVu();
        const builder = new QubicPackageBuilder_1.QubicPackageBuilder(header.getSize());
        builder.add(header);
        builder.add(new QubicEntityRequest_1.QubicEntityRequest(pkey));
        const data = builder.getData();
        this.sendPackage(data);
    }
    GetPrivatePublicKey(seed) {
        return crypto_1.default.then(({ schnorrq, K12 }) => {
            const keyHelper = new keyHelper_1.KeyHelper();
            const privateKey = keyHelper.privateKey(seed, 0, K12);
            const publicKey = keyHelper.createPublicKey(privateKey, schnorrq, K12);
            return { privateKey, publicKey };
        });
    }
    initialize() {
        this.bufferReadPosition = 0;
        this.bufferWritePosition = 0;
        // start tick info interval to get current tick regularly
        this.timer = setInterval(() => {
            this.requestTickInfo();
        }, 500);
        if (this.onReady)
            this.onReady();
    }
    /**
     * connects to a specific peer
     * @param ip node/peer ip address
     */
    connect(ip) {
        this.connectPeer(ip);
    }
    sendPackage(data) {
        return this.sendTcpPackage(data);
    }
    sendTcpPackage(data) {
        if (!this.peerConnected) {
            return false;
        }
        this.socket?.write(data);
        return true;
    }
    /**
     * starts the connection
     */
    start() {
        this.initialize();
    }
    /**
     * stops the web bridge ws connection
     */
    stop() {
        clearInterval(this.timer);
        this.disconnectPeer();
    }
    destroy() {
        this.stop();
        if (this.socket)
            this.socket.destroy(); // untested!
    }
}
exports.QubicConnector = QubicConnector;
