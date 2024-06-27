import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateStudentSeatNumberDto } from './dto/create-student_seat_number.dto';
import { UpdateStudentSeatNumberDto } from './dto/update-student_seat_number.dto';

@Injectable()
export class StudentSeatNumbersService
{
  constructor ( private readonly prismaService: PrismaService ) { }

  async create ( createStudentSeatNumbereDto: CreateStudentSeatNumberDto )
  {
    var result = await this.prismaService.student_seat_numnbers.create( {
      data: createStudentSeatNumbereDto
    } );
    return result;
  }

  async findAll ()
  {
    var results = await this.prismaService.student_seat_numnbers.findMany( {

    } );

    return results;
  }

  async findAllByControlMissionId ( controlMissionId: number )
  {
    var results = await this.prismaService.student_seat_numnbers.findMany( {
      where: {
        Control_Mission_ID: controlMissionId
      }, include: {
        student: {
          select: {
            ID: true,
            First_Name: true,
            Second_Name: true,
            Third_Name: true,
          },
        },
      },
    },
    );
    return results;
  }

  // TODO? do we need this?
  async findAllByControlMissionIdAndExamRoomId ( controlMissionId: number, examRoomId: number )
  {
    var results = await this.prismaService.student_seat_numnbers.findMany( {
      where: {
        Control_Mission_ID: controlMissionId,
        Exam_Room_ID: examRoomId
      }
    } );
    return results;
  }

  // TODO? do we need this?
  async findAllByExamRoomId ( examRoomId: number )
  {
    var results = await this.prismaService.student_seat_numnbers.findMany( {
      where: {
        Control_Mission_ID: examRoomId
      }
    } );
    return results;
  }

  // TODO? do we need this?
  async findAllByStudentId ( studentId: number ) 
  {
    var results = await this.prismaService.student_seat_numnbers.findMany( {
      where: {
        Student_ID: studentId
      }
    } );
    return results;
  }

  // TODO? do we need this?
  async findAllByStudentIdAndExamRoomId ( studentId: number, examRoomId: number )
  {
    var results = await this.prismaService.student_seat_numnbers.findMany( {
      where: {
        Student_ID: studentId,
        Control_Mission_ID: examRoomId
      }
    } );
    return results;
  }

  // TODO? do we need this?
  async findAllByStudentIdAndControlMissionId ( studentId: number, controlMissionId: number )
  {
    var results = await this.prismaService.student_seat_numnbers.findMany( {
      where: {
        Student_ID: studentId,
        Control_Mission_ID: controlMissionId
      }
    } );
    return results;
  }

  // TODO? do we need this?
  async findAllByStudentIdAndExamRoomIdAndControlMissionId ( studentId: number, examRoomId: number, controlMissionId: number )
  {
    var results = await this.prismaService.student_seat_numnbers.findMany( {
      where: {
        Student_ID: studentId,
        Control_Mission_ID: controlMissionId,
        Exam_Room_ID: examRoomId
      }
    } );
    return results;
  }

  async findOne ( id: number )
  {
    var result = await this.prismaService.student_seat_numnbers.findUnique( {
      where: {
        ID: id
      },

    } );
    return result;
  }

  async update ( id: number, updateStudentSeatNumbereDto: UpdateStudentSeatNumberDto )
  {
    var result = await this.prismaService.student_seat_numnbers.update( {
      where: {
        ID: id
      },
      data: updateStudentSeatNumbereDto
    } );
    return result;
  }

  async remove ( id: number )
  {
    var result = await this.prismaService.student_seat_numnbers.delete( {
      where: {
        ID: id
      }
    } );
    return result;
  }

  // TODO? need to check how to activate and deactivate
  //? no Active field in table
  // async activate ( id: number )
  // {
  //   var result = await this.prismaService.student_seat_numnbers.update( {
  //     where: {
  //       ID: id
  //     },
  //     data: {
  //       Active: 1
  //     }
  //   } );
  //   return result;
  // }

  // async deactivate ( id: number )
  // {
  //   var result = await this.prismaService.student_seat_numnbers.update( {
  //     where: {
  //       ID: id
  //     },
  //     data: {
  //       Active: 0
  //     }
  //   } );
  //   return result;
  // }

}
