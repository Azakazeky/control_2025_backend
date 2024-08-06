import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { ExamMissionService } from '../Mission/exam_mission/exam_mission.service';
import { CreateUuidDto } from './dto/create-uuid.dto';
import { UpdateUuidDto } from './dto/update-uuid.dto';


@Injectable()
export class UuidService
{
  constructor (
    private readonly prismaService: PrismaService,
    private readonly examMissionService: ExamMissionService
  ) { }

  async create ( createUuidDto: CreateUuidDto, createdBy: number )
  {
    var result = await this.prismaService.uuid.create( {
      data: { ...createUuidDto, student_id: '' + createdBy, Created_by: createdBy },
    } );
    return result;
  }

  async findAll ()
  {
    var results = await this.prismaService.uuid.findMany( {} );

    return results;
  }

  async findOne ( id: number )
  {
    var result = await this.prismaService.uuid.findUnique( {
      where: {
        ID: id,
      },
    } );
    return result;
  }

  async update (
    id: number,
    updateUuidDto: UpdateUuidDto,
    updatedBy: number,
  )
  {
    var result = await this.prismaService.uuid.update( {
      where: {
        ID: id,
      },
      data: {
        ...updateUuidDto,
        Updated_By: updatedBy,
        UpdatedAt: new Date().toISOString(),
      },
    } );
    return result;
  }

  async remove ( id: number )
  {
    var result = await this.prismaService.uuid.delete( {
      where: {
        ID: id,
      },
    } );
    return result;
  }

  async activate ( id: number, updatedBy: number )
  {

    var result = await this.prismaService.uuid.update( {
      where: {
        ID: id
      },
      data: {
        active: 1,
        Updated_By: updatedBy,
        UpdatedAt: new Date().toISOString(),
      }
    } );

    return result;
  }

  async validateStudent ( uuid: number, examMissionId: number )
  {

    var studentId = await this.prismaService.uuid.findFirst( {
      where: {
        ID: uuid
      },
      select: {
        student_id: true
      }
    } );

    var studentBarcodeId = await this.prismaService.student_barcode.findFirst( {
      where: {
        Student_ID: Number( studentId.student_id ),
        Exam_Mission_ID: Number( examMissionId ),
      },
      select: {
        ID: true,
      }
    } );

    var studentAttendance = await this.prismaService.student_barcode.update( {
      where: {
        ID: studentBarcodeId.ID,
      },
      data: {
        AttendanceStatusId: 13,
      }
    } );

    var examMissionResult = await this.prismaService.exam_mission.findFirst( {
      where: {
        ID: examMissionId,
        AND: {
          start_time: {
            lte: new Date().toISOString(),
          },
          end_time: {
            gte: new Date().toISOString(),
          },
        }
      },
    } );
    var uuidResult = await this.prismaService.uuid.findFirst( {
      where: {
        ID: uuid
      },
      select: {
        ID: true,
        active: true,
      }
    } );

    if ( examMissionResult && uuidResult.active == 1 )
    {
      return this.examMissionService.getExamFileDataTostudent( examMissionResult.pdf );
    }

    throw new HttpException( 'QR Code Expired or Invalid', HttpStatus.EXPECTATION_FAILED );
  }

  // async deactivate ( id: number )
  // {
  //   var result = await this.prismaService.uuid.update( {
  //     where: {
  //       ID: id
  //     },
  //     data: {
  // TODO? need to check type of data
  // ACtive is string not number
  //       Active:0
  //     }
  //   } );
  //   return result;
  // }
}
