import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ProductsGateway implements OnGatewayConnection {
  constructor(private readonly authService: AuthService) {}

  @WebSocketServer()
  private readonly server: Server;

  handleProductUpdated() {
    this.server.emit('productUpdated');
  }

  handleConnection(client: Socket) {
    try {
      this.authService.verifyToken(
        /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
        String(client.handshake.auth.Authentication.value),
      );

      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    } catch (error) {
      throw new WsException('Unauthorized');
    }
  }
}
