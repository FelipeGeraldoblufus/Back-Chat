import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../../auth/auth.service';
export declare class ChatGatewaySala2 implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly authService;
    server: Server;
    private connectedUsers;
    constructor(authService: AuthService);
    afterInit(server: Server): void;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleMessage(message: string, client: Socket): void;
    private getTokenFromHeaders;
    private validateToken;
}
