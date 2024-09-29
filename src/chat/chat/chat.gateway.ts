import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../../auth/auth.service';

@WebSocketGateway(3001,{
  cors: {
    origin: '*', // Permitir conexiones de cualquier origen
  },
  transports: ['websocket'],  // Forzar el uso de websockets
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() 
  server: Server;
  public connectedUsers = new Map<string, string>();

  constructor(private readonly authService: AuthService) {}

  afterInit(server: Server) {
    console.log('WebSocket initialized');
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const token = this.getTokenFromHeaders(client.handshake.headers);
      const user = await this.validateToken(token, client);
      
      if (user) {
        this.connectedUsers.set(client.id, user.name);
        console.log(`Usuario ${user.name} conectado con socket ID: ${client.id}`);
      }
    } catch (error) {
      console.error('Error en la conexión:', error);
      client.emit('error', { message: 'Autenticación fallida.' });
      client.disconnect();
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const userName = this.connectedUsers.get(client.id);
    if (userName) {
      console.log(`Usuario ${userName} desconectado`);
      this.connectedUsers.delete(client.id);
    }
  }

  @SubscribeMessage('joinRoom')
  joinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.join(room);
    const userName = this.connectedUsers.get(client.id);
    console.log(`Usuario ${this.connectedUsers.get(client.id)} se unió a la sala: ${room}`);
    this.server.to(room).emit('user', { userName, message: `${userName} se ha unido a la sala.`.trim() });
  }

  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() data: { room: string, message: string }, @ConnectedSocket() client: Socket) {
    const userName = this.connectedUsers.get(client.id);
    if (userName) {
      console.log(`Mensaje recibido de ${userName} en sala ${data.room}: ${data.message}`);
      this.server.to(data.room).emit('message', { userName, message: data.message });
    } else {
      client.emit('error', { message: 'Usuario no autenticado.' });
    }
  }

  @SubscribeMessage('leaveRoom')  // Método para salir de una sala
  leaveRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.leave(room);
    const userName = this.connectedUsers.get(client.id);
    console.log(`Usuario ${userName} salió de la sala: ${room}`);
    this.server.to(room).emit('user', { userName, message: `${userName} ha salido de la sala.`.trim() });
    
  }

  private getTokenFromHeaders(headers: any): string | undefined {
    return headers.authorization?.split(' ')[1];
  }

  private async validateToken(token: string | undefined, client: Socket): Promise<any> {
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
}
