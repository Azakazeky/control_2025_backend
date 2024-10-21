import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Creates a new student.
   * @param createStudentDto the data of the student to be created
   * @param createdBy the ID of the user who created the student
   * @param schoolId the ID of the school the student belongs to
   * @returns the newly created student
   * @throws {BadRequestException} if the student already exists in another school
   */
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
          `${createStudentDto.First_Name} ${createStudentDto.Second_Name} ${createStudentDto.Third_Name} added by ${studentExistsInAnotherSchool.user.Full_Name} in ${studentExistsInAnotherSchool.schools.Name} (${studentExistsInAnotherSchool.schools.school_type.Name}) at ${studentExistsInAnotherSchool.Created_At}`,
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

  /**
   * Retrieves the students grades for a given control mission and school id.
   * @param controlMissionId The control mission id.
   * @param schoolId The school id.
   * @returns An object containing the exam room, student seat numbers, subjects and grades.
   */
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
            student_seat_numbers: {
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
                        exam_mission: {
                          select: {
                            Subjects_ID: true,
                          },
                        },
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

  /**
   * Retrieves all students associated with a given control mission and school.
   * @param controlMissionId the control mission id
   * @param schoolId the school id
   * @returns an array of students associated with the given control mission and school
   */
  async findAllByControlMissionId(controlMissionId: number, schoolId: number) {
    var results = await this.prismaService.student.findMany({
      where: {
        Schools_ID: schoolId,
        student_seat_numbers: {
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
        student_seat_numbers: {
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

  /**
   * Creates multiple students.
   * @param createStudentDto the data of the students to be created
   * @param createdBy the ID of the user who created the students
   * @param schoolId the ID of the school the students belong to
   * @returns the newly created students
   * @throws {BadRequestException} if any of the students already exist in another school
   */
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
          Blb_Id: true,
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
    const students: Array<any> = [];
    if (studentExistsInAnotherSchool.length > 0) {
      for (var i = 0; i < studentExistsInAnotherSchool.length; i++) {
        const student = {};
        student['Blb_Id'] = studentExistsInAnotherSchool[i].Blb_Id;
        student['Created_At'] = studentExistsInAnotherSchool[i].Created_At;
        student['user'] = studentExistsInAnotherSchool[i].user.Full_Name;
        student['schools'] = studentExistsInAnotherSchool[i].schools.Name;
        student['school_type'] =
          studentExistsInAnotherSchool[i].schools.school_type.Name;
        student['First_Name'] = createStudentDto.find(
          (student) =>
            student.Blb_Id === studentExistsInAnotherSchool[i].Blb_Id,
        ).First_Name;
        student['Second_Name'] = createStudentDto.find(
          (student) =>
            student.Blb_Id === studentExistsInAnotherSchool[i].Blb_Id,
        ).Second_Name;
        student['Third_Name'] = createStudentDto.find(
          (student) =>
            student.Blb_Id === studentExistsInAnotherSchool[i].Blb_Id,
        ).Third_Name;
        students.push(student);
      }
      throw new HttpException(
        'Some Students already exists in another school. The following students already exist: ' +
          students
            .map((student) => {
              return `${student.First_Name} ${student.Second_Name} ${student.Third_Name} added by ${student.user} in ${student.schools} (${student.school_type}) at ${student.Created_At}`;
            })
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

  /**
   * Retrieves all students in the database.
   * @returns All students in the database.
   */
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

  /**
   * Retrieves all students in the given cohort.
   * @param cohortId The cohort id.
   * @returns All students in the given cohort.
   */
  async findAllByCohortId(cohortId: number) {
    var results = await this.prismaService.student.findMany({
      where: {
        Cohort_ID: cohortId,
      },
    });
    return results;
  }
  /**
   * Retrieves all students in the given class.
   * @param classId The class id.
   * @returns All students in the given class.
   */
  async findAllByClassId(classId: number) {
    var results = await this.prismaService.student.findMany({
      where: {
        School_Class_ID: classId,
      },
    });
    return results;
  }
  /**
   * Retrieves all students in the given class and cohort.
   * @param classId The class id.
   * @param cohortId The cohort id.
   * @returns All students in the given class and cohort.
   */
  async findAllByClassIdAndCohortId(classId: number, cohortId: number) {
    var results = await this.prismaService.student.findMany({
      where: {
        School_Class_ID: classId,
        Cohort_ID: cohortId,
      },
    });
    return results;
  }

  /**
   * Retrieves all exams a student has taken in the past 10 days or will take in the next 10 days.
   * @param studentId The student id.
   * @returns An object containing the exam mission id, name, start time, end time, duration, exam room id, exam room name, subject id and subject name.
   */
  async findStudentExams(studentId: number) {
    var startDate = new Date(
      new Date().setUTCDate(new Date().getUTCDate() - 10),
    );

    var endDate = new Date(new Date().setUTCDate(new Date().getUTCDate() + 10));

    var results = await this.prismaService.student_barcode.findMany({
      where: {
        Student_ID: studentId,
        student_seat_numbers: {
          Active: 1,
          control_mission: {
            Active: 1,
          },
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

  /**
   * Retrieves all students associated with a given school that are not associated with a given control mission.
   * @param controlMissionId the control mission id
   * @param schoolId the school id
   * @returns an array of students associated with the school that are not associated with the control mission. Each result includes the cohort, school class and grades.
   */
  async findAllExcludedByControlMissionId(
    controlMissionId: number,
    schoolId: number,
  ) {
    var results = await this.prismaService.student.findMany({
      where: {
        Schools_ID: schoolId,
        student_seat_numbers: {
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

  /**
   * Retrieves all students associated with a given school.
   * @param schoolId the school id
   * @returns an array of students associated with the school. Each result includes the cohort, school class and grades.
   */
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

  /**
   * Retrieves all students associated with a given school, class and cohort.
   * @param schoolId the school id
   * @param classId the class id
   * @param cohortId the cohort id
   * @returns an array of students associated with the given school, class and cohort
   */
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

  /**
   * Retrieves a single student by its id.
   * @param id The id of the student to retrieve.
   * @returns The student with the given id.
   * @throws {NotFoundException} If no student with the given
   * id is found.
   */
  async findOne(id: number) {
    var result = await this.prismaService.student.findUnique({
      where: {
        ID: id,
      },
    });
    return result;
  }

  /**
   * Updates a student.
   * @param id The id of the student to be updated.
   * @param updateStudentDto The student data to be updated.
   * @param updatedBy The id of the user who made the update.
   * @returns The updated student.
   */
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
  /**
   * Updates multiple students.
   * @param updateStudentDto An array of student data to be updated.
   * @param updatedBy The id of the user who made the update.
   * @returns An array of updated students.
   */
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

  /**
   * Deletes a student by its id.
   * @param id The id of the student to be deleted.
   * @returns The deleted student.
   */
  async remove(id: number) {
    var result = await this.prismaService.student.delete({
      where: {
        ID: id,
      },
    });
    return result;
  }

  /**
   * Activates a student by its id.
   * @param id The id of the student to be activated.
   * @returns The activated student.
   */
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

  /**
   * Deactivates a student by its id.
   * @param id The id of the student to be deactivated.
   * @returns The deactivated student.
   */
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

  /**
   * Marks a student as cheating by its barcode.
   * @param barcode The barcode of the student to be marked as cheating.
   * @returns The updated student.
   * @throws {NotFoundException} If no student with the given barcode is found.
   */
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

  /**
   * Unmarks a student as cheating by its barcode.
   * @param barcode The barcode of the student to be unmarked as cheating.
   * @param proctorId The id of the proctor performing this action.
   * @returns The updated student.
   * @throws {HttpException} If the user is not a floor manager.
   */
  async unmarkAsCheating(barcode: string, proctorId: number) {
    var proctor = await this.prismaService.proctors.findUnique({
      where: {
        ID: proctorId,
      },
    });
    if (proctor.isFloorManager) {
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
