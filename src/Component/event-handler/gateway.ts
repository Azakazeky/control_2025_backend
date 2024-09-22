import { HttpException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UserType } from './enums/user_type.enum';
import { GatewayMap, IAuthSocket } from './gateway.session';

@WebSocketGateway({
  cors: {
    origin: ['*'],
    credentials: true,
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private gatewayMap: GatewayMap) {}

  handleDisconnect(client: any) {
    console.log('Client disconnected', client.id);
    if (this.gatewayMap.userAlreadyConnected(client)) {
      if (client.userType == UserType.Student) {
        this.gatewayMap.removeStudentSocket(client.userId);
      } else if (client.userType == UserType.Proctor) {
        this.gatewayMap.removeProctorSocket(client.userId);
      } else if (client.userType == UserType.Principal) {
        this.gatewayMap.removePrincipalSocket(client.userId);
      } else if (client.userType == UserType.SchoolDirector) {
        this.gatewayMap.removeSchoolDirectorSocket(client.userId);
      }
    }
  }

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: IAuthSocket) {
    if (this.gatewayMap.validateUser(socket)) {
      if (this.gatewayMap.userAlreadyConnected(socket)) {
        socket.disconnect();
        return new HttpException('User already connected', 400);
      } else if (socket.userType == UserType.Student) {
        this.gatewayMap.setStudentSocket(socket.userId, socket);
      } else if (socket.userType == UserType.Proctor) {
        this.gatewayMap.setProctorSocket(socket.userId, socket);
      } else if (socket.userType == UserType.Principal) {
        this.gatewayMap.setPrincipalSocket(socket.userId, socket);
      } else if (socket.userType == UserType.SchoolDirector) {
        this.gatewayMap.setSchoolDirectorSocket(socket.userId, socket);
      }
    } else {
      socket.disconnect();
      return new HttpException('Invalid token', 400);
    }
  }
  // @OnEvent(EventType.connectToRoom)
  // connectToRoom(connectToExamRoomDto: ConnectToExamRoom) {
  //   const room = 'exam-room:' + connectToExamRoomDto.roomId;
  //   const socket = this.gatewayMap.getSocketByUserIdBasedOnUserType(
  //     connectToExamRoomDto.userId,
  //     connectToExamRoomDto.userType,
  //   );
  //   socket.join(room);
  // }

  // @OnEvent(EventType.roomEvent)
  // sendEventToRoom(roomEventDto: RoomEventDto) {
  //   const room = 'exam-room:' + roomEventDto.roomId;
  //   console.log(roomEventDto);
  //   this.server.to(room).emit(EventType.roomEvent, { roomEventDto });
  // }
}
