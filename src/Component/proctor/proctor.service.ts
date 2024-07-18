import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { AssignProctorToExamRoomDto, CreateProctorDto } from './dto/create-proctor.dto';
import { UpdateProctorDto } from './dto/update-proctor.dto';

@Injectable()
export class ProctorService
{
  constructor ( private readonly prismaService: PrismaService ) { }

  async create ( createProctorDto: CreateProctorDto )
  {
    var result = await this.prismaService.proctors.create( {
      data: createProctorDto
    } );
    return result;
  }

  async assignProctorToExamMission ( assignProctorToExamRoomDto: AssignProctorToExamRoomDto )
  {
    var result = await this.prismaService.proctor_in_room.create( {
      data: assignProctorToExamRoomDto,
    } );
    return result;
  }

  async unassignProctorFromExamRoom ( id: number )
  {
    var result = await this.prismaService.proctor_in_room.delete( {
      where: {
        ID: id,
      }
    } );
    return result;
  }

  async findAll ()
  {
    var results = await this.prismaService.proctors.findMany( {

    } );
    return results;
  }

  async findOne ( id: number )
  {
    var result = await this.prismaService.proctors.findUnique( {
      where: {
        ID: id
      }
    } );
    return result;
  }

  async update ( id: number, updateProctorDto: UpdateProctorDto )
  {
    var result = this.prismaService.proctors.update( {
      where: {
        ID: id,
      },
      data: updateProctorDto,
    } );
    return result;
  }

  async remove ( id: number )
  {
    var result = await this.prismaService.proctors.delete( {
      where: {
        ID: id
      }
    } );
    return result;
  }
}
