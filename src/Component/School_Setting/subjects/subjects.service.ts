import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateSubjectDto, CreateSubjectDto2 } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService
{
  constructor ( private readonly prismaService: PrismaService ) { }

<<<<<<< HEAD
  async create(createSubjecteDto: CreateSubjectDto2, createdBy: number) {

    let types = createSubjecteDto.school_type_has_subjects;
    (
      createSubjecteDto as any).school_type_has_subjects = undefined;

    var schoolsTypes: any = [];
    types.forEach(type => {
      schoolsTypes.push({ school_type_ID: type })
    });



    var result = await this.prismaService.subjects.create({
      data: {
        ...createSubjecteDto, Created_By: createdBy,
        school_type_has_subjects: {
          createMany: {
            data: schoolsTypes
          }
        }
      },
    });
=======
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
>>>>>>> ccf06d266ecd85c54ff7a7e735e86f5e8cd76807
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
          some: {
            school_type_ID
          },
        },
      },
      select: {
        ID: true,
        Name: true,
        InExam: true,
        Active: true,
        school_type_has_subjects: {
          select: {
            school_type: {
              select: {
                ID: true,
                Name: true
              }
            }
          }
        }
      },
    } );
    return results.map( ( obj ) => obj );
  }
  async findAllActiveBySchoolTypeId ( school_type_ID: number )
  {
    var results = await this.prismaService.subjects.findMany( {
      where: {
        Active: 1,
        school_type_has_subjects: {
          some: {
            school_type_ID
          },
        },
      },
      select: {
        ID: true,
        Name: true,
        InExam: true,
        Active: true,
        school_type_has_subjects: {
          select: {
            school_type: {
              select: {
                ID: true,
                Name: true
              }
            }
          }
        }
      },
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


  async activate ( id: number, updatedBy: number, )
  {
    var result = await this.prismaService.subjects.update( {
      where: {
        ID: id
      },
      data: {
        Active: 1,
        Updated_By: updatedBy,
        Updated_At: new Date().toISOString(),
      }
    } );
    return result;
  }

  async deactivate ( id: number, updatedBy: number, )
  {
    var result = await this.prismaService.subjects.update( {
      where: {
        ID: id
      },
      data: {
        Active: 0,
        Updated_By: updatedBy,
        Updated_At: new Date().toISOString(),
      }
    } );
    return result;
  }
}
