import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateExamMissionDto } from './dto/create-exam_mission.dto';
import { UpdateExamMissionDto } from './dto/update-exam_mission.dto';

@Injectable()
export class ExamMissionService
{
  constructor ( private readonly prismaService: PrismaService ) { }

  async create ( createExamMissionteDto: CreateExamMissionDto )
  {
    var result = await this.prismaService.exam_mission.create( {
      data: createExamMissionteDto
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
