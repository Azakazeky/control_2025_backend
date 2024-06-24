import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateControlMissionDto } from './dto/create-control_mission.dto';
import { CreateStudentSeatNumberDto } from './dto/create-student-seat-numbers.dto';
import { UpdateControlMissionDto } from './dto/update-control_mission.dto';

@Injectable()
export class ControlMissionService
{

  constructor ( private readonly prismaService: PrismaService ) { }

  async create ( createControlMissioneDto: CreateControlMissionDto )
  {

    var result = await this.prismaService.control_mission.create( {
      data: {
        ...{
          Education_year_ID: createControlMissioneDto.Education_year_ID,
          Schools_ID: createControlMissioneDto.Schools_ID,
          Name: createControlMissioneDto.Name,
          Start_Date: createControlMissioneDto.Start_Date,
          End_Date: createControlMissioneDto.End_Date
        },
        // control_mission_has_grades: {
        //   createMany: {
        //     data: createControlMissioneDto.grades_ID.map( ( id ) => ( {
        //       grades_ID: id
        //     } ) )
        //   }
        // },
      },
    } );
    return result;
  }

  async createStudentSeatNumbers ( createStudentSeatNumberDto: CreateStudentSeatNumberDto )
  {
    var studentsinMission = await this.prismaService.student.findMany( {
      where: {
        ID: {
          in: createStudentSeatNumberDto.Student_IDs
        }
      },
      include: {
        grades: true,
      },
    } );

    var seatNumbers: Array<number> = new Array( studentsinMission.length );
    studentsinMission.sort( ( a, b ) => ( a.grades.Name.localeCompare( b.grades.Name )
      || a.First_Name.localeCompare( b.First_Name )
      || a.Second_Name.localeCompare( b.Second_Name )
      || a.Third_Name.localeCompare( b.Third_Name ) ) );

    for ( var i = 0; i < studentsinMission.length; i++ )
    {
      if ( i == 0 )
      {
        seatNumbers[ i ] = ( parseInt( studentsinMission[ i ].grades.Name.split( " " )[ 1 ] ) * 1000 ) + 1;
      }
      else if ( studentsinMission[ i ].grades.Name != studentsinMission[ i - 1 ].grades.Name )
      {
        seatNumbers[ i ] = ( parseInt( studentsinMission[ i ].grades.Name.split( " " )[ 1 ] ) * 1000 ) + 1;
      }
      else
      {
        seatNumbers[ i ] = seatNumbers[ i - 1 ] + 1;
      }
    }
    var result = await this.prismaService.student_seat_numnbers.createMany( {
      data:
        studentsinMission.map( ( student, index ) => ( {
          Seat_Number: seatNumbers[ index ].toString(),
          Student_ID: student.ID,
          Control_Mission_ID: createStudentSeatNumberDto.controlMissionId,
        } ) ),
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
      },
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
