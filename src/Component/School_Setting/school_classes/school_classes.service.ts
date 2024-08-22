import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateSchoolClassDto } from './dto/create-school_class.dto';
import { UpdateSchoolClassDto } from './dto/update-school_class.dto';

@Injectable()
export class SchoolClassesService
{
  constructor ( private readonly prismaService: PrismaService ) { }

  async create (
    createSchoolClassDto: CreateSchoolClassDto,
    createdBy: number,
    schoolId: number,
  )
  {
    var classDesks: Array<{ Cloumn_Num: number, Row_Num: number, }> = new Array<{ Cloumn_Num: number, Row_Num: number; }>;
    for ( var i = 0; i < createSchoolClassDto.Rows.split( ',' ).length; i++ )
    {
      classDesks.push( {
        Cloumn_Num: i,
        Row_Num: parseInt( createSchoolClassDto.Rows.split( ',' )[ i ] ),
      } );
    }
    var result = await this.prismaService.school_class.create( {
      data: {
        ...createSchoolClassDto,
        Created_By: createdBy,
        Schools_ID: schoolId,
        class_desk: {
          createMany: {
            data: classDesks
          }
        }
      },
    } );
    return result;
  }

  async findAll ()
  {
    var results = await this.prismaService.school_class.findMany( {} );

    return results;
  }

  async findOne ( id: number )
  {
    var result = await this.prismaService.school_class.findUnique( {
      where: {
        ID: id,
      },
    } );
    return result;
  }

  async findBySchool ( id: number )
  {
    var result = await this.prismaService.school_class.findMany( {
      where: {
        Schools_ID: id,
      },
    } );
    return result;
  }

  async update (
    id: number,
    updateSchoolClassDto: UpdateSchoolClassDto,
    updatedBy: number,
  )
  {
    var result = await this.prismaService.school_class.update( {
      where: {
        ID: id,
      },
      data: {
        ...updateSchoolClassDto,
        Updated_By: updatedBy,
        Updated_At: new Date().toISOString(),
      },
    } );
    return result;
  }

  async remove ( id: number )
  {
    var result = await this.prismaService.school_class.delete( {
      where: {
        ID: id,
      },
    } );
    return result;
  }

  async activate ( id: number )
  {
    var result = await this.prismaService.school_class.update( {
      where: {
        ID: id,
      },
      data: {
        Active: 1,
      },
    } );
    return result;
  }

  async deactivate ( id: number )
  {
    var result = await this.prismaService.school_class.update( {
      where: {
        ID: id,
      },
      data: {
        Active: 0,
      },
    } );
    return result;
  }
}
