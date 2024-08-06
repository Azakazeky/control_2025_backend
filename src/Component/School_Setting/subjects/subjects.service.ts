import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService
{
  constructor ( private readonly prismaService: PrismaService ) { }

  async create ( createSubjecteDto: CreateSubjectDto, createdBy: number )
  {
    var result = await this.prismaService.subjects.create( {
      data: {
        Name: createSubjecteDto.Name,
        Active: createSubjecteDto.Active,
        Created_By: createdBy,
        InExam: createSubjecteDto.InExam,
      }
    } );
    createSubjecteDto.schools_type_ID.map( async ( id ) =>
    {
      await this.prismaService.school_type_has_subjects.create( {
        data: {
          school_type_ID: id,
          subjects_ID: result.ID,
        },
      } );
    } );
    return result;
  }

  async findAll ()
  {
    var results = await this.prismaService.subjects.findMany( {} );

    return results;
  }

  async findAllBySchoolTypeId ( school_type_ID: number )
  {
    var results = await this.prismaService.subjects.findMany( {
      where: {
        school_type_has_subjects: {
          every: {
            school_type_ID
          }
        }
      }
    } );
    return results.map( ( obj ) => obj );
  }

  async findOne ( id: number )
  {
    var result = await this.prismaService.subjects.findUnique( {
      where: {
        ID: id,
      },
    } );
    return result;
  }

  async update (
    id: number,
    updateSubjecteDto: UpdateSubjectDto,
    updatedBy: number,
  )
  {
    var result = await this.prismaService.subjects.update( {
      where: {
        ID: id,
      },
      data: {
        Active: updateSubjecteDto.Active,
        Name: updateSubjecteDto.Name,
        InExam: updateSubjecteDto.InExam,
        Updated_By: updatedBy,
        Updated_At: new Date().toISOString(),
      },
    } );

    await this.prismaService.school_type_has_subjects.deleteMany( {
      where: {
        subjects_ID: id,
      },
    } );

    updateSubjecteDto.schools_type_ID.map( async ( id ) =>
    {
      await this.prismaService.school_type_has_subjects.create( {
        data: {
          school_type_ID: id,
          subjects_ID: result.ID,
        },
      } );
    } );
    return result;
  }

  async connectSubjectToSchoolType ( id: number, school_type_ID: number )
  {
    var result = await this.prismaService.school_type_has_subjects.create( {
      data: {
        school_type_ID,
        subjects_ID: id,
      },
    } );
    return result;
  }

  async remove ( id: number )
  {
    var result = await this.prismaService.subjects.delete( {
      where: {
        ID: id,
      },
    } );
    return result;
  }




  async chageInExamState (
    id: number,
    number: number,
    updatedBy: number,
  )
  {
    var result = await this.prismaService.subjects.update( {
      where: {
        ID: id,
      },
      data: {
        InExam: number,
        Updated_By: updatedBy,
        Updated_At: new Date().toISOString(),
      },
    } );
    return result;
  }
  async reactive (
    id: number,
    active: number,
    updatedBy: number,
  )
  {
    var result = await this.prismaService.subjects.update( {
      where: {
        ID: id,
      },
      data: {
        Active: active,
        Updated_By: updatedBy,
        Updated_At: new Date().toISOString(),
      },
    } );
    return result;
  }


  async deactive (
    id: number,

    active: number, updatedBy: number,
  )
  {
    var result = await this.prismaService.subjects.update( {
      where: {
        ID: id,
      },
      data: {
        Active: active,
        Updated_By: updatedBy,
        Updated_At: new Date().toISOString(),
      },
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
