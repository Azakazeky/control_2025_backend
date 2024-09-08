import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { AddSubjectsToCohort, CreateCohortDto } from './dto/create-cohort.dto';
import { UpdateCohortDto } from './dto/update-cohort.dto';
@Injectable()
export class CohortService {
  constructor(private readonly prismaService: PrismaService) {}

  async operationCreateCohort(
    createCohortDto: CreateCohortDto,
    createdBy: number,
  ) {
    var result = await this.prismaService.cohort.create({
      data: { ...createCohortDto, Created_By: createdBy },
    });
    return result;
  }

  async create(createCohortDto: CreateCohortDto, createdBy: number) {
    var result = await this.prismaService.cohort.create({
      data: { ...createCohortDto, Created_By: createdBy },
      include: {
        cohort_has_subjects: {
          include: {
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
    return result;
  }

  async findAll() {
    var results = await this.prismaService.cohort.findMany({
      include: {
        cohort_has_subjects: {
          include: {
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
  async findAllBySchoolId(schoolId: number) {
    var results = await this.prismaService.cohort.findMany({
      include: {
        cohort_has_subjects: {
          include: {
            subjects: {
              select: {
                ID: true,
                Name: true,
              },
            },
          },
        },
      },
      where: {
        school_type: {
          schools: {
            some: {
              ID: schoolId,
            },
          },
        },
      },
    });

    return results;
  }

  async findOne(id: number) {
    var result = await this.prismaService.cohort.findUnique({
      where: {
        ID: id,
      },
      include: {
        cohort_has_subjects: {
          include: {
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
    return result;
  }
  async addSubjects(cohortId: number, addSubjectsToCohort: number[]) {
    var data: AddSubjectsToCohort[] = [];
    for (let i = 0; i < addSubjectsToCohort.length; i++) {
      var sub: AddSubjectsToCohort = {
        Subjects_ID: addSubjectsToCohort[i],
      };
      data.push(sub);
    }
    try {
      var result = await this.prismaService.cohort.update({
        where: {
          ID: cohortId,
        },
        include: {
          cohort_has_subjects: {
            include: {
              subjects: {
                select: {
                  ID: true,
                  Name: true,
                },
              },
            },
          },
        },
        data: {
          cohort_has_subjects: {
            create: data,
          },
        },
      });

      return result;
    } catch (error) {
      return error;
    }
  }

  async removeSubjects(cohortId: number, subjectId: number) {
    var result = await this.prismaService.cohort.update({
      where: {
        ID: cohortId,
      },
      include: {
        cohort_has_subjects: {
          include: {
            subjects: {
              select: {
                ID: true,
                Name: true,
              },
            },
          },
        },
      },
      data: {
        cohort_has_subjects: {
          delete: {
            Cohort_ID_Subjects_ID: {
              Cohort_ID: cohortId,
              Subjects_ID: subjectId,
            },
          },
        },
      },
    });
    return result;
  }

  async update(
    id: number,
    updateCohortDto: UpdateCohortDto,
    updatedBy: number,
  ) {
    var result = await this.prismaService.cohort.update({
      where: {
        ID: id,
      },
      data: {
        ...updateCohortDto,
        Updated_By: updatedBy,
        Updated_At: new Date().toString(),
      },
    });
    return result;
  }

  async remove(id: number) {
    var result = await this.prismaService.cohort.delete({
      where: {
        ID: id,
      },
    });
    return result;
  }

  async activate(id: number) {
    var result = await this.prismaService.cohort.update({
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
    var result = await this.prismaService.cohort.update({
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
