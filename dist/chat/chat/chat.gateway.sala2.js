"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGatewaySala2 = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const auth_service_1 = require("../../auth/auth.service");
let ChatGatewaySala2 = class ChatGatewaySala2 {
    constructor(authService) {
        this.authService = authService;
        this.connectedUsers = new Map();
    }
    afterInit(server) {
        console.log('WebSocket initialized');
    }
    async handleConnection(client) {
        try {
            const token = this.getTokenFromHeaders(client.handshake.headers);
            const user = await this.validateToken(token, client);
            if (user) {
                this.connectedUsers.set(client.id, user.name);
                console.log(`Usuario ${user.name} conectado con socket ID: ${client.id}`);
            }
        }
        catch (error) {
            console.error('Error en la conexión:', error);
            client.emit('error', { message: 'Autenticación fallida.' });
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const userName = this.connectedUsers.get(client.id);
        if (userName) {
            console.log(`Usuario ${userName} desconectado`);
            this.connectedUsers.delete(client.id);
        }
    }
    handleMessage(message, client) {
        const userName = this.connectedUsers.get(client.id);
        if (userName) {
            console.log(`Mensaje recibido de ${userName}: ${message}`);
            this.server.emit('message', { userName, message });
        }
        else {
            client.emit('error', { message: 'Usuario no autenticado.' });
        }
    }
    getTokenFromHeaders(headers) {
        return headers.authorization?.split(' ')[1];
    }
    async validateToken(token, client) {
        if (!token) {
            client.emit('error', { message: 'Token no proporcionado.' });
            client.disconnect();
            return null;
        }
        const user = await this.authService.validateToken(token);
        if (!user) {
            client.emit('error', { message: 'Token no válido.' });
            client.disconnect();
            return null;
        }
        return user;
    }
};
exports.ChatGatewaySala2 = ChatGatewaySala2;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGatewaySala2.prototype, "server", void 0);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGatewaySala2.prototype, "handleConnection", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGatewaySala2.prototype, "handleDisconnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGatewaySala2.prototype, "handleMessage", null);
exports.ChatGatewaySala2 = ChatGatewaySala2 = __decorate([
    (0, websockets_1.WebSocketGateway)(3002, {
        cors: {
            origin: '*',
        },
        transports: ['websocket'],
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], ChatGatewaySala2);
//# sourceMappingURL=chat.gateway.sala2.js.map