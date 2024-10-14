import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { AddSubjectsToCohort, CreateCohortDto } from './dto/create-cohort.dto';
import { UpdateCohortDto } from './dto/update-cohort.dto';
@Injectable()
export class CohortService {
  constructor(readonly prismaService: PrismaService) {}

  /**
   * Creates a new cohort in the database.
   * @param createCohortDto the cohort data to be created
   * @param createdBy the user id of the user who created the cohort
   * @returns the newly created cohort
   */
  async operationCreateCohort(
    createCohortDto: CreateCohortDto,
    createdBy: number,
  ) {
    var result = await this.prismaService.cohort.create({
      data: { ...createCohortDto, Created_By: createdBy },
    });
    return result;
  }

  /**
   * Creates a new cohort.
   * @param createCohortDto the cohort data to be created
   * @param createdBy the user id of the user who created the cohort
   * @returns the newly created cohort, including the school type and subjects
   */
  async create(createCohortDto: CreateCohortDto, createdBy: number) {
    var result = await this.prismaService.cohort.create({
      data: { ...createCohortDto, Created_By: createdBy },
      include: {
        school_type: true,
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

  /**
   * Retrieves all cohorts from the database.
   * @returns an array of cohorts, including each cohort's school type and subjects
   */
  async findAll() {
    var results = await this.prismaService.cohort.findMany({
      include: {
        school_type: true,
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
  /**
   * Retrieves all cohorts associated with a school.
   * @param schoolId the school id
   * @returns an array of cohorts, including each cohort's school type and subjects
   */
  async findAllBySchoolId(schoolId: number) {
    var results = await this.prismaService.cohort.findMany({
      include: {
        school_type: true,
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

  /**
   * Retrieves a single cohort by its id.
   * @param id the cohort id
   * @returns the cohort with the specified id, including the school type and subjects
   */
  async findOne(id: number) {
    var result = await this.prismaService.cohort.findUnique({
      where: {
        ID: id,
      },
      include: {
        school_type: true,
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
  /**
   * Adds a list of subjects to a cohort.
   * @param cohortId the id of the cohort
   * @param addSubjectsToCohort an array of subject ids to add
   * @returns the updated cohort, including the school type and subjects
   */
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

  /**
   * Removes a subject from a cohort.
   * @param cohortId the id of the cohort
   * @param subjectId the id of the subject to remove
   * @returns the updated cohort, including the school type and subjects
   */
  async removeSubjects(cohortId: number, subjectId: number) {
    var result = await this.prismaService.cohort.update({
      where: {
        ID: cohortId,
      },
      include: {
        school_type: true,
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

  /**
   * Updates a cohort.
   * @param id the cohort id
   * @param updateCohortDto the cohort data to be updated
   * @param updatedBy the user id of the user who updated the cohort
   * @returns the updated cohort, including the school type and subjects
   */
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
        Updated_At: new Date().toISOString(),
      },
    });
    return result;
  }

  /**
   * Removes a cohort by its id.
   * @param id the cohort id
   * @returns the deleted cohort
   * @throws {NotFoundException} If no cohort with the given id is found.
   */
  async remove(id: number) {
    var result = await this.prismaService.cohort.delete({
      where: {
        ID: id,
      },
    });
    return result;
  }

  /**
   * Activates a cohort by its id.
   * @param id the cohort id
   * @returns the activated cohort
   */
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

  /**
   * Deactivates a cohort by its id.
   * @param id the cohort id
   * @returns the deactivated cohort
   */
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
