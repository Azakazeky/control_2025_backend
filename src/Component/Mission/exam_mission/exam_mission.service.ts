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

  async create(createExamMissionteDto: CreateExamMissionDto) {
    var unAssignedStudents: Array<CreateStudentDto> =
      new Array<CreateStudentDto>();
    var studentsBarcode: Array<CreateStudentBarcodeDto> =
      new Array<CreateStudentBarcodeDto>();
    var examRoomsIds = new Set<number>();
    var studentSeatNumbers =
      await this.prismaService.student_seat_numnbers.findMany({
        where: {
          Control_Mission_ID: createExamMissionteDto.Control_Mission_ID,
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
        'There are no students in this mission. Please add students first.',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    for (let index = 0; index < studentSeatNumbers.length; index++) {
      if (
        studentSeatNumbers[index].student.cohort.cohort_has_subjects
          .map((cohort_has_subject) => cohort_has_subject.Subjects_ID)
          .includes(createExamMissionteDto.Subjects_ID) == false
      ) {
        studentSeatNumbers.splice(index, 1);
      } else if (studentSeatNumbers[index].Class_Desk_ID == null) {
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

    examRoomsIds = new Set(
      studentSeatNumbers.map(
        (studentSeatNumber) => studentSeatNumber.exam_room.ID,
      ),
    );

    var result = await this.prismaService.exam_mission.create({
      data: createExamMissionteDto,
      include: {
        control_mission: {
          select: {
            Schools_ID: true,
          },
        },
      },
    });

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
        student_seat_numnbers_ID: studentSeatNumbers[index].ID,
      });
    }

    await this.prismaService.$transaction([
      this.prismaService.exam_room_has_exam_mission.createMany({
        data: Array.from(examRoomsIds).map((examRoomId) => ({
          exam_room_ID: examRoomId,
          exam_mission_ID: result.ID,
        })),
      }),
      this.prismaService.student_barcode.createMany({
        data: studentsBarcode,
      }),
    ]);

    return result;
  }

  async findAll() {
    var results = await this.prismaService.exam_mission.findMany({});

    return results;
  }

  // TODO? do we need this?
  async findAllByControlMissionId(controlMissionId: number) {
    var results = await this.prismaService.exam_mission.findMany({
      where: {
        Control_Mission_ID: controlMissionId,
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

  // TODO? do we need this?
  async findAllBySubjectId(subjectId: number) {
    var results = await this.prismaService.exam_mission.findMany({
      where: {
        Subjects_ID: subjectId,
      },
    });
    return results;
  }
  // TODO? do we need this?

  async findAllBySubjectIdAndControlMissionId(
    subjectId: number,
    controlMissionId: number,
  ) {
    var results = await this.prismaService.exam_mission.findMany({
      where: {
        Subjects_ID: subjectId,
        Control_Mission_ID: controlMissionId,
      },
    });
    return results;
  }

  async findOne(id: number) {
    var result = await this.prismaService.exam_mission.findUnique({
      where: {
        ID: id,
      },
    });
    return result;
  }

  async update(id: number, updateExamMissionteDto: UpdateExamMissionDto) {
    var result = await this.prismaService.exam_mission.update({
      where: {
        ID: id,
      },
      data: updateExamMissionteDto,
    });
    return result;
  }

  async remove(id: number) {
    var result = await this.prismaService.exam_mission.delete({
      where: {
        ID: id,
      },
    });
    return result;
  }

  async activate(id: number) {
    var result = await this.prismaService.exam_mission.update({
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
    var result = await this.prismaService.exam_mission.update({
      where: {
        ID: id,
      },
      data: {
        Active: 0,
      },
    });
    return result;
  }

  async previewExambyId(id: number) {
    const exam = await this.prismaService.exam_mission.findUnique({
      where: { ID: id },
    });
    if (exam.pdf_V2) {
      return {
        A: await this.getExamFileDataTostudent(exam.pdf),
        B: await this.getExamFileDataTostudent(exam.pdf_V2),
      };
    }
    return { A: await this.getExamFileDataTostudent(exam.pdf) };
  }

  async getExamFileDataTostudent(filename: string) {
    var duration = Date.now() + 2 * 60 * 100;
    const [url] = await storage.bucket(bucketName).file(filename).getSignedUrl({
      action: 'read',
      expires: duration, // 2 minutes
    });
    console.log(url);
    return url;
  }

  async uploadExamFiles(path: string) {
    let genrated = await storage.bucket(bucketName).upload(path, {
      destination: path,
      predefinedAcl: 'publicRead',
      contentType: '',
      metadata: {
        contentType: 'application/pdf',
        contentDisposition: 'inline',
      },
    });
    const bucket = genrated[0].metadata.bucket;
    const name = genrated[0].metadata.name;
    const showedPdf = `https://storage.googleapis.com/${bucket}/${name}`;
    const download = genrated[0].metadata.mediaLink;
    return {
      fileLocation: showedPdf,
      downloadUrl: download,
      name: name,
    };
  }
}
