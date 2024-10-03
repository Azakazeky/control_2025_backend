import { Inject } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { verify } from 'jsonwebtoken';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { UserType } from './enums/user_type.enum';
import { IAuthSocket } from './gateway.session';

export class WebsocketAdapter extends IoAdapter {
  constructor(
    private readonly app: any, // You may want to type this more specifically
    @Inject(PrismaService) private readonly prismaService: PrismaService,
  ) {
    super(app);
  }
  createIOServer(port: number, options?: any) {
    const server = super.createIOServer(port, options);
    server.use(async (socket: IAuthSocket, next) => {
      const token =
        socket.handshake.auth.Authorization ||
        socket.handshake.headers.authorization;
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
      if (!decoded.type.includes(UserType.Student)) {
        var proctor = await this.prismaService.proctors.findUnique({
          where: {
            ID: decoded.userId,
          },
          select: {
            isFloorManager: true,
          },
        });
        if (proctor.isFloorManager) {
          if (proctor.isFloorManager == 'School Director') {
            socket.userType = UserType.SchoolDirector;
          } else {
            socket.userType = UserType.Principal;
          }
        } else {
          socket.userType = UserType.Proctor;
        }
      } else {
        socket.userType = UserType.Student;
      }
      socket.userId = Number(decoded.userId);
      return next();
    });
    return server;
  }
}
