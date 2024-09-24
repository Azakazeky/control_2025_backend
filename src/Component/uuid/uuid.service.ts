import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppService } from 'src/app.service';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { EventType } from '../event-handler/enums/event_type.enum';
import { UserType } from '../event-handler/enums/user_type.enum';
import { ExamMissionService } from '../Mission/exam_mission/exam_mission.service';
import { ConnectToExamRoomDto } from '../Mission/student_barcodes/dto/connect-to-exam-room.dto';
import { CreateUuidDto } from './dto/create-uuid.dto';
import { UpdateUuidDto } from './dto/update-uuid.dto';

@Injectable()
export class UuidService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly examMissionService: ExamMissionService,
    private readonly appService: AppService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createUuidDto: CreateUuidDto, createdBy: number) {
    var result = await this.prismaService.uuid.create({
      data: {
        ...createUuidDto,
        student_id: '' + createdBy,
        Created_by: createdBy,
      },
    });
    return result;
  }

  async findAll() {
    var results = await this.prismaService.uuid.findMany({});

    return results;
  }

  async findOne(id: number) {
    var result = await this.prismaService.uuid.findUnique({
      where: {
        ID: id,
      },
    });
    return result;
  }

  async update(id: number, updateUuidDto: UpdateUuidDto, updatedBy: number) {
    var result = await this.prismaService.uuid.update({
      where: {
        ID: id,
      },
      data: {
        ...updateUuidDto,
        Updated_By: updatedBy,
        UpdatedAt: new Date(),
      },
    });
    return result;
  }

  async remove(id: number) {
    var result = await this.prismaService.uuid.delete({
      where: {
        ID: id,
      },
    });
    return result;
  }

  async activate(id: number, updatedBy: number) {
    var uuid = await this.prismaService.uuid.findMany({
      where: {
        student_id: '' + id,
      },
    });
    if (uuid.length == 0) {
      throw new HttpException(
        'student did not enter the exam',
        HttpStatus.NOT_FOUND,
      );
    }
    var result = await this.prismaService.uuid.update({
      where: {
        ID: uuid[uuid.length - 1].ID,
      },
      data: {
        active: 1,
        Updated_By: updatedBy,
        UpdatedAt: new Date(),
      },
    });

    return result;
  }

  async validateStudent(uuid: number, examMissionId: number) {
    // const now = new Date();

    // // Desired offset in hours (e.g., +3:00)
    // const desiredOffset = 3;

    // // Create a new Date object adjusted by the offset difference in milliseconds
    // const adjustedDate = new Date(now.getTime() + desiredOffset * 60000);

    // // Format the adjusted date in UTC
    // const year = adjustedDate.getUTCFullYear();
    // const month = String(adjustedDate.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
    // const day = String(adjustedDate.getUTCDate()).padStart(2, '0');
    // const hours = String(adjustedDate.getUTCHours()).padStart(2, '0');
    // const minutes = String(adjustedDate.getUTCMinutes()).padStart(2, '0');
    // const seconds = String(adjustedDate.getUTCSeconds()).padStart(2, '0');

    // const localIsoString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;

    const serverTime = this.appService.addhours();

    var studentId = await this.prismaService.uuid.findFirst({
      where: {
        ID: uuid,
      },
      select: {
        student_id: true,
      },
    });

    var studentBarcodeId = await this.prismaService.student_barcode.findFirst({
      where: {
        Student_ID: Number(studentId.student_id),
        Exam_Mission_ID: Number(examMissionId),
      },
      select: {
        ID: true,
        student_seat_numnbers: {
          select: {
            Exam_Room_ID: true,
          },
        },
      },
    });

    await this.prismaService.student_barcode.update({
      where: {
        ID: studentBarcodeId.ID,
      },
      data: {
        AttendanceStatusId: 13,
      },
    });

    var examMissionResult = await this.prismaService.exam_mission.findFirst({
      where: {
        ID: examMissionId,
        AND: {
          start_time: {
            lte: serverTime,
          },
          end_time: {
            gte: serverTime,
          },
        },
      },
    });
    var uuidResult = await this.prismaService.uuid.findFirst({
      where: {
        ID: uuid,
      },
      select: {
        ID: true,
        active: true,
      },
    });

    const connectToExamRoom: ConnectToExamRoomDto = {
      userId: Number(studentId.student_id),
      userType: UserType.Student,
      examRoomId: studentBarcodeId.student_seat_numnbers.Exam_Room_ID,
    };
    if (examMissionResult && uuidResult.active == 1) {
      this.eventEmitter.emit(EventType.connectToExamRoom, connectToExamRoom);
      return this.examMissionService.getExamFileDataToStudent(
        examMissionResult.pdf,
      );
    }

    throw new HttpException(
      'You are not allowed to access this exam yet, please contact your proctor',
      HttpStatus.EXPECTATION_FAILED,
    );
  }

  // async deactivate ( id: number )
  // {
  //   var result = await this.prismaService.uuid.update( {
  //     where: {
  //       ID: id
  //     },
  //     data: {
  // TODO? need to check type of data
  // ACtive is string not number
  //       Active:0
  //     }
  //   } );
  //   return result;
  // }
}
