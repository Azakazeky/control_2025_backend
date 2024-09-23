import { HttpException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ExamRoomEventDto } from '../Mission/exam_rooms/dto/exam-room-event.dto';
import { ConnectToExamRoomDto } from '../Mission/student_barcodes/dto/connect-to-exam-room.dto';
import { DisconnectFromExamRoomDto } from '../Mission/student_barcodes/dto/disconnect-from-exam-room.dto';
import { EventType } from './enums/event_type.enum';
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
        socket.emit('error', {
          status: 400,
          message: 'User already connected',
        });
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
      throw new HttpException('Invalid token', 400);
    }
  }
  @OnEvent(EventType.connectToExamRoom)
  connectToRoom(connectToExamRoomDto: ConnectToExamRoomDto) {
    const room = 'exam-room:' + connectToExamRoomDto.examRoomId;
    const socket = this.gatewayMap.getSocketByUserIdBasedOnUserType(
      connectToExamRoomDto.userId,
      connectToExamRoomDto.userType,
    );
    socket.join(room);
  }
  @OnEvent(EventType.disconnectFromExamRoom)
  disconnectFromRoom(connectToExamRoomDto: DisconnectFromExamRoomDto) {
    const room = 'exam-room:' + connectToExamRoomDto.examRoomId;
    const socket = this.gatewayMap.getSocketByUserIdBasedOnUserType(
      connectToExamRoomDto.userId,
      connectToExamRoomDto.userType,
    );
    socket.leave(room);
  }

  @OnEvent(EventType.roomEvent)
  sendEventToRoom(examRoomEvent: ExamRoomEventDto) {
    const room = 'exam-room:' + examRoomEvent.examRoomId;
    this.server.to(room).emit(EventType.roomEvent, examRoomEvent);
  }
}
