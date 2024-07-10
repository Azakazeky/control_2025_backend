import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateStudentDto } from 'src/Component/student/dto/create-student.dto';
import { CreateStudentBarcodeDto } from '../student_barcodes/dto/create-student_barcode.dto';
import { CreateExamMissionDto } from './dto/create-exam_mission.dto';
import { UpdateExamMissionDto } from './dto/update-exam_mission.dto';

@Injectable()
export class ExamMissionService
{
  constructor ( private readonly prismaService: PrismaService ) { }

  async create ( createExamMissionteDto: CreateExamMissionDto )
  {
    var unAssignedStudents: Array<CreateStudentDto> = new Array<CreateStudentDto>();
    var studentsBarcode: Array<CreateStudentBarcodeDto> = new Array<CreateStudentBarcodeDto>();
    var studentSeatNumbers = await this.prismaService.student_seat_numnbers.findMany( {
      where: {
        Control_Mission_ID: createExamMissionteDto.Control_Mission_ID
      },
      include: {
        student: true,
        control_mission: {
          select: {
            schools: {
              select: {
                ID: true
              }
            }
          }
        }
      }
    } );

    for ( let index = 0; index < studentSeatNumbers.length; index++ )
    {
      if ( studentSeatNumbers[ index ].Class_Desk_ID == null || studentSeatNumbers[ index ].Exam_Room_ID == null )
      {
        unAssignedStudents.push( studentSeatNumbers[ index ].student );
        continue;
      }
      studentsBarcode.push(
        {
          "Student_ID": studentSeatNumbers[ index ].Student_ID,
          "student_seat_numnbers_ID": studentSeatNumbers[ index ].ID,
          "Exam_Mission_ID": 0,
          "Barcode": '' + studentSeatNumbers[ index ].control_mission.schools.ID + createExamMissionteDto.Control_Mission_ID + studentSeatNumbers[ index ].Seat_Number + studentSeatNumbers[ index ].ID
        },
      );
    }
    if ( unAssignedStudents.length > 0 )
    {
      throw { "message": "Some students are not assigned to a seat. Please assign them first. The following students were not assigned: " + unAssignedStudents.map( ( student ) => ( student.First_Name + " " + student.Second_Name + " " + student.Third_Name + " , " ) ) };
    }
    var result = await this.prismaService.exam_mission.create( {
      data: {
        ...createExamMissionteDto,
        student_barcode: {
          createMany: {
            data: studentsBarcode.map( ( barcode ) =>
            {
              return {
                "Student_ID": barcode.Student_ID,
                "student_seat_numnbers_ID": barcode.student_seat_numnbers_ID,
                "Barcode": barcode.Barcode
              };
            } )
          }
        }
      }
    } );

    return result;
  }

  async findAll ()
  {
    var results = await this.prismaService.exam_mission.findMany( {

    } );

    return results;
  }

  // TODO? do we need this?
  async findAllByControlMissionId ( controlMissionId: number )
  {
    var results = await this.prismaService.exam_mission.findMany( {
      where: {
        Control_Mission_ID: controlMissionId
      }
    } );
    return results;
  }

  // TODO? do we need this?
  async findAllBySubjectId ( subjectId: number )
  {
    var results = await this.prismaService.exam_mission.findMany( {
      where: {
        Subjects_ID: subjectId
      }
    } );
    return results;
  }
  // TODO? do we need this?

  async findAllBySubjectIdAndControlMissionId ( subjectId: number, controlMissionId: number )
  {
    var results = await this.prismaService.exam_mission.findMany( {
      where: {
        Subjects_ID: subjectId,
        Control_Mission_ID: controlMissionId
      }
    } );
    return results;
  }

  async findOne ( id: number )
  {
    var result = await this.prismaService.exam_mission.findUnique( {
      where: {
        ID: id
      },

    } );
    return result;
  }

  async update ( id: number, updateExamMissionteDto: UpdateExamMissionDto )
  {
    var result = await this.prismaService.exam_mission.update( {
      where: {
        ID: id
      },
      data: updateExamMissionteDto
    } );
    return result;
  }

  async remove ( id: number )
  {
    var result = await this.prismaService.exam_mission.delete( {
      where: {
        ID: id
      }
    } );
    return result;
  }

  async activate ( id: number )
  {
    var result = await this.prismaService.exam_mission.update( {
      where: {
        ID: id
      },
      data: {
        Active: 1
      }
    } );
    return result;
  }

  async deactivate ( id: number )
  {
    var result = await this.prismaService.exam_mission.update( {
      where: {
        ID: id
      },
      data: {
        Active: 0
      }
    } );
    return result;
  }

}
