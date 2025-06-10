import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ProductsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly authService: AuthService) {}

  private logger: Logger = new Logger(ProductsGateway.name);

  @WebSocketServer()
  private readonly server: Server;

  handleProductUpdated() {
    this.server.emit('productUpdated');
  }

  handleConnection(client: Socket) {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
    const token = String(client.handshake.auth.Authentication.value);

    if (!token) {
      client.disconnect(true);
      this.logger.error(`Client ${client.id} disconnected. No token provided`);
      return;
    }

    try {
      this.authService.verifyToken(token);

      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    } catch (error) {
      throw new WsException('Unauthorized');
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
