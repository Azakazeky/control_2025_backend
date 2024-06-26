import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService
{
  constructor ( private readonly prismaService: PrismaService ) { }

  async create ( createSubjecteDto: CreateSubjectDto )
  {
    var result = await this.prismaService.subjects.create( {
      data: createSubjecteDto
    } );
    return result;
  }

  async findAll ()
  {
    var results = await this.prismaService.subjects.findMany( {

    } );

    return results;
  }

  // TODO: need to check how to filter
  // async findAllBy....Id ( ....: number )
  // {
  //   var results = await this.prismaService.subjects.findMany( {
  //     where: {

  //     }
  //   } );
  //   return results;
  // }

  async findOne ( id: number )
  {
    var result = await this.prismaService.subjects.findUnique( {
      where: {
        ID: id
      },

    } );
    return result;
  }

  async update ( id: number, updateSubjecteDto: UpdateSubjectDto )
  {
    var result = await this.prismaService.subjects.update( {
      where: {
        ID: id
      },
      data: updateSubjecteDto
    } );
    return result;
  }

  async remove ( id: number )
  {
    var result = await this.prismaService.subjects.delete( {
      where: {
        ID: id
      }
    } );
    return result;
  }

  // async activate ( id: number )
  // {
  //   var result = await this.prismaService.subjects.update( {
  //     where: {
  //       ID: id
  //     },
  //     data: {
  // TODO? need to check type of data
  // ACtive is string not number
  //       Active:1
  //     }
  //   } );
  //   return result;
  // }

  // async deactivate ( id: number )
  // {
  //   var result = await this.prismaService.subjects.update( {
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
