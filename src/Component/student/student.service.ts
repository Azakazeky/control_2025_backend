import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createStudentDto: CreateStudentDto,
    createdBy: number,
    schoolId: number,
  ) {
    var studentExistsInAnotherSchool =
      await this.prismaService.student.findFirst({
        where: {
          Blb_Id: createStudentDto.Blb_Id,
        },
        select: {
          First_Name: true,
          Second_Name: true,
          Third_Name: true,
          Created_At: true,
          user: {
            select: {
              Full_Name: true,
            },
          },
          schools: {
            select: {
              Name: true,
              school_type: {
                select: {
                  Name: true,
                },
              },
            },
          },
        },
      });

    if (studentExistsInAnotherSchool) {
      throw new HttpException(
        'Student already exists in another school: ' +
          `${studentExistsInAnotherSchool.First_Name} ${studentExistsInAnotherSchool.Second_Name} ${studentExistsInAnotherSchool.Third_Name} added by ${studentExistsInAnotherSchool.user.Full_Name} at ${studentExistsInAnotherSchool.Created_At} in school ${studentExistsInAnotherSchool.schools.Name} (${studentExistsInAnotherSchool.schools.school_type.Name})`,
        HttpStatus.BAD_REQUEST,
      );
    }

    var result = await this.prismaService.student.create({
      data: {
        ...createStudentDto,
        Created_By: createdBy,
        Schools_ID: schoolId,
      },
      include: {
        cohort: {
          select: {
            ID: true,
            Name: true,
          },
        },
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
    });
    return result;
  }

  async getStudentsGrades(controlMissionId: number, schoolId: number) {
    var results = await this.prismaService.control_mission.findUnique({
      where: {
        ID: controlMissionId,
        Schools_ID: schoolId,
        Active: 1,
      },
      select: {
        exam_room: {
          select: {
            ID: true,
            Name: true,
            student_seat_numnbers: {
              select: {
                ID: true,
                Seat_Number: true,
                student: {
                  select: {
                    First_Name: true,
                    Second_Name: true,
                    Third_Name: true,
                    grades: {
                      select: {
                        ID: true,
                        Name: true,
                      },
                    },
                    student_barcode: {
                      select: {
                        ID: true,
                        StudentDegree: true,
                      },
                    },
                    school_class: {
                      select: {
                        ID: true,
                        Name: true,
                      },
                    },
                    cohort: {
                      select: {
                        ID: true,
                        Name: true,
                        cohort_has_subjects: {
                          select: {
                            subjects: {
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
        exam_mission: {
          select: {
            subjects: {
              select: {
                ID: true,
                Name: true,
              },
            },
          },
        },
      },
    });

    return results;
  }

  async findAllByControlMissionId(controlMissionId: number, schoolId: number) {
    var results = await this.prismaService.student.findMany({
      where: {
        Schools_ID: schoolId,
        student_seat_numnbers: {
          some: {
            Control_Mission_ID: controlMissionId,
          },
        },
      },
      select: {
        Blb_Id: true,
        ID: true,
        First_Name: true,
        Second_Name: true,
        Third_Name: true,
        student_seat_numnbers: {
          select: {
            Seat_Number: true,
          },
        },
        cohort: {
          select: {
            ID: true,
            Name: true,
          },
        },
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
    });
    return results;
  }

  async createMany(
    createStudentDto: [CreateStudentDto],
    createdBy: number,
    schoolId: number,
  ) {
    var studentExistsInAnotherSchool =
      await this.prismaService.student.findMany({
        where: {
          Blb_Id: {
            in: createStudentDto.map((createStudentDto) => {
              return createStudentDto.Blb_Id;
            }),
          },
        },
        select: {
          First_Name: true,
          Second_Name: true,
          Third_Name: true,
          Created_At: true,
          user: {
            select: {
              Full_Name: true,
            },
          },
          schools: {
            select: {
              Name: true,
              school_type: {
                select: {
                  Name: true,
                },
              },
            },
          },
        },
      });

    if (studentExistsInAnotherSchool.length > 0) {
      throw new HttpException(
        'Student already exists in another school. The following students already exist: ' +
          studentExistsInAnotherSchool
            .map(
              (student) =>
                `${student.First_Name} ${student.Second_Name} ${student.Third_Name} added by ${student.user.Full_Name} at ${student.Created_At} in school ${student.schools.Name} (${student.schools.school_type.Name})`,
            )
            .join(', '),
        HttpStatus.BAD_REQUEST,
      );
    }

    var result = await this.prismaService.student.createMany({
      data: createStudentDto.map((createStudentDto) => {
        return {
          ...createStudentDto,
          Created_By: createdBy,
          Schools_ID: schoolId,
        };
      }),
    });
    return result;
  }

  async findAll() {
    var results = await this.prismaService.student.findMany({});

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
  async findAllByCohortId(cohortId: number) {
    var results = await this.prismaService.student.findMany({
      where: {
        Cohort_ID: cohortId,
      },
    });
    return results;
  }
  // TODO? do we need this?
  async findAllByClassId(classId: number) {
    var results = await this.prismaService.student.findMany({
      where: {
        School_Class_ID: classId,
      },
    });
    return results;
  }
  // TODO? do we need this?
  async findAllByClassIdAndCohortId(classId: number, cohortId: number) {
    var results = await this.prismaService.student.findMany({
      where: {
        School_Class_ID: classId,
        Cohort_ID: cohortId,
      },
    });
    return results;
  }

  async findStudentExams(studentId: number) {
    var startDate = new Date(
      new Date().setUTCDate(new Date().getUTCDate() - 10),
    );

    var endDate = new Date(new Date().setUTCDate(new Date().getUTCDate() + 10));

    var results = await this.prismaService.student_barcode.findMany({
      where: {
        Student_ID: studentId,
        student_seat_numnbers: {
          Active: 1,
        },
        AND: {
          exam_mission: {
            start_time: {
              gte: startDate,
            },
          },
          AND: {
            exam_mission: {
              start_time: {
                lte: endDate,
              },
            },
          },
        },
      },
      select: {
        Barcode: true,
        isCheating: true,
        AttendanceStatusId: true,
        exam_mission: {
          select: {
            control_mission: {
              select: {
                ID: true,
                Name: true,
              },
            },
            start_time: true,
            end_time: true,
            duration: true,
            exam_room_has_exam_mission: {
              where: {
                exam_room: {
                  student_seat_numnbers: {
                    some: {
                      student: {
                        ID: studentId,
                      },
                    },
                  },
                },
              },
              select: {
                exam_room: {
                  select: {
                    ID: true,
                    Name: true,
                  },
                },
              },
            },
            ID: true,
            subjects: {
              select: {
                ID: true,
                Name: true,
              },
            },
          },
        },
      },
    });
    return results;
  }

  async findAllExcludedByControlMissionId(
    controlMissionId: number,
    schoolId: number,
  ) {
    var results = await this.prismaService.student.findMany({
      where: {
        Schools_ID: schoolId,
        student_seat_numnbers: {
          every: {
            Control_Mission_ID: {
              not: controlMissionId,
            },
          },
        },
      },
      include: {
        cohort: {
          select: {
            ID: true,
            Name: true,
          },
        },
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
    });
    return results;
  }

  async findAllBySchoolId(schoolId: number) {
    var results = await this.prismaService.student.findMany({
      where: {
        Schools_ID: schoolId,
      },
      include: {
        cohort: {
          select: {
            ID: true,
            Name: true,
          },
        },
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
    });
    return results;
  }

  // TODO? do we need this?
  async findAllBySchoolIdAndClassIdAndCohortId(
    schoolId: number,
    classId: number,
    cohortId: number,
  ) {
    var results = await this.prismaService.student.findMany({
      where: {
        Schools_ID: schoolId,
        School_Class_ID: classId,
        Cohort_ID: cohortId,
      },
    });
    return results;
  }

  async findOne(id: number) {
    var result = await this.prismaService.student.findUnique({
      where: {
        ID: id,
      },
    });
    return result;
  }

  async update(
    id: number,
    updateStudentDto: UpdateStudentDto,
    updatedBy: number,
  ) {
    var result = await this.prismaService.student.update({
      where: {
        ID: id,
      },
      data: {
        ...updateStudentDto,
        Updated_By: updatedBy,
        Updated_At: new Date().toISOString(),
      },
      include: {
        cohort: {
          select: {
            ID: true,
            Name: true,
          },
        },
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
    });
    return result;
  }
  async updateMany(updateStudentDto: UpdateStudentDto[], updatedBy: number) {
    var result = updateStudentDto.map(async (item) => {
      return await this.prismaService.student.update({
        where: {
          ID: item.ID,
        },
        data: {
          ...item,
          Updated_By: updatedBy,
          Updated_At: new Date().toISOString(),
        },
        include: {
          cohort: {
            select: {
              ID: true,
              Name: true,
            },
          },
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
      });
    });
    return result;
  }

  async remove(id: number) {
    var result = await this.prismaService.student.delete({
      where: {
        ID: id,
      },
    });
    return result;
  }

  async activate(id: number) {
    var result = await this.prismaService.student.update({
      where: {
        ID: id,
      },
      data: {
        Active: 1,
      },
    });
    return result;
  }

  async deactivate(id: number) {
    var result = await this.prismaService.student.update({
      where: {
        ID: id,
      },
      data: {
        Active: 0,
      },
    });
    return result;
  }

  async markAsCheating(barcode: string) {
    var result = await this.prismaService.student_barcode.update({
      where: {
        Barcode: barcode,
      },
      data: {
        isCheating: 1,
      },
    });
    return result;
  }

  async unmarkAsCheating(barcode: string, proctorId: number) {
    var proctor = await this.prismaService.proctors.findUnique({
      where: {
        ID: proctorId,
      },
    });
    if (proctor.Division) {
      var result = await this.prismaService.student_barcode.update({
        where: {
          Barcode: barcode,
        },
        data: {
          isCheating: 0,
        },
      });
      return result;
    } else {
      throw new HttpException('You are not allowed', HttpStatus.FORBIDDEN);
    }
  }
}
