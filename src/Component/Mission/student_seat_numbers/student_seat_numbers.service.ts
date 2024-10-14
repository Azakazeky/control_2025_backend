import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateStudentSeatNumberDto } from './dto/create-student_seat_number.dto';
import { UpdateStudentSeatNumberDto } from './dto/update-student_seat_number.dto';

@Injectable()
export class StudentSeatNumbersService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Creates a new student seat number.
   * @param createStudentSeatNumberDto the student seat number data to be created.
   * @returns the newly created student seat number.
   */
  async create(createStudentSeatNumbereDto: CreateStudentSeatNumberDto) {
    var result = await this.prismaService.student_seat_numbers.create({
      data: createStudentSeatNumbereDto,
    });
    return result;
  }

  /**
   * Retrieves all student seat numbers.
   * @returns all student seat numbers.
   */
  async findAll() {
    var results = await this.prismaService.student_seat_numbers.findMany({});

    return results;
  }

  /**
   * Retrieves all student seat numbers that belong to the given control mission id.
   * @param controlMissionId the control mission id.
   * @returns all student seat numbers that belong to the given control mission id.
   */
  async findAllByControlMissionId(controlMissionId: number) {
    var results = await this.prismaService.student_seat_numbers.findMany({
      where: {
        Control_Mission_ID: controlMissionId,
      },
      include: {
        student: {
          select: {
            ID: true,
            First_Name: true,
            Second_Name: true,
            Third_Name: true,
            Blb_Id: true,
            grades: {
              select: {
                ID: true,
                Name: true,
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
          },
        },
      },
    });
    return results;
  }

  /**
   * Retrieves all student seat numbers associated with a control mission and exam room.
   * @param controlMissionId the control mission id.
   * @param examRoomId the exam room id.
   * @returns all student seat numbers associated with the control mission and exam room.
   */
  async findAllByControlMissionIdAndExamRoomId(
    controlMissionId: number,
    examRoomId: number,
  ) {
    var results = await this.prismaService.student_seat_numbers.findMany({
      where: {
        Control_Mission_ID: controlMissionId,
        Exam_Room_ID: examRoomId,
      },
    });
    return results;
  }

  /**
   * Retrieves all active student seat numbers associated with an exam room.
   * @param examRoomId the exam room id.
   * @returns all active student seat numbers associated with the exam room.
   */
  async findAllByExamRoomId(examRoomId: number) {
    var results = await this.prismaService.student_seat_numbers.findMany({
      where: {
        Control_Mission_ID: examRoomId,
        Active: 1,
      },
    });
    return results;
  }

  /**
   * Retrieves all student seat numbers associated with a student.
   * @param studentId the student id.
   * @returns all student seat numbers associated with the student.
   */
  async findAllByStudentId(studentId: number) {
    var results = await this.prismaService.student_seat_numbers.findMany({
      where: {
        Student_ID: studentId,
      },
    });
    return results;
  }

  /**
   * Retrieves all student seat numbers associated with a student and exam room.
   * @param studentId the student id.
   * @param examRoomId the exam room id.
   * @returns all student seat numbers associated with the student and exam room.
   */
  async findAllByStudentIdAndExamRoomId(studentId: number, examRoomId: number) {
    var results = await this.prismaService.student_seat_numbers.findMany({
      where: {
        Student_ID: studentId,
        Exam_Room_ID: examRoomId,
      },
    });
    return results;
  }

  /**
   * Retrieves all student seat numbers associated with a student and control mission.
   * @param studentId the student id.
   * @param controlMissionId the control mission id.
   * @returns all student seat numbers associated with the student and control mission.
   */
  async findAllByStudentIdAndControlMissionId(
    studentId: number,
    controlMissionId: number,
  ) {
    var results = await this.prismaService.student_seat_numbers.findMany({
      where: {
        Student_ID: studentId,
        Control_Mission_ID: controlMissionId,
      },
    });
    return results;
  }

  /**
   * Retrieves all student seat numbers associated with a student, exam room and control mission.
   * @param studentId the student id.
   * @param examRoomId the exam room id.
   * @param controlMissionId the control mission id.
   * @returns all student seat numbers associated with the student, exam room and control mission.
   */
  async findAllByStudentIdAndExamRoomIdAndControlMissionId(
    studentId: number,
    examRoomId: number,
    controlMissionId: number,
  ) {
    var results = await this.prismaService.student_seat_numbers.findMany({
      where: {
        Student_ID: studentId,
        Control_Mission_ID: controlMissionId,
        Exam_Room_ID: examRoomId,
      },
    });
    return results;
  }

  /**
   * Retrieves a single student seat number by its id.
   * @param id the id of the student seat number to retrieve.
   * @returns the student seat number with the specified id.
   * @throws {NotFoundException} If no student seat number with the given id is found.
   */
  async findOne(id: number) {
    var result = await this.prismaService.student_seat_numbers.findUnique({
      where: {
        ID: id,
      },
    });
    return result;
  }

  /**
   * Updates a student seat number.
   * @param id the id of the student seat number to update.
   * @param updateStudentSeatNumbereDto the student seat number data to be updated.
   * @returns the updated student seat number.
   * @throws {NotFoundException} If no student seat number with the given id is found.
   */
  async update(
    id: number,
    updateStudentSeatNumbereDto: UpdateStudentSeatNumberDto,
  ) {
    var result = await this.prismaService.student_seat_numbers.update({
      where: {
        ID: id,
      },
      data: updateStudentSeatNumbereDto,
    });
    return result;
  }
  /**
   * Updates multiple student seat numbers.
   * @param updateStudentSeatNumbereDto an array of student seat number data to be updated.
   * @returns the updated student seat numbers.
   */
  async updateMany(updateStudentSeatNumbereDto: UpdateStudentSeatNumberDto[]) {
    var result = updateStudentSeatNumbereDto.map(async (seatNumber) => {
      return await this.prismaService.student_seat_numbers.update({
        where: {
          ID: seatNumber.ID,
        },
        data: seatNumber,
      });
    });
    return result;
  }

  /**
   * Deletes a student seat number by its id.
   * @param id the id of the student seat number to delete.
   * @returns the deleted student seat number.
   * @throws {NotFoundException} If no student seat number with the given id is found.
   */
  async remove(id: number) {
    var result = await this.prismaService.student_seat_numbers.delete({
      where: {
        ID: id,
      },
    });
    return result;
  }

  /**
   * Activates a student seat number by its id.
   * @param id the id of the student seat number to activate.
   * @returns the activated student seat number.
   * @throws {NotFoundException} If no student seat number with the given id is found.
   */
  async activate(id: number) {
    var result = await this.prismaService.student_seat_numbers.update({
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
   * Deactivates a student seat number by its id.
   * @param id the id of the student seat number to deactivate.
   * @returns the deactivated student seat number.
   * @throws {NotFoundException} If no student seat number with the given id is found.
   */
  async deactivate(id: number) {
    var result = await this.prismaService.student_seat_numbers.update({
      where: {
        ID: id,
      },
      data: {
        Active: 0,
      },
    });
    return result;
  }
}
