import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { UserType } from './enums/user_type.enum';

export interface IAuthSocket extends Socket {
  userId?: number;
  userType?: string;
}

@Injectable()
export class GatewayMap {
  private readonly students: Map<number, IAuthSocket> = new Map();
  private readonly proctors: Map<number, IAuthSocket> = new Map();
  private readonly principals: Map<number, IAuthSocket> = new Map();
  private readonly schoolDirectors: Map<number, IAuthSocket> = new Map();

  getSocketByUserIdBasedOnUserType(userId, userType) {
    if (userType == UserType.Student) {
      return this.getStudentSocket(userId);
    } else if (userType == UserType.Proctor) {
      return this.getProctorSocket(userId);
    } else if (userType == UserType.Principal) {
      return this.getPrincipalSocket(userId);
    } else if (userType == UserType.SchoolDirector) {
      return this.getSchoolDirectorSocket(userId);
    }
  }

  userAlreadyConnected(socket: IAuthSocket) {
    if (socket.userType == UserType.Student) {
      return this.students.has(socket.userId);
    } else if (socket.userType == UserType.Proctor) {
      return this.proctors.has(socket.userId);
    } else if (socket.userType == UserType.Principal) {
      return this.principals.has(socket.userId);
    } else if (socket.userType == UserType.SchoolDirector) {
      return this.schoolDirectors.has(socket.userId);
    }
  }

  validateUser(socket: IAuthSocket) {
    if (
      socket.userType == UserType.Student ||
      socket.userType == UserType.Proctor ||
      socket.userType == UserType.Principal ||
      socket.userType == UserType.SchoolDirector
    ) {
      return true;
    }
  }

  getStudentSocket(id: number) {
    return this.students.get(id);
  }
  getProctorSocket(id: number) {
    return this.proctors.get(id);
  }
  getPrincipalSocket(id: number) {
    return this.principals.get(id);
  }
  getSchoolDirectorSocket(id: number) {
    return this.schoolDirectors.get(id);
  }

  setStudentSocket(id: number, socket: IAuthSocket) {
    this.students.set(id, socket);
  }
  setProctorSocket(id: number, socket: IAuthSocket) {
    this.proctors.set(id, socket);
  }
  setPrincipalSocket(id: number, socket: IAuthSocket) {
    this.principals.set(id, socket);
  }
  setSchoolDirectorSocket(id: number, socket: IAuthSocket) {
    this.schoolDirectors.set(id, socket);
  }
  removeStudentSocket(id: number) {
    this.students.delete(id);
  }
  removeProctorSocket(id: number) {
    this.proctors.delete(id);
  }
  removePrincipalSocket(id: number) {
    this.principals.delete(id);
  }
  removeSchoolDirectorSocket(id: number) {
    this.schoolDirectors.delete(id);
  }
}
