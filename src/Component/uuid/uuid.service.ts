import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { ExamMissionService } from '../Mission/exam_mission/exam_mission.service';
import { CreateUuidDto } from './dto/create-uuid.dto';
import { UpdateUuidDto } from './dto/update-uuid.dto';

@Injectable()
export class UuidService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly examMissionService: ExamMissionService,
    private readonly appService: AppService,
  ) {}

  /**
   * Creates a new uuid.
   * @param createUuidDto the uuid data to be created
   * @param createdBy the user id of the user who created the uuid
   * @returns the newly created uuid
   */
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

  /**
   * Retrieves all uuids.
   * @returns an array of uuids
   */
  async findAll() {
    var results = await this.prismaService.uuid.findMany({});

    return results;
  }

  /**
   * Retrieves a single uuid by its id.
   * @param id the uuid id
   * @returns the uuid with the specified id
   */
  async findOne(id: number) {
    var result = await this.prismaService.uuid.findUnique({
      where: {
        ID: id,
      },
    });
    return result;
  }

  /**
   * Updates a uuid.
   * @param id the uuid id
   * @param updateUuidDto the uuid data to be updated
   * @param updatedBy the user id of the user who updated the uuid
   * @returns the updated uuid
   */
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

  /**
   * Removes a uuid.
   * @param id the uuid id
   * @returns the deleted uuid
   * @throws {NotFoundException} If no uuid with the given id is found.
   */
  async remove(id: number) {
    var result = await this.prismaService.uuid.delete({
      where: {
        ID: id,
      },
    });
    return result;
  }

  async activateMany(studentIds: string, updatedBy: number) {
    var uuids = await this.prismaService.uuid.groupBy({
      by: ['student_id'],
      where: {
        student_id: {
          in: JSON.parse(studentIds).map((id) => '' + id),
        },
      },
      _max: {
        CreatedAt: true,
      },
    });
    var result = await this.prismaService.uuid.updateMany({
      where: {
        student_id: {
          in: JSON.parse(studentIds).map((id) => '' + id),
        },
        CreatedAt: {
          in: uuids.map((e) => e._max.CreatedAt),
        },
      },
      data: {
        active: 1,
        Updated_By: updatedBy,
        UpdatedAt: new Date(),
      },
    });

    return result;
  }

  /**
   * Validates a student using their uuid and exam mission id.
   * @param uuid the uuid id
   * @param examMissionId the exam mission id
   * @returns the result of the validation
   */
  async validateStudent(uuid: number, examMissionId: number, barcode: string) {
    // const now = new Date();

    // Desired offset in hours (e.g., +3:00)
    // const desiredOffset = 3;

    // Create a new Date object adjusted by the offset difference in milliseconds
    // const adjustedDate = new Date(now.getTime() + desiredOffset * 60000);

    // Format the adjusted date in UTC
    // const year = adjustedDate.getUTCFullYear();
    // const month = String(adjustedDate.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
    // const day = String(adjustedDate.getUTCDate()).padStart(2, '0');
    // const hours = String(adjustedDate.getUTCHours()).padStart(2, '0');
    // const minutes = String(adjustedDate.getUTCMinutes()).padStart(2, '0');
    // const seconds = String(adjustedDate.getUTCSeconds()).padStart(2, '0');

    // const localIsoString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;

    const serverTime = this.appService.addHours();

    var studentUUID = await this.prismaService.uuid.findFirst({
      where: {
        ID: uuid,
      },
      select: {
        student_id: true,
        active: true,
      },
    });

    if (studentUUID.active === 0) {
      throw new HttpException(
        'Please ask your proctor to activate yor exam first',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prismaService.student_barcode.update({
      where: {
        Barcode: barcode,
      },
      data: {
        AttendanceStatusId: 13,
      },
    });

    var examMissionResult = await this.prismaService.exam_mission.findFirst({
      where: {
        ID: examMissionId,
      },
    });
    if (
      examMissionResult.start_time > new Date(serverTime) &&
      examMissionResult.end_time < new Date(serverTime)
    ) {
      throw new HttpException(
        "Exam didn't start yet, please try again later",
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    if (examMissionResult && studentUUID.active == 1) {
      return this.examMissionService.getExamFileDataToStudent(
        examMissionResult.pdf,
      );
    }

    throw new HttpException(
      "Couldn't validate, please try again later",
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
