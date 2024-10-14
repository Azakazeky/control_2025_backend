import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateControlMissionDto } from './dto/create-control_mission.dto';
import { CreateStudentSeatNumberDto } from './dto/create-student-seat-numbers.dto';
import { UpdateControlMissionDto } from './dto/update-control_mission.dto';

@Injectable()
export class ControlMissionService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllDistributionByControlMissionId(controlMissionId: number) {
    var result = await this.prismaService.student_seat_numbers.findMany({
      where: {
        Control_Mission_ID: controlMissionId,
        control_mission: {
          Active: 1,
        },
      },
      select: {
        Class_Desk_ID: true,
      },
    });
    result['distributedStudents'] = result.filter(
      (item) => item.Class_Desk_ID != null,
    ).length;
    result['unDistributedStudents'] = result.filter(
      (item) => item.Class_Desk_ID == null,
    ).length;
    result['totalStudents'] = result.length;
    return {
      distributedStudents: result['distributedStudents'],
      unDistributedStudents: result['unDistributedStudents'],
      totalStudents: result['totalStudents'],
    };
  }

  async create(
    createControlMissioneDto: CreateControlMissionDto,
    createdBy: number,
    schoolId: number,
  ) {
    var result = await this.prismaService.control_mission.create({
      data: {
        ...{
          Created_By: createdBy,
          Education_year_ID: createControlMissioneDto.Education_year_ID,
          Schools_ID: schoolId,
          Name: createControlMissioneDto.Name,
          Start_Date: createControlMissioneDto.Start_Date,
          End_Date: createControlMissioneDto.End_Date,
        },
        // control_mission_has_grades: {
        //   createMany: {
        //     data: createControlMissioneDto.grades_ID.map( ( id ) => ( {
        //       grades_ID: id
        //     } ) )
        //   }
        // },
      },
    });
    return result;
  }

  async createStudentSeatNumbers(
    createStudentSeatNumberDto: CreateStudentSeatNumberDto,
  ) {
    var grades: Array<number> = new Array();
    var studentsinMission = await this.prismaService.student.findMany({
      where: {
        ID: {
          in: createStudentSeatNumberDto.Student_IDs,
        },
      },
      include: {
        schools: true,
        grades: true,
      },
    });

    var seatNumbers: Array<number> = new Array(studentsinMission.length);
    studentsinMission.sort(
      (a, b) =>
        a.grades.Name.localeCompare(b.grades.Name) ||
        a.First_Name.localeCompare(b.First_Name) ||
        a.Second_Name.localeCompare(b.Second_Name) ||
        a.Third_Name.localeCompare(b.Third_Name),
    );

    for (var i = 0; i < studentsinMission.length; i++) {
      if (i == 0) {
        seatNumbers[i] =
          parseInt(studentsinMission[i].grades.Name.split(' ')[1]) * 1000 + 1;
      } else if (
        studentsinMission[i].Grades_ID != studentsinMission[i - 1].Grades_ID
      ) {
        seatNumbers[i] =
          parseInt(studentsinMission[i].grades.Name.split(' ')[1]) * 1000 + 1;
      } else {
        seatNumbers[i] = seatNumbers[i - 1] + 1;
      }
    }

    grades = Array.from(
      new Set(studentsinMission.map((student) => student.Grades_ID)),
    );

    await this.prismaService.control_mission_has_grades.createMany({
      data: grades.map((id) => ({
        grades_ID: id,
        control_mission_ID: createStudentSeatNumberDto.controlMissionId,
      })),
    });
    var result = await this.prismaService.student_seat_numbers.createMany({
      data: studentsinMission.map((student, index) => ({
        Seat_Number: seatNumbers[index].toString(),
        Student_ID: student.ID,
        Control_Mission_ID: createStudentSeatNumberDto.controlMissionId,
        Grades_ID: student.grades.ID,
      })),
    });

    return result;
  }

  async addNewStudentsToMission(
    createStudentSeatNumberDto: CreateStudentSeatNumberDto,
  ) {
    var grades: Array<number> = new Array();
    var existingGrades =
      await this.prismaService.control_mission_has_grades.findMany({
        where: {
          control_mission_ID: createStudentSeatNumberDto.controlMissionId,
          control_mission: {
            Active: 1,
          },
        },
      });
    var studentsinMission = await this.prismaService.student.findMany({
      where: {
        ID: {
          in: createStudentSeatNumberDto.Student_IDs,
        },
      },
      include: {
        student_seat_numbers: true,
        schools: true,
        grades: true,
        cohort: {
          include: {
            cohort_has_subjects: true,
          },
        },
      },
    });

    for (var i = 0; i < studentsinMission.length; i++) {
      if (
        !grades.includes(studentsinMission[i].Grades_ID) &&
        !existingGrades
          .map((grade) => grade.grades_ID)
          .includes(studentsinMission[i].Grades_ID)
      ) {
        grades.push(studentsinMission[i].Grades_ID);
      }
    }

    var seatNumbers: Array<number> = new Array(studentsinMission.length);
    studentsinMission.sort(
      (a, b) =>
        a.grades.Name.localeCompare(b.grades.Name) ||
        a.First_Name.localeCompare(b.First_Name) ||
        a.Second_Name.localeCompare(b.Second_Name) ||
        a.Third_Name.localeCompare(b.Third_Name),
    );

    for (var i = 0; i < studentsinMission.length; i++) {
      var lastSeatInGrade =
        await this.prismaService.student_seat_numbers.findFirst({
          where: {
            Grades_ID: studentsinMission[i].grades.ID,
            Control_Mission_ID: createStudentSeatNumberDto.controlMissionId,
          },
          orderBy: {
            Seat_Number: 'desc',
          },
        });

      if (i == 0) {
        seatNumbers[i] = lastSeatInGrade
          ? parseInt(lastSeatInGrade.Seat_Number) + 1
          : parseInt(studentsinMission[i].grades.Name.split(' ')[1]) * 1000 + 1;
      } else if (
        studentsinMission[i].grades.Name != studentsinMission[i - 1].grades.Name
      ) {
        seatNumbers[i] = lastSeatInGrade
          ? parseInt(lastSeatInGrade.Seat_Number) + 1
          : parseInt(studentsinMission[i].grades.Name.split(' ')[1]) * 1000 + 1;
      } else {
        seatNumbers[i] = seatNumbers[i - 1] + 1;
      }
    }
    await this.prismaService.control_mission_has_grades.createMany({
      data: grades.map((id) => ({
        grades_ID: id,
        control_mission_ID: createStudentSeatNumberDto.controlMissionId,
      })),
    });
    var result = await this.prismaService.student_seat_numbers.createMany({
      data: studentsinMission.map((student, index) => ({
        Seat_Number: seatNumbers[index].toString(),
        Student_ID: student.ID,
        Control_Mission_ID: createStudentSeatNumberDto.controlMissionId,
        Grades_ID: student.grades.ID,
      })),
    });

    for (var i = 0; i < studentsinMission.length; i++) {
      for (
        var j = 0;
        j < studentsinMission[i].cohort.cohort_has_subjects.length;
        j++
      ) {
        var controlMissionHasExamMissionForStudent =
          await this.prismaService.exam_mission.findFirst({
            where: {
              Control_Mission_ID: createStudentSeatNumberDto.controlMissionId,
              Active: 1,
              Subjects_ID:
                studentsinMission[i].cohort.cohort_has_subjects[j].Subjects_ID,
            },
          });

        if (controlMissionHasExamMissionForStudent) {
          var lastStudentBarcode =
            await this.prismaService.student_barcode.findFirst({
              where: {
                Exam_Mission_ID: controlMissionHasExamMissionForStudent.ID,
                student_seat_numbers: {
                  Control_Mission_ID:
                    createStudentSeatNumberDto.controlMissionId,
                  Grades_ID: studentsinMission[i].grades.ID,
                },
              },
              orderBy: {
                Barcode: 'desc',
              },
            });
          if (lastStudentBarcode) {
            await this.prismaService.student_barcode.create({
              data: {
                Student_ID: studentsinMission[i].ID,
                Barcode:
                  '' +
                  studentsinMission[i].schools.ID +
                  createStudentSeatNumberDto.controlMissionId +
                  studentsinMission[i].ID +
                  studentsinMission[i].student_seat_numbers[0].ID +
                  i,
                student_seat_numnbers_ID:
                  studentsinMission[i].student_seat_numbers[0].ID,
                Exam_Mission_ID: controlMissionHasExamMissionForStudent.ID,
              },
            });
          }
        }
      }
    }

    return result;
  }

  async findAll() {
    var results = await this.prismaService.control_mission.findMany({});
    return results;
  }

  async findAllActiveByEducationYearIdAndSchoolId(
    schoolId: number,
    educationYearId: number,
  ) {
    var results = await this.prismaService.control_mission.findMany({
      where: {
        Education_year_ID: educationYearId,
        Schools_ID: schoolId,
        Active: 1,
      },
      include: {
        _count: {
          select: {
            student_seat_numbers: true,
          },
        },
      },
    });
    return results;
  }
  async findAllByEducationYearIdAndSchoolId(
    schoolId: number,
    educationYearId: number,
  ) {
    var results = await this.prismaService.control_mission.findMany({
      where: {
        Education_year_ID: educationYearId,
        Schools_ID: schoolId,
      },
      include: {
        _count: {
          select: {
            student_seat_numbers: true,
          },
        },
      },
    });
    return results;
  }

  async findAllBySchoolId(schoolId: number) {
    var results = await this.prismaService.control_mission.findMany({
      where: {
        Schools_ID: schoolId,
        Active: 1,
      },
    });
    return results;
  }

  async findGradesByCMID(cmid: number) {
    var results = await this.prismaService.control_mission.findUnique({
      where: {
        ID: cmid,
        Active: 1,
      },
      select: {
        control_mission_has_grades: {
          include: {
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

    return results.control_mission_has_grades.map((grade) => grade.grades);
  }

  async findAllByEducationYearId(educationYearId: number) {
    var results = await this.prismaService.control_mission.findMany({
      where: {
        Education_year_ID: educationYearId,
        Active: 1,
      },
    });
    return results;
  }

  async findOne(id: number) {
    var result = await this.prismaService.control_mission.findUnique({
      where: {
        ID: id,
        Active: 1,
      },
    });
    return result;
  }

  async update(
    id: number,
    updateControlMissioneDto: UpdateControlMissionDto,
    updatedBy: number,
  ) {
    var result = await this.prismaService.control_mission.update({
      where: {
        ID: id,
        Active: 1,
      },
      data: { ...updateControlMissioneDto, Updated_By: updatedBy },
    });
    return result;
  }

  async remove(id: number) {
    var result = await this.prismaService.control_mission.delete({
      where: {
        ID: id,
      },
    });
    return result;
  }

  async activate(id: number, updatedBy: number) {
    var result = await this.prismaService.control_mission.update({
      where: {
        ID: id,
      },
      data: {
        Active: 1,
        Updated_By: updatedBy,
      },
    });
    return result;
  }

  async deactivate(id: number, updatedBy: number) {
    var result = await this.prismaService.control_mission.update({
      where: {
        ID: id,
      },
      data: {
        Active: 0,
        Updated_By: updatedBy,
      },
    });
    return result;
  }
}
