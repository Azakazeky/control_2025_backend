import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import {
  AssignProctorToExamRoomDto,
  CreateProctorDto,
} from './dto/create-proctor.dto';
import { UpdateProctorDto } from './dto/update-proctor.dto';

@Injectable()
export class ProctorService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Creates a new proctor.
   * @param createProctorDto the proctor data to be created
   * @param createdBy the user id of the user creating the proctor
   * @param schoolId the school id of the school the proctor belongs to
   * @returns the newly created proctor
   */
  async create(
    createProctorDto: CreateProctorDto,
    createdBy: number,
    schoolId: number,
  ) {
    var result = await this.prismaService.proctors.create({
      data: {
        Full_Name: createProctorDto.Full_Name,
        User_Name: createProctorDto.User_Name,
        Password: createProctorDto.Password,
        School_Id: schoolId,
        Created_By: createdBy,
      },
    });
    return result;
  }

  /**
   * Assigns a proctor to an exam mission.
   * @param assignProctorToExamRoomDto the proctor and exam room data to be assigned
   * @param createdBy the user id of the user who assigned the proctor
   * @returns the newly assigned proctor in room
   */
  async assignProctorToExamMission(
    assignProctorToExamRoomDto: AssignProctorToExamRoomDto,
    createdBy: number,
  ) {
    var result = await this.prismaService.proctor_in_room.create({
      data: { ...assignProctorToExamRoomDto, Created_By: createdBy },
      include: {
        proctors: true,
      },
    });
    return result;
  }

  /**
   * Unassigns a proctor from an exam room.
   * @param id the id of the proctor in room to be unassigned
   * @returns the unassigned proctor in room
   */
  async unassignProctorFromExamRoom(id: number, period: boolean) {
    var result = await this.prismaService.proctor_in_room.delete({
      where: {
        ID: id,
        Period: period,
      },
      include: {
        proctors: true,
      },
    });
    return result;
  }

  /**
   * Retrieves all proctors associated with a school.
   * @param schoolId the school id
   * @returns all proctors associated with the school
   */
  async findAllBySchoolId(schoolId: number) {
    var results = await this.prismaService.proctors.findMany({
      where: {
        School_Id: schoolId,
        isFloorManager: null,
      },
    });
    return results;
  }

  /**
   * Retrieves all proctors associated with an exam room.
   * @param examRoomId the exam room id
   * @param month the month to filter by
   * @param year the year to filter by
   * @returns all proctors associated with the exam room
   */
  async findAllByExamRoomId(examRoomId: number, month: string, year: string) {
    var results = await this.prismaService.proctor_in_room.findMany({
      where: {
        exam_room_ID: examRoomId,
        Month: month,
        Year: year,
      },
      include: {
        proctors: true,
      },
    });
    return results;
  }

  /**
   * Retrieves a single proctor by id.
   * @param id the proctor id
   * @returns the proctor with the specified id
   */
  async findOne(id: number) {
    var result = await this.prismaService.proctors.findUnique({
      where: {
        ID: id,
      },
    });
    return result;
  }

  /**
   * Updates a proctor.
   * @param id the proctor id
   * @param updateProctorDto the proctor data to be updated
   * @param updatedBy the user id of the user who updated the proctor
   * @returns the updated proctor
   */
  async update(
    id: number,
    updateProctorDto: UpdateProctorDto,
    updatedBy: number,
  ) {
    var result = this.prismaService.proctors.update({
      where: {
        ID: id,
      },
      data: {
        ...updateProctorDto,
        Updated_By: updatedBy,
        Updated_At: new Date().toISOString(),
      },
    });
    return result;
  }

  /**
   * Removes a proctor.
   * @param id the proctor id
   * @returns the deleted proctor
   */
  async remove(id: number) {
    var result = await this.prismaService.proctors.delete({
      where: {
        ID: id,
      },
    });
    return result;
  }

  /**
   * Retrieves all exam missions associated with a proctor and a control mission.
   * @param proctorId the proctor id
   * @param controlMissionId the control mission id
   * @returns all exam missions associated with the proctor and control mission
   */
  async findExamMiisonsByProctorIdAndControlMissionId(
    proctorId: number,
    controlMissionId: number,
  ) {
    var proctorData = await this.prismaService.proctors.findUnique({
      where: {
        ID: proctorId,
      },
    });

    var result: any = [];
    ////  sc
    if (proctorData.isFloorManager == 'School Director') {
      var data = await this.prismaService.exam_room_has_exam_mission.findMany({
        where: {
          exam_room: {
            control_mission: {
              ID: controlMissionId,
              Active: 1,
            },
            school_class: {
              Schools_ID: proctorData.School_Id,
            },
          },
          AND: {
            exam_mission: {
              end_time: {
                gte: new Date(),
              },
            },
          },
        },
        select: {
          exam_mission: {
            select: {
              ID: true,
              duration: true,
              start_time: true,
              end_time: true,
              Month: true,
              Year: true,
              Period: true,
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
          },
          exam_room: {
            select: {
              ID: true,
              Name: true,
              Stage: true,
              school_class: {
                select: {
                  Name: true,
                },
              },
            },
          },
        },
      });
      data.forEach((exam) => {
        var index = result.findIndex(
          (r) =>
            r.exam_room.ID === exam.exam_room.ID &&
            r.Year == exam.exam_mission.Year &&
            r.Month == exam.exam_mission.Month &&
            r.Period == exam.exam_mission.Period,
        );
        if (index == -1) {
          (exam as any).Month = exam.exam_mission.Month;
          (exam as any).Year = exam.exam_mission.Year;
          (exam as any).Period = exam.exam_mission.Period;
          (exam as any).examMissions = [exam.exam_mission];
          exam.exam_mission = undefined;
          result.push(exam);
        } else {
          result[index].examMissions.push(exam.exam_mission);
        }
      });
    } else if (proctorData.isFloorManager) {
      var data = await this.prismaService.exam_room_has_exam_mission.findMany({
        where: {
          exam_room: {
            control_mission: {
              ID: controlMissionId,
              Active: 1,
            },
            Stage: proctorData.isFloorManager,
            school_class: {
              Schools_ID: proctorData.School_Id,
            },
          },
          AND: {
            exam_mission: {
              end_time: {
                gte: new Date(),
              },
            },
          },
        },
        select: {
          exam_mission: {
            select: {
              ID: true,
              duration: true,
              start_time: true,
              end_time: true,
              Month: true,
              Year: true,
              Period: true,
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
          },
          exam_room: {
            select: {
              ID: true,
              Name: true,
              Stage: true,
              school_class: {
                select: {
                  Name: true,
                },
              },
            },
          },
        },
      });
      data.forEach((exam) => {
        var index = result.findIndex(
          (r) =>
            r.exam_room.ID === exam.exam_room.ID &&
            r.Year == exam.exam_mission.Year &&
            r.Month == exam.exam_mission.Month &&
            r.Period == exam.exam_mission.Period,
        );
        if (index == -1) {
          (exam as any).Month = exam.exam_mission.Month;
          (exam as any).Year = exam.exam_mission.Year;
          (exam as any).Period = exam.exam_mission.Period;
          (exam as any).examMissions = [exam.exam_mission];
          exam.exam_mission = undefined;
          result.push(exam);
        } else {
          result[index].examMissions.push(exam.exam_mission);
        }
      });
    }

    ///  proctor
    else {
      var proctorInRoom = await this.prismaService.proctor_in_room.findMany({
        where: {
          proctors_ID: proctorId,
        },
      });
      for (let i = 0; i < proctorInRoom.length; i++) {
        const mission = proctorInRoom[i];
        var nextExam =
          await this.prismaService.exam_room_has_exam_mission.findMany({
            where: {
              exam_room: {
                control_mission: {
                  ID: controlMissionId,
                  Active: 1,
                },
                ID: mission.exam_room_ID,
              },
              AND: {
                exam_mission: {
                  Year: mission.Year,
                  Month: mission.Month,
                  Period: mission.Period,
                  end_time: {
                    gte: new Date(),
                  },
                },
              },
            },
            select: {
              exam_mission: {
                select: {
                  ID: true,
                  duration: true,
                  start_time: true,
                  end_time: true,
                  Month: true,
                  Year: true,
                  Period: true,
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
              },
              exam_room: {
                select: {
                  ID: true,
                  Name: true,
                  Stage: true,
                  school_class: {
                    select: {
                      Name: true,
                    },
                  },
                },
              },
            },
          });

        nextExam.forEach((exam) => {
          var index = result.findIndex(
            (r) =>
              r.exam_room.ID === exam.exam_room.ID &&
              r.Year == exam.exam_mission.Year &&
              r.Month == exam.exam_mission.Month &&
              r.Period == exam.exam_mission.Period,
          );
          if (index == -1) {
            (exam as any).Month = exam.exam_mission.Month;
            (exam as any).Year = exam.exam_mission.Year;
            (exam as any).Period = exam.exam_mission.Period;
            (exam as any).examMissions = [exam.exam_mission];
            exam.exam_mission = undefined;
            result.push(exam);
          } else {
            result[index].examMissions.push(exam.exam_mission);
          }
        });
      }
    }

    return result;
  }

  /**
   * Validates a proctor's principle password.
   * @param proctorId the proctor id
   * @param principlePassword the principle password to be validated
   * @returns true if the password is valid, otherwise throws an error
   */
  async validatePrinciplePassword(
    proctorId: number,
    principlePassword: string,
  ) {
    var proctorData = await this.prismaService.proctors.findUnique({
      where: {
        ID: proctorId,
      },
    });
    if (proctorData.Password == principlePassword) {
      return true;
    } else {
      throw new HttpException('Wrong Password', HttpStatus.NOT_ACCEPTABLE);
    }
  }

  /**
   * Retrieves all control missions associated with a proctor.
   * @param proctorId the proctor id
   * @returns all control missions associated with the proctor
   */
  async findAllControlMissionsByProctorId(proctorId: number) {
    var proctorData = await this.prismaService.proctors.findUnique({
      where: {
        ID: proctorId,
      },
    });

    if (proctorData.isFloorManager == 'School Director') {
      var results = await this.prismaService.control_mission.findMany({
        where: {
          Schools_ID: proctorData.School_Id,
          Active: 1,
        },
      });

      return results;
    } else if (proctorData.isFloorManager) {
      var results = await this.prismaService.control_mission.findMany({
        where: {
          Schools_ID: proctorData.School_Id,
          Active: 1,
          exam_room: {
            some: {
              Stage: proctorData.isFloorManager,
            },
          },
        },
      });
      return results;
    } else {
      var results = await this.prismaService.control_mission.findMany({
        where: {
          Active: 1,
          exam_room: {
            some: {
              proctor_in_room: {
                some: {
                  proctors_ID: proctorId,
                },
              },
            },
          },
        },
      });
      return results;
    }
  }
}
