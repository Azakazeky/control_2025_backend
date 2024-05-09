import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateExamRoomDto } from './dto/create-exam_room.dto';
import { UpdateExamRoomDto } from './dto/update-exam_room.dto';

@Injectable()
export class ExamRoomsService
{

  constructor ( private readonly prismaService: PrismaService ) { }

  async create ( createExamRoomteDto: CreateExamRoomDto )
  {
    var result = await this.prismaService.exam_room.create( {
      data: createExamRoomteDto
    } );
    return result;
  }

  async findAll ()
  {
    var results = await this.prismaService.exam_room.findMany( {

    } );

    return results;
  }

  // TODO? do we need this?
  async findAllByControlMissionId ( controlMissionId: number )
  {
    var results = await this.prismaService.exam_room.findMany( {
      where: {
        Control_Mission_ID: controlMissionId
      }
    } );
    return results;
  }

  // TODO? do we need this?
  async findAllBySchoolClassId ( schoolClassId: number )  
  {
    var results = await this.prismaService.exam_room.findMany( {
      where: {
        School_Class_ID: schoolClassId
      }
    } );
    return results;
  }

  // TODO? do we need this?
  async findAllBySchoolClassIdAndControlMissionId ( schoolClassId: number, controlMissionId: number )
  {
    var results = await this.prismaService.exam_room.findMany( {
      where: {
        School_Class_ID: schoolClassId,
        Control_Mission_ID: controlMissionId
      }
    } );
    return results;
  }

  async findOne ( id: number )
  {
    var result = await this.prismaService.exam_room.findUnique( {
      where: {
        ID: id
      },

    } );
    return result;
  }

  async update ( id: number, updateExamRoomteDto: UpdateExamRoomDto )
  {
    var result = await this.prismaService.exam_room.update( {
      where: {
        ID: id
      },
      data: updateExamRoomteDto
    } );
    return result;
  }

  async remove ( id: number )
  {
    var result = await this.prismaService.exam_room.delete( {
      where: {
        ID: id
      }
    } );
    return result;
  }

}
