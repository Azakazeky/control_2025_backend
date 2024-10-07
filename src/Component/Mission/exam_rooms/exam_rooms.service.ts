import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateExamRoomDto } from './dto/create-exam_room.dto';
import { UpdateExamRoomDto } from './dto/update-exam_room.dto';

@Injectable()
export class ExamRoomsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createExamRoomteDto: CreateExamRoomDto, createdBy: number) {
    var result = await this.prismaService.exam_room.create({
      data: { ...createExamRoomteDto, Created_By: createdBy },
    });
    return result;
  }

  async findAllByControlMissionId(controlMissionId: number, schoolId: number) {
    var results = await this.prismaService.exam_room.findMany({
      where: {
        Control_Mission_ID: controlMissionId,
        control_mission: {
          Active: 1,
        },
        school_class: {
          Schools_ID: schoolId,
        },
      },
      include: {
        school_class: true,
        control_mission: {
          include: {
            exam_mission: {
              include: {
                grades: true,
                subjects: true,
              },
            },
          },
        },
      },
    });

    return results;
  }

  async findAll() {
    var results = await this.prismaService.exam_room.findMany({});

    return results;
  }

  // TODO? do we need this?

  async findAllByProctorId(proctorId: number) {
    var currentDate = new Date();

    console.log(currentDate);

    var proctorInRoom = await this.prismaService.proctor_in_room.findMany({
      where: {
        proctors_ID: proctorId,
        Month: {
          gte:
            '' +
            currentDate.getUTCDate() +
            ' ' +
            (currentDate.getUTCMonth() + 1),
        },
        Year: '' + currentDate.getUTCFullYear(),
      },
      include: {
        exam_room: {
          include: {
            school_class: true,
          },
        },
        proctors: true,
      },
    });

    return proctorInRoom;
  }

  async findNextExams(proctorId: number) {
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

  async findAllByControlMissionIdForProctor(controlMissionId: number) {
    var results = await this.prismaService.exam_room.findMany({
      where: {
        Control_Mission_ID: controlMissionId,
        control_mission: {
          Active: 1,
        },
      },
      include: {
        control_mission: {
          include: {
            exam_mission: {
              include: {
                subjects: true,
                grades: true,
              },
            },
          },
        },
      },
    });
    return results;
  }

  // TODO? do we need this?
  async findAllBySchoolClassId(schoolClassId: number) {
    var results = await this.prismaService.exam_room.findMany({
      where: {
        School_Class_ID: schoolClassId,
      },
    });
    return results;
  }

  // TODO? do we need this?
  async findAllBySchoolClassIdAndControlMissionId(
    schoolClassId: number,
    controlMissionId: number,
  ) {
    var results = await this.prismaService.exam_room.findMany({
      where: {
        School_Class_ID: schoolClassId,
        Control_Mission_ID: controlMissionId,
      },
    });
    return results;
  }

  async findOne(id: number) {
    var result = await this.prismaService.exam_room.findUnique({
      where: {
        ID: id,
      },
    });
    return result;
  }

  async update(
    id: number,
    updateExamRoomteDto: UpdateExamRoomDto,
    Updated_By: number,
  ) {
    var result = await this.prismaService.exam_room.update({
      where: {
        ID: id,
      },
      data: {
        ...updateExamRoomteDto,
        Updated_By: Updated_By,
        Updated_At: new Date().toISOString(),
      },
    });
    return result;
  }

  async remove(id: number) {
    var result = await this.prismaService.exam_room.delete({
      where: {
        ID: id,
      },
    });
    return result;
  }
}
