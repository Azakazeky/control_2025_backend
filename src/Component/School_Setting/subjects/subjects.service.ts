import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import {
  CreateSchoolTypeHasSubjectDto,
  CreateSubjectDto,
} from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Creates a new subject.
   * @param createSubjectDto the subject data to be created
   * @param createdBy the user id of the user who created the subject
   * @returns the newly created subject
   */
  async create(createSubjectDto: CreateSubjectDto, createdBy: number) {
    var schoolTypeHasSubject: Array<CreateSchoolTypeHasSubjectDto> = [];

    createSubjectDto.schools_type_ID.forEach((schoolTypeId) => {
      schoolTypeHasSubject.push({
        school_type_ID: schoolTypeId,
      });
    });
    var result = await this.prismaService.subjects.create({
      data: {
        Name: createSubjectDto.Name,
        Active: createSubjectDto.Active,
        Created_At: new Date(),
        InExam: createSubjectDto.InExam,
        Created_By: createdBy,
        school_type_has_subjects: {
          create: schoolTypeHasSubject,
        },
      },
    });

    return result;
  }

  /**
   * Retrieves all subjects associated with the specified control mission id.
   * @param controlMissionId the control mission id
   * @returns all subjects associated with the specified control mission id
   */
  async findAllByControlMissionId(controlMissionId: number) {
    var results = await this.prismaService.subjects.findMany({
      where: {
        exam_mission: {
          some: {
            Control_Mission_ID: controlMissionId,
          },
        },
      },
    });
    return results;
  }

  /**
   * Retrieves all subjects.
   * @returns all subjects, including their respective school types
   */
  async findAll() {
    var results = await this.prismaService.subjects.findMany({
      select: {
        ID: true,
        Name: true,
        InExam: true,
        Active: true,
        Created_At: true,
        school_type_has_subjects: {
          select: {
            school_type: {
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
   * Removes a school type from a subject.
   * @param subjectId the id of the subject
   * @param schoolTypeId the id of the school type to remove
   * @param updatedBy the user id of the user who made the change
   * @returns the updated subject
   * @throws {NotFoundException} If no subject with the given id is found.
   */
  async removeSchoolTypeFromSubject(
    subjectId: number,
    schoolTypeId: number,
    updatedBy: number,
  ) {
    var result = await this.prismaService.subjects.update({
      where: {
        ID: subjectId,
      },
      data: {
        Updated_By: updatedBy,
        Updated_At: new Date().toISOString(),
        school_type_has_subjects: {
          delete: {
            school_type_ID_subjects_ID: {
              school_type_ID: schoolTypeId,
              subjects_ID: subjectId,
            },
          },
        },
      },
    });
    return result;
  }

  /**
   * Retrieves all active subjects associated with the specified school type id.
   * @param school_type_ID the school type id
   * @returns an array of active subjects associated with the specified school type id
   */
  async findAllBySchoolTypeId(school_type_ID: number) {
    var results = await this.prismaService.subjects.findMany({
      where: {
        Active: 1,
        school_type_has_subjects: {
          some: {
            school_type_ID,
          },
        },
      },
      select: {
        ID: true,
        Name: true,
        InExam: true,
        Active: true,
        Created_At: true,
        school_type_has_subjects: {
          select: {
            school_type: {
              select: {
                ID: true,
                Name: true,
              },
            },
          },
        },
      },
    });
    return results.map((obj) => obj);
  }

  /**
   * Retrieves a single subject by its id.
   * @param id the subject id
   * @returns the subject with the specified id
   */
  async findOne(id: number) {
    var result = await this.prismaService.subjects.findUnique({
      where: {
        ID: id,
      },
    });
    return result;
  }

  /**
   * Updates a subject.
   * @param id the subject id
   * @param updateSubjectDto the subject data to be updated
   * @param updatedBy the user id of the user who updated the subject
   * @returns the updated subject
   */
  async update(
    id: number,
    updateSubjectDto: UpdateSubjectDto,
    updatedBy: number,
  ) {
    var schoolTypeHasSubject: Array<CreateSchoolTypeHasSubjectDto> = [];

    updateSubjectDto.schools_type_ID.forEach((schoolTypeId) => {
      schoolTypeHasSubject.push({
        school_type_ID: schoolTypeId,
      });
    });
    var result = await this.prismaService.subjects.update({
      where: {
        ID: id,
      },
      data: {
        Active: updateSubjectDto.Active,
        Name: updateSubjectDto.Name,
        InExam: updateSubjectDto.InExam,
        Updated_By: updatedBy,
        Updated_At: new Date().toISOString(),
        school_type_has_subjects: {
          create: schoolTypeHasSubject,
        },
      },
    });

    return result;
  }

  /**
   * Removes a subject.
   * @param id the subject id
   * @returns the deleted subject
   * @throws {NotFoundException} If no subject with the given id is found.
   */
  async remove(id: number) {
    var result = await this.prismaService.subjects.delete({
      where: {
        ID: id,
      },
    });
    return result;
  }

  /**
   * Updates the InExam state of a subject.
   * @param id the subject id
   * @param number the new InExam state
   * @param updatedBy the user id of the user who updated the subject
   * @returns the updated subject
   */
  async changeInExamState(id: number, number: number, updatedBy: number) {
    var result = await this.prismaService.subjects.update({
      where: {
        ID: id,
      },
      data: {
        InExam: number,
        Updated_By: updatedBy,
        Updated_At: new Date().toISOString(),
      },
    });
    return result;
  }

  /**
   * Retrieves all active subjects from the database.
   * @returns an array of active subjects, including each subject's school type
   */
  async findAllActive() {
    var results = await this.prismaService.subjects.findMany({
      where: {
        Active: 1,
      },
      select: {
        ID: true,
        Name: true,
        InExam: true,
        Active: true,
        Created_At: true,
        school_type_has_subjects: {
          select: {
            school_type: {
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
   * Activates a subject.
   * @param id the subject id
   * @param updatedBy the user id of the user who activated the subject
   * @returns the updated subject
   */
  async activate(id: number, updatedBy: number) {
    var result = await this.prismaService.subjects.update({
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
   * Deactivates a subject.
   * @param id the subject id
   * @param updatedBy the user id of the user who deactivated the subject
   * @returns the updated subject
   */
  async deactivate(id: number, updatedBy: number) {
    var result = await this.prismaService.subjects.update({
      where: {
        ID: id,
      },
      data: {
        Active: 0,
        Updated_By: updatedBy,
        Updated_At: new Date().toISOString(),
      },
    });
    return result;
  }
}
