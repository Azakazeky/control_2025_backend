import { Storage } from '@google-cloud/storage';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateStudentDto } from 'src/Component/student/dto/create-student.dto';
import { CreateStudentBarcodeDto } from '../student_barcodes/dto/create-student_barcode.dto';
import { CreateExamMissionDto } from './dto/create-exam_mission.dto';
import { UpdateExamMissionDto } from './dto/update-exam_mission.dto';

var storage = new Storage({
  projectId: 'nis-control-4cd9d',
  keyFilename: './nis-control-bucket.json',
});
const bucketName = 'nis-control-4cd9d.appspot.com';

@Injectable()
export class ExamMissionService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Creates a new exam mission.
   * @param createExamMissionDto the exam mission data to be created
   * @param createdBy the user id of the user who created the exam mission
   * @returns the newly created exam mission
   * @throws HttpException if there are no students in the control mission that matches the request, or if some students are not assigned to a seat.
   */
  async create(createExamMissionDto: CreateExamMissionDto, createdBy: number) {
    var unAssignedStudents: Array<CreateStudentDto> =
      new Array<CreateStudentDto>();
    var studentsBarcode: Array<CreateStudentBarcodeDto> =
      new Array<CreateStudentBarcodeDto>();
    var examRoomsIds = new Set<number>();
    var studentSeatNumbers =
      await this.prismaService.student_seat_numbers.findMany({
        where: {
          Control_Mission_ID: createExamMissionDto.Control_Mission_ID,
          Grades_ID: createExamMissionDto.grades_ID,
          Active: 1,
          AND: {
            student: {
              cohort: {
                cohort_has_subjects: {
                  some: {
                    Subjects_ID: createExamMissionDto.Subjects_ID,
                  },
                },
              },
            },
          },
        },
        include: {
          student: {
            include: {
              cohort: {
                include: {
                  cohort_has_subjects: true,
                },
              },
            },
          },
          exam_room: {
            select: {
              ID: true,
            },
          },
        },
      });

    if (studentSeatNumbers.length == 0) {
      throw new HttpException(
        'There are no students in this mission That matches your request. Please make sure that you have students in your mission and that they are assigned to the correct class and grade. Or add students to your mission first.',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    for (let index = 0; index < studentSeatNumbers.length; index++) {
      if (studentSeatNumbers[index].Class_Desk_ID == null) {
        unAssignedStudents.push(studentSeatNumbers[index].student);
      }
    }
    if (unAssignedStudents.length > 0) {
      throw new HttpException(
        'Some students are not assigned to a seat. Please assign them first. The following students were not assigned: ' +
          unAssignedStudents.map(
            (student) =>
              student.First_Name +
              ' ' +
              student.Second_Name +
              ' ' +
              student.Third_Name +
              ' , ',
          ),
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    var result = await this.prismaService.exam_mission.create({
      data: { ...createExamMissionDto, Created_By: createdBy },
      include: {
        control_mission: {
          select: {
            Schools_ID: true,
          },
        },
      },
    });
    examRoomsIds = new Set(
      studentSeatNumbers.map(
        (studentSeatNumber) => studentSeatNumber.exam_room.ID,
      ),
    );
    for (let index = 0; index < studentSeatNumbers.length; index++) {
      studentsBarcode.push({
        Exam_Mission_ID: result.ID,
        Student_ID: studentSeatNumbers[index].Student_ID,
        Barcode:
          '' +
          result.control_mission.Schools_ID +
          result.Control_Mission_ID +
          result.ID +
          studentSeatNumbers[index].ID +
          index,
        student_seat_numbers_ID: studentSeatNumbers[index].ID,
      });
    }
    await this.prismaService.exam_room_has_exam_mission.createMany({
      data: Array.from(examRoomsIds).map((examRoomId) => ({
        exam_room_ID: examRoomId,
        exam_mission_ID: result.ID,
      })),
    }),
      await this.prismaService.student_barcode.createMany({
        data: studentsBarcode,
      });

    return result;
  }

  /**
   * Retrieves all active exam missions.
   * @returns an array of active exam missions
   */
  async findAll() {
    var results = await this.prismaService.exam_mission.findMany({
      where: {
        control_mission: {
          Active: 1,
        },
      },
    });

    return results;
  }

  /**
   * Retrieves all active exam missions associated with a control mission.
   * @param controlMissionId the control mission id
   * @returns an array of active exam missions associated with the control mission. Each result includes the grades and subjects associated with the exam mission.
   */
  async findAllByControlMissionId(controlMissionId: number) {
    var results = await this.prismaService.exam_mission.findMany({
      where: {
        Control_Mission_ID: controlMissionId,
        control_mission: {
          Active: 1,
        },
      },
      include: {
        grades: {
          select: {
            Name: true,
          },
        },
        subjects: {
          select: {
            Name: true,
          },
        },
      },
    });
    return results;
  }

  /**
   * Retrieves all active exam missions associated with a subject.
   * @param subjectId the subject id
   * @returns an array of active exam missions associated with the subject
   */
  async findAllBySubjectId(subjectId: number) {
    var results = await this.prismaService.exam_mission.findMany({
      where: {
        control_mission: {
          // Only include active control missions
          Active: 1,
        },
        // Filter by subject id
        Subjects_ID: subjectId,
      },
    });
    return results;
  }

  // TODO? do we need this?

  /**
   * Retrieves all active exam missions associated with a subject and control mission.
   * @param subjectId the subject id
   * @param controlMissionId the control mission id
   * @returns an array of active exam missions associated with the subject and control mission
   */
  async findAllBySubjectIdAndControlMissionId(
    subjectId: number,
    controlMissionId: number,
  ) {
    var results = await this.prismaService.exam_mission.findMany({
      where: {
        Subjects_ID: subjectId,
        Control_Mission_ID: controlMissionId,
        control_mission: {
          Active: 1,
        },
      },
    });
    return results;
  }

  /**
   * Retrieves a single exam mission by id.
   * @param id the exam mission id
   * @returns the exam mission with the specified id
   */
  async findOne(id: number) {
    var result = await this.prismaService.exam_mission.findUnique({
      where: {
        ID: id,
      },
    });
    return result;
  }

  /**
   * Updates an exam mission.
   * @param id the exam mission id
   * @param updateExamMissionDto the exam mission data to be updated
   * @param updatedBy the user id of the user who updated the exam mission
   * @returns the updated exam mission
   */
  async update(
    id: number,
    updateExamMissionDto: UpdateExamMissionDto,
    updatedBy: number,
  ) {
    var result = await this.prismaService.exam_mission.update({
      where: {
        ID: id,
      },
      data: { ...updateExamMissionDto, Updated_By: updatedBy },
    });
    return result;
  }

  /**
   * Deletes an exam mission by its id.
   * @param id the exam mission id
   * @returns the deleted exam mission
   */
  async remove(id: number) {
    var result = await this.prismaService.exam_mission.delete({
      where: {
        ID: id,
      },
    });
    return result;
  }

  /**
   * Activates an exam mission.
   * @param id the exam mission id
   * @param updatedBy the user id of the user who activated the exam mission
   * @returns the activated exam mission
   */
  async activate(id: number, updatedBy: number) {
    var result = await this.prismaService.exam_mission.update({
      where: {
        ID: id,
      },
      data: {
        Active: 1,
        Updated_By: updatedBy,
        Updated_At: new Date().toISOString(),
      },
    });
    return result;
  }

  /**
   * Deactivates an exam mission.
   * @param id the exam mission id
   * @param updatedBy the user id of the user who deactivated the exam mission
   * @returns the deactivated exam mission
   */
  async deactivate(id: number, updatedBy: number) {
    var result = await this.prismaService.exam_mission.update({
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

  /**
   * Retrieves the exam pdfs of an exam mission by its id.
   * @param id the exam mission id
   * @returns an object containing the exam pdfs with keys A and B. If the exam mission only has one pdf, only key A is present.
   */
  async previewExamById(id: number) {
    const exam = await this.prismaService.exam_mission.findUnique({
      where: { ID: id, control_mission: { Active: 1 } },
    });
    if (exam.pdf_V2) {
      return {
        A: await this.getExamFileDataToStudent(exam.pdf),
        B: await this.getExamFileDataToStudent(exam.pdf_V2),
      };
    }
    return { A: await this.getExamFileDataToStudent(exam.pdf) };
  }

  /**
   * Retrieves a signed url for a pdf file, which is accessible by students for a limited time period.
   * @param filename the filename of the pdf
   * @returns the signed url
   */
  async getExamFileDataToStudent(filename: string) {
    var duration = Date.now() + 2 * 60 * 100;
    const [url] = await storage.bucket(bucketName).file(filename).getSignedUrl({
      action: 'read',
      expires: duration, // 2 minutes
    });
    console.log(url);
    return url;
  }

  /**
   * Uploads an exam file to the Google Cloud Storage bucket and returns the pdf file location and download url.
   * @param path the path of the file to be uploaded
   * @returns an object containing the pdf file location, download url, and file name
   */
  async uploadExamFiles(path: string) {
    let generated = await storage.bucket(bucketName).upload(path, {
      destination: path,
      predefinedAcl: 'publicRead',
      contentType: '',
      metadata: {
        contentType: 'application/pdf',
        contentDisposition: 'inline',
      },
    });
    const bucket = generated[0].metadata.bucket;
    const name = generated[0].metadata.name;
    const showedPdf = `https://storage.googleapis.com/${bucket}/${name}`;
    const download = generated[0].metadata.mediaLink;
    return {
      fileLocation: showedPdf,
      downloadUrl: download,
      name: name,
    };
  }
}
