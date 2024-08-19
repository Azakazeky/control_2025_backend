import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateStudentBarcodeDto } from './dto/create-student_barcode.dto';
import { UpdateStudentBarcodeDto } from './dto/update-student_barcode.dto';

@Injectable()
export class StudentBarcodesService
{
  constructor ( private readonly prismaService: PrismaService ) { }

  async create ( createStudentBarCodeteDto: CreateStudentBarcodeDto )
  {
    var result = await this.prismaService.student_barcode.create( {
      data: createStudentBarCodeteDto,
    } );
    return result;
  }
  async createMany ( createStudentBarCodeteDto: CreateStudentBarcodeDto[] )
  {
    var result = await this.prismaService.student_barcode.createMany( {
      data: createStudentBarCodeteDto,
    } );
    return result;
  }

  // TODO? get students count with and without degrees and total count by control mission id

  async findAll ()
  {
    var results = await this.prismaService.student_barcode.findMany( {
      where: {
        student_seat_numnbers: {
          Active: 1,
        }
      }
    } );

    return results;
  }

  // TODO? do we need this?
  async findAllByExamMissionId ( examMissionId: number )
  {
    var results = await this.prismaService.student_barcode.findMany( {
      where: {
        Exam_Mission_ID: examMissionId,
        student_seat_numnbers: {
          Active: 1,
        }
      },
    } );
    return results;
  }

  // TODO? do we need this?
  async findAllByStudentId ( studentId: number )
  {
    var results = await this.prismaService.student_barcode.findMany( {
      where: {
        Student_ID: studentId,
        student_seat_numnbers: {
          Active: 1,
        }
      },
    } );
    return results;
  }

  // TODO? do we need this?
  async findAllByStudentIdAndExamMissionId (
    studentId: number,
    examMissionId: number,
  )
  {
    var results = await this.prismaService.student_barcode.findMany( {
      where: {
        Student_ID: studentId,
        Exam_Mission_ID: examMissionId,
        student_seat_numnbers: {
          Active: 1,
        }
      },
    } );
    return results;
  }

  async findByBarcode ( barcode: string )
  {
    var result = await this.prismaService.student_barcode.findUnique( {
      where: {
        Barcode: barcode,
      },
      include: {
        exam_mission: {
          include: {
            subjects: {
              select: {
                ID: true,
                Name: true,
              },
            },
          },
        },
        student: {
          select: {
            ID: true,
            First_Name: true,
            Second_Name: true,
            Third_Name: true,
            school_class: {
              select: {
                ID: true,
                Name: true,
              },
            },
            grades: {
              select: {
                ID: true,
                Name: true,
              },
            },
          },
        },
      },
    } );

    var studentsDegreesCounter = await this.prismaService.student_barcode.findMany( {
      where: {
        Exam_Mission_ID: result.Exam_Mission_ID,
      },
      select: {
        StudentDegree: true,
      },
    } );
    result[ 'StudentsWithoutDegrees' ] = studentsDegreesCounter.filter( ( item ) => item.StudentDegree == null ).length;
    result[ 'StudentsWithDegrees' ] = studentsDegreesCounter.filter( ( item ) => item.StudentDegree != null ).length;
    result[ 'TotalStudents' ] = studentsDegreesCounter.length;
    return result;
  }
  async findOne ( id: number )
  {
    var result = await this.prismaService.student_barcode.findUnique( {
      where: {
        ID: id,
      },
    } );
    return result;
  }

  async findStudentBarcodesByExamRoomIdAndExamMissionId (
    examRoomId: number,
    examMissionId: number,
  )
  {
    var result = await this.prismaService.exam_room_has_exam_mission.findMany( {
      where: {
        exam_room_ID: examRoomId,
        exam_mission_ID: examMissionId,
      },
      select: {
        exam_mission: {
          select: {
            subjects: {
              select: {
                ID: true,
                Name: true,
              },
            },
            control_mission: {
              select: {
                student_seat_numnbers: {
                  where: {
                    Exam_Room_ID: examRoomId,
                    Active: 1,
                  },
                  select: {
                    student_barcode: {
                      take: 1,
                      select: {
                        ID: true,
                        Barcode: true,
                        isCheating: true,
                        student_seat_numnbers: {
                          select: {
                            ID: true,
                            Seat_Number: true,
                          },
                        },
                        student: {
                          select: {
                            ID: true,
                            First_Name: true,
                            Second_Name: true,
                            Third_Name: true,
                            Religion: true,
                            Second_Lang: true,
                            grades: {
                              select: {
                                ID: true,
                                Name: true,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    } );
    return {
      subject: result.map( ( exam_room_has_exam_mission ) =>
      {
        return exam_room_has_exam_mission.exam_mission.subjects;
      } )[ 0 ],
      student_barcodes: result
        .map( ( exam_room_has_exam_mission ) =>
        {
          return exam_room_has_exam_mission.exam_mission.control_mission.student_seat_numnbers
            .map( ( student_seat_number ) =>
            {
              return student_seat_number.student_barcode;
            } )
            .flat();
        } )
        .flat(),
    };
  }
  async findStudentBarcodesByExamRoomId (
    examRoomId: number,
    month: string,
    year: string,
    period: boolean,
  )
  {
    var result = await this.prismaService.exam_room_has_exam_mission.findMany( {
      where: {
        exam_room_ID: examRoomId,
        AND: {
          exam_mission: {
            Month: month,
            Year: year,
            Period: period ? true : false,
          },
        },
      },
      select: {
        exam_mission: {
          select: {
            subjects: {
              select: {
                ID: true,
                Name: true,
              },
            },
            control_mission: {
              select: {
                student_seat_numnbers: {
                  where: {
                    Active: 1,
                  },
                  select: {
                    student_barcode: {
                      select: {
                        ID: true,
                        Barcode: true,
                        student_seat_numnbers: {
                          select: {
                            ID: true,
                            Seat_Number: true,
                          },
                        },
                        student: {
                          select: {
                            ID: true,
                            First_Name: true,
                            Second_Name: true,
                            Third_Name: true,
                            Religion: true,
                            Second_Lang: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    } );
    return {
      subject: result.map( ( exam_room_has_exam_mission ) =>
      {
        return exam_room_has_exam_mission.exam_mission.subjects;
      } ),
      student_barcodes: result
        .map( ( exam_room_has_exam_mission ) =>
        {
          return exam_room_has_exam_mission.exam_mission.control_mission.student_seat_numnbers
            .map( ( student_seat_number ) =>
            {
              return student_seat_number.student_barcode;
            } )
            .flat();
        } )
        .flat(),
    };
  }

  async update ( id: number, updateStudentBarCodeteDto: UpdateStudentBarcodeDto )
  {
    var result = await this.prismaService.student_barcode.update( {
      where: {
        ID: id,
      },
      data: updateStudentBarCodeteDto,
    } );
    return result;
  }

  async remove ( id: number )
  {
    var result = await this.prismaService.student_barcode.delete( {
      where: {
        ID: id,
      },
    } );
    return result;
  }
}
