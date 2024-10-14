import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateStudentBarcodeDto } from './dto/create-student_barcode.dto';
import { UpdateStudentBarcodeDto } from './dto/update-student_barcode.dto';

@Injectable()
export class StudentBarcodesService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Creates a new student barcode.
   * @param createStudentBarCodeteDto The new student barcode data to be created.
   * @returns The newly created student barcode.
   */
  async create(createStudentBarCodeteDto: CreateStudentBarcodeDto) {
    var result = await this.prismaService.student_barcode.create({
      data: createStudentBarCodeteDto,
    });
    return result;
  }
  /**
   * Creates multiple new student barcodes.
   * @param createStudentBarCodeteDto The new student barcodes data to be created.
   * @returns The newly created student barcodes.
   */
  async createMany(createStudentBarCodeteDto: CreateStudentBarcodeDto[]) {
    var result = await this.prismaService.student_barcode.createMany({
      data: createStudentBarCodeteDto,
    });
    return result;
  }

  // TODO? get students count with and without degrees and total count by control mission id

  /**
   * Retrieves all student barcodes in the database, filtered by active student seat numbers.
   * @returns All student barcodes in the database, filtered by active student seat numbers.
   */
  async findAll() {
    var results = await this.prismaService.student_barcode.findMany({
      where: {
        student_seat_numbers: {
          Active: 1,
        },
      },
    });

    return results;
  }

  /**
   * Retrieves all student barcodes associated with an exam mission.
   * @param examMissionId The exam mission id.
   * @returns All student barcodes associated with the exam mission.
   */
  async findAllByExamMissionId(examMissionId: number) {
    var results = await this.prismaService.student_barcode.findMany({
      where: {
        Exam_Mission_ID: examMissionId,
        // Only include active student seat numbers
        student_seat_numbers: {
          Active: 1,
        },
      },
    });
    return results;
  }

  /**
   * Retrieves all student barcodes associated with a student.
   * @param studentId The student id.
   * @returns All student barcodes associated with the student.
   */
  async findAllByStudentId(studentId: number) {
    var results = await this.prismaService.student_barcode.findMany({
      where: {
        Student_ID: studentId,
        // Only include active student seat numbers
        student_seat_numbers: {
          Active: 1,
        },
      },
    });
    return results;
  }

  /**
   * Retrieves all student barcodes associated with a student and exam mission.
   * @param studentId The student id.
   * @param examMissionId The exam mission id.
   * @returns All student barcodes associated with the student and exam mission.
   */
  async findAllByStudentIdAndExamMissionId(
    studentId: number,
    examMissionId: number,
  ) {
    var results = await this.prismaService.student_barcode.findMany({
      where: {
        Student_ID: studentId,
        Exam_Mission_ID: examMissionId,
        // Only include active student seat numbers
        student_seat_numbers: {
          Active: 1,
        },
      },
    });
    return results;
  }

  /**
   * Retrieves a student barcode by its barcode.
   * @param barcode The barcode of the student barcode to retrieve.
   * @returns The student barcode with the given barcode.
   * @throws {NotFoundException} If no student barcode with the given
   * barcode is found.
   * @throws {HttpException} If the barcode is found but it is related to
   * an exam mission that is not published, or if the student is not assigned
   * to a seat.
   */
  async findByBarcode(barcode: string) {
    var result = await this.prismaService.student_barcode.findUnique({
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
    });
    if (!result)
      throw new HttpException(
        'Barcode not found. Please make sure that the barcode is correct.',
        HttpStatus.NOT_FOUND,
      );
    var studentsDegreesCounter =
      await this.prismaService.student_barcode.findMany({
        where: {
          Exam_Mission_ID: result.Exam_Mission_ID,
        },
        select: {
          StudentDegree: true,
        },
      });
    result['StudentsWithoutDegrees'] = studentsDegreesCounter.filter(
      (item) => item.StudentDegree == null,
    ).length;
    result['StudentsWithDegrees'] = studentsDegreesCounter.filter(
      (item) => item.StudentDegree != null,
    ).length;
    result['TotalStudents'] = studentsDegreesCounter.length;
    return result;
  }
  /**
   * Retrieves a single student barcode by its id.
   * @param id The id of the student barcode to retrieve.
   * @returns The student barcode with the given id.
   * @throws {NotFoundException} If no student barcode with the given
   * id is found.
   */
  async findOne(id: number) {
    var result = await this.prismaService.student_barcode.findUnique({
      where: {
        ID: id,
      },
    });
    return result;
  }

  /**
   * Retrieves all student barcodes associated with a given exam room and exam mission.
   * @param examRoomId The exam room id.
   * @param examMissionId The exam mission id.
   * @returns An object with two properties: 'subject' and 'student_barcodes'.
   * The 'subject' property is an array of subjects associated with the exam mission.
   * The 'student_barcodes' property is an array of student barcodes associated with the exam room and exam mission.
   * Each student barcode includes the student details, seat number and attendance status.
   */

  async findStudentBarcodesByExamRoomIdAndExamMissionId(
    examRoomId: number,
    examMissionId: number,
  ) {
    var result = await this.prismaService.exam_room_has_exam_mission.findMany({
      where: {
        exam_room_ID: examRoomId,
        exam_mission_ID: examMissionId,
        exam_mission: {
          control_mission: {
            Active: 1,
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
                student_seat_numbers: {
                  where: {
                    Exam_Room_ID: examRoomId,
                    Active: 1,
                  },
                  select: {
                    student_barcode: {
                      where: {
                        Exam_Mission_ID: examMissionId,
                      },
                      select: {
                        ID: true,
                        Barcode: true,
                        isCheating: true,
                        AttendanceStatusId: true,
                        student_seat_numbers: {
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
    });
    return {
      subject: result.map((exam_room_has_exam_mission) => {
        return exam_room_has_exam_mission.exam_mission.subjects;
      })[0],
      student_barcodes: result
        .map((exam_room_has_exam_mission) => {
          return exam_room_has_exam_mission.exam_mission.control_mission.student_seat_numbers
            .map((student_seat_number) => {
              return student_seat_number.student_barcode;
            })
            .flat();
        })
        .flat(),
    };
  }
  /**
   * Retrieves all student barcodes associated with a given exam room,
   * filtered by month, year and period.
   * @param examRoomId The exam room id.
   * @param month The month to filter by.
   * @param year The year to filter by.
   * @param period Whether to filter by period or not.
   * @returns An object containing the subject and an array of student barcodes
   * associated with the given exam room, filtered by month, year and period.
   */
  async findStudentBarcodesByExamRoomId(
    examRoomId: number,
    month: string,
    year: string,
    period: boolean,
  ) {
    var result = await this.prismaService.exam_room_has_exam_mission.findMany({
      where: {
        exam_room_ID: examRoomId,
        AND: {
          exam_mission: {
            Month: month,
            Year: year,
            Period: period,
            control_mission: {
              Active: 1,
            },
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
                student_seat_numbers: {
                  where: {
                    Active: 1,
                  },
                  select: {
                    student_barcode: {
                      select: {
                        ID: true,
                        Barcode: true,
                        student_seat_numbers: {
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
    });
    return {
      subject: result.map((exam_room_has_exam_mission) => {
        return exam_room_has_exam_mission.exam_mission.subjects;
      }),
      student_barcodes: result
        .map((exam_room_has_exam_mission) => {
          return exam_room_has_exam_mission.exam_mission.control_mission.student_seat_numbers
            .map((student_seat_number) => {
              return student_seat_number.student_barcode;
            })
            .flat();
        })
        .flat(),
    };
  }

  /**
   * Updates a student barcode.
   * @param id The id of the student barcode to be updated.
   * @param updateStudentBarcodeDto The student barcode data to be updated.
   * @returns The updated student barcode.
   */
  async update(id: number, updateStudentBarCodeteDto: UpdateStudentBarcodeDto) {
    var result = await this.prismaService.student_barcode.update({
      where: {
        ID: id,
      },
      data: updateStudentBarCodeteDto,
    });
    return result;
  }

  /**
   * Deletes a student barcode by its id.
   * @param id The id of the student barcode to be deleted.
   * @returns The deleted student barcode.
   */
  async remove(id: number) {
    var result = await this.prismaService.student_barcode.delete({
      where: {
        ID: id,
      },
    });
    return result;
  }
}
