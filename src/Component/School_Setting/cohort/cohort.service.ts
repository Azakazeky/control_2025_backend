import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { UpdateCohortDto } from './dto/update-cohort.dto';

@Injectable()
export class CohortService
{
  constructor ( private readonly prismaService: PrismaService ) { }

  async create ( createCohortDto: CreateCohortDto )
  {
    var result = await this.prismaService.cohort.create( {
      data: createCohortDto
    } );
    return result;
  }

  async findAll ()
  {
    var schools = await this.prismaService.cohort.findMany( {

    } );

    return schools;
  }

  // TODO: need to check how to filter
  // async findAllBySchoolId ( schoolId: number )
  // {
  //   var schools = await this.prismaService.cohort.findMany( {
  //     where: {

  //     }
  //   } );
  //   return schools;
  // }

  async findOne ( id: number )
  {
    var result = await this.prismaService.cohort.findUnique( {
      where: {
        ID: id
      },

    } );
    return result;
  }

  async update ( id: number, updateCohortDto: UpdateCohortDto )
  {
    var result = await this.prismaService.cohort.update( {
      where: {
        ID: id
      },
      data: updateCohortDto
    } );
    return result;
  }

  async remove ( id: number )
  {
    var result = await this.prismaService.cohort.delete( {
      where: {
        ID: id
      }
    } );
    return result;
  }

}
