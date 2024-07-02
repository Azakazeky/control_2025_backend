import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService
{

  constructor ( private readonly prismaService: PrismaService ) { }

  async create ( createStudenteDto: CreateStudentDto )
  {
    var result = await this.prismaService.student.create( {
      data: createStudenteDto,
      include: {

        cohort: {
          select: {
            ID: true,
            Name: true
          }
        },
        school_class: {
          select: {
            ID: true,
            Name: true
          }
        },
        grades: {
          select: {
            ID: true,
            Name: true
          }
        },
      }
    } );
    return result;
  }

  async createMany ( createStudenteDto: [ CreateStudentDto ] )
  {
    var result = await this.prismaService.student.createMany( {
      data: createStudenteDto
    } );
    return result;
  }

  async findAll ()
  {
    var results = await this.prismaService.student.findMany( {

      include: {
        cohort: {
          select: {
            ID: true,
            Name: true
          }
        },
        school_class: {
          select: {
            ID: true,
            Name: true
          }
        },
        grades: {
          select: {
            ID: true,
            Name: true
          }
        },
      }

    } );

    return results;
  }
  // async findAllByIds ( studentIds: number[] )
  // {
  //   var results = await this.prismaService.student.findMany( {
  //     where: {
  //       ID: {
  //         in: studentIds
  //       }
  //     }
  //   } );

  //   return results;
  // }

  // TODO? do we need this?
  async findAllByCohortId ( cohortId: number )
  {
    var results = await this.prismaService.student.findMany( {
      where: {
        Cohort_ID: cohortId
      }
    } );
    return results;
  }
  // TODO? do we need this?
  async findAllByClassId ( classId: number )
  {
    var results = await this.prismaService.student.findMany( {
      where: {
        School_Class_ID: classId
      }
    } );
    return results;
  }
  // TODO? do we need this?
  async findAllByClassIdAndCohortId ( classId: number, cohortId: number )
  {
    var results = await this.prismaService.student.findMany( {
      where: {
        School_Class_ID: classId,
        Cohort_ID: cohortId
      }
    } );
    return results;
  }

  async findAllBySchoolId ( schoolId: number )
  {
    var results = await this.prismaService.student.findMany( {
      where: {
        Schools_ID: schoolId,
      }
    } );
    return results;
  }

  // TODO? do we need this?
  async findAllBySchoolIdAndClassIdAndCohortId ( schoolId: number, classId: number, cohortId: number )
  {
    var results = await this.prismaService.student.findMany( {
      where: {
        Schools_ID: schoolId,
        School_Class_ID: classId,
        Cohort_ID: cohortId
      }
    } );
    return results;
  }

  async findOne ( id: number )
  {
    var result = await this.prismaService.student.findUnique( {
      where: {
        ID: id
      },

    } );
    return result;
  }

  async update ( id: number, updateStudenteDto: UpdateStudentDto )
  {
    var result = await this.prismaService.student.update( {
      where: {
        ID: id
      },
      data: updateStudenteDto
    } );
    return result;
  }

  async remove ( id: number )
  {
    var result = await this.prismaService.student.delete( {
      where: {
        ID: id
      }
    } );
    return result;
  }

  async activate ( id: number )
  {
    var result = await this.prismaService.student.update( {
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
    var result = await this.prismaService.student.update( {
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
