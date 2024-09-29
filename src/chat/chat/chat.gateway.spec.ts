import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { AuthService } from '../../auth/auth.service';
import { Server, Socket } from 'socket.io';

describe('ChatGateway', () => {
  let chatGateway: ChatGateway;
  let serverMock: Server;
  let client: Socket;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        {
          provide: AuthService,
          useValue: {
            validateToken: jest.fn().mockResolvedValue({ name: 'John Doe' }),
          },
        },
      ],
    }).compile();

    chatGateway = module.get<ChatGateway>(ChatGateway);
    serverMock = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    } as unknown as Server;

    client = {
      id: 'SocketIDGenerico',
      join: jest.fn(),
      leave: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
      handshake: {
        headers: {
          authorization: 'Bearer token',
        },
      },
    } as unknown as Socket;

    chatGateway.server = serverMock; // Asignar el mock del servidor
  });

  it('debería conectar un usuario y almacenar su nombre', async () => {
    await chatGateway.handleConnection(client);
    
    expect(client.emit).not.toHaveBeenCalledWith('error');
    expect(chatGateway.connectedUsers.get(client.id)).toBe('John Doe');
  });

  it('debería desconectar a un usuario en caso de falla de autenticación', async () => {
    const invalidClient = { ...client, handshake: { headers: { authorization: '' } } } as unknown as Socket;
    
    await chatGateway.handleConnection(invalidClient);
    
    expect(invalidClient.emit).toHaveBeenCalledWith('error', { message: 'Token no proporcionado.' });
    expect(invalidClient.disconnect).toHaveBeenCalled(); // Verificar que se llame a disconnect
  });

  it('debería permitir a un usuario unirse a una sala', async () => {
    await chatGateway.handleConnection(client); // Conectar al usuario primero
    await chatGateway.joinRoom('room1', client);
    
    expect(client.join).toHaveBeenCalledWith('room1');
    expect(serverMock.to).toHaveBeenCalledWith('room1');
    expect(serverMock.to('room1').emit).toHaveBeenCalledWith('user', { userName: 'John Doe', message: 'John Doe se ha unido a la sala.' });
  });

  it('debería enviar un mensaje a la sala', async () => {
    await chatGateway.handleConnection(client); // Conectar al usuario primero
    chatGateway.handleMessage({ room: 'room1', message: '¡Hola!' }, client);

    expect(serverMock.to('room1').emit).toHaveBeenCalledWith('message', { userName: 'John Doe', message: '¡Hola!' });
  });

  it('debería emitir un error si el usuario no está autenticado', async () => {
    const unauthenticatedClient = { ...client, handshake: { headers: { authorization: 'Bearer invalid' } } } as unknown as Socket;

    await chatGateway.handleConnection(unauthenticatedClient);
    await chatGateway.handleMessage({ room: 'room1', message: '¡Hola!' }, unauthenticatedClient);

    expect(unauthenticatedClient.emit).toHaveBeenCalledWith('error', { message: 'Usuario no autenticado.' });
  });

  it('debería permitir a un usuario salir de una sala', async () => {
    await chatGateway.handleConnection(client); // Conectar al usuario primero
    await chatGateway.joinRoom('room1', client); // El usuario se une a la sala
    await chatGateway.leaveRoom('room1', client);
    
    expect(client.leave).toHaveBeenCalledWith('room1');
    expect(serverMock.to).toHaveBeenCalledWith('room1');
    expect(serverMock.to('room1').emit).toHaveBeenCalledWith('user', { userName: 'John Doe', message: 'John Doe ha salido de la sala.' });
  });
});
