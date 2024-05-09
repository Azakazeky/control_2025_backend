import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateControlMissionDto } from './dto/create-control_mission.dto';
import { UpdateControlMissionDto } from './dto/update-control_mission.dto';

@Injectable()
export class ControlMissionService
{

  constructor ( private readonly prismaService: PrismaService ) { }

  async create ( createControlMissioneDto: CreateControlMissionDto )
  {
    var result = await this.prismaService.control_mission.create( {
      data: createControlMissioneDto
    } );
    return result;
  }

  async findAll ()
  {
    var results = await this.prismaService.control_mission.findMany( {

    } );

    return results;
  }

  async findAllBySchoolId ( schoolId: number )
  {
    var results = await this.prismaService.control_mission.findMany( {
      where: {
        Schools_ID: schoolId
      }
    } );
    return results;
  }

  async findAllByEducationYearId ( educationYearId: number )
  {
    var results = await this.prismaService.control_mission.findMany( {
      where: {
        Education_year_ID: educationYearId
      }
    } );
    return results;
  }

  async findOne ( id: number )
  {
    var result = await this.prismaService.control_mission.findUnique( {
      where: {
        ID: id
      },

    } );
    return result;
  }

  async update ( id: number, updateControlMissioneDto: UpdateControlMissionDto )
  {
    var result = await this.prismaService.control_mission.update( {
      where: {
        ID: id
      },
      data: updateControlMissioneDto
    } );
    return result;
  }

  async remove ( id: number )
  {
    var result = await this.prismaService.control_mission.delete( {
      where: {
        ID: id
      }
    } );
    return result;
  }
}
