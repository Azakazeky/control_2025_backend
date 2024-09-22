import { IoAdapter } from '@nestjs/platform-socket.io';
import { verify } from 'jsonwebtoken';
import { UserType } from './enums/user_type.enum';
import { IAuthSocket } from './gateway.session';

export class WebsocketAdapter extends IoAdapter {
  createIOServer(port: number, options?: any) {
    const server = super.createIOServer(port, options);
    server.use(async (socket: IAuthSocket, next) => {
      const token = socket.handshake.headers.authorization;
      if (!token) return next(new Error('No token provided'));
      if (!token.startsWith('Bearer ')) {
        return next(new Error('token must be a Bearer token'));
      }
      let decoded;
      try {
        decoded = verify(token.split(' ')[1], 'C2287E7F65DB21F3');
      } catch (e) {
        return next(new Error('Invalid token'));
      }
      socket.userId = Number(socket.handshake.headers.userid);
      socket.userType = socket.handshake.headers.usertype as UserType;
      return next();
    });
    return server;
  }
}
