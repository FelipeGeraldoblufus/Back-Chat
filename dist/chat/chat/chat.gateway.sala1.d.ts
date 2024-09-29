import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../../auth/auth.service';
export declare class ChatGatewaySala1 implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly authService;
    server: Server;
    private connectedUsers;
    constructor(authService: AuthService);
    afterInit(server: Server): void;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    joinRoom(room: string, client: Socket): void;
    handleMessage(data: {
        room: string;
        message: string;
    }, client: Socket): void;
    leaveRoom(room: string, client: Socket): void;
    private getTokenFromHeaders;
    private validateToken;
}
