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
    var seatNumbers = new Array<String>();
    var groupedGrades = this.prismaService.student.groupBy( {
      by: 'Grades_ID',
      where: {
        ID: {
          in: createControlMissioneDto.Student_IDs
        }
      }
    } );
    var studentsGradesName = await this.prismaService.student.findMany( {
      where: {
        ID: {
          in: createControlMissioneDto.Student_IDs
        }
      },
      select: {
        grades: {
          select: {
            Name: true,
            ID: true,
          }
        },
      },
    } );

    for ( let i = 0; i < ( await groupedGrades ).length; i++ )
    {
      for ( let j = 0; j < ( studentsGradesName.length / ( await groupedGrades ).length ); j++ )
      {
        const element = studentsGradesName[ j + i ];
        seatNumbers.push( ( parseInt( element.grades.Name.split( ' ' )[ 1 ] ) * 1000 + j + 1 ).toString() );
      }
    }

    var result = await this.prismaService.control_mission.create( {
      data: {
        ...{
          Education_year_ID: createControlMissioneDto.Education_year_ID,
          Schools_ID: createControlMissioneDto.Schools_ID,
          Name: createControlMissioneDto.Name,
          Start_Date: createControlMissioneDto.Start_Date,
          End_Date: createControlMissioneDto.End_Date
        },
        control_mission_has_grades: {
          createMany: {
            data: createControlMissioneDto.grades_ID.map( ( id ) => ( {
              grades_ID: id
            } ) )
          }
        },
        student_seat_numnbers: {
          createMany: {
            data: createControlMissioneDto.Student_IDs.map( ( id, index ) => ( {
              Student_ID: id,
              Seat_Number: '' + seatNumbers[ index ]
            } ) )
          },
        }
      },
    } );
    return result;
  }

  async findAll ()
  {
    var results = await this.prismaService.control_mission.findMany( {

    } );

    return results;
  }

  async findAllByEducationYearIdAndSchoolId ( schoolId: number, educationYearId: number )
  {
    var results = await this.prismaService.control_mission.findMany( {
      where: {
        Education_year_ID: educationYearId,
        Schools_ID: schoolId
      }
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

  async activate ( id: number )
  {
    var result = await this.prismaService.control_mission.update( {
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
    var result = await this.prismaService.control_mission.update( {
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
