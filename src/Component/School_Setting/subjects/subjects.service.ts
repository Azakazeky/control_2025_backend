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

  async create(createSubjecteDto: CreateSubjectDto, createdBy: number) {
    var schoolTypeHasSubject: Array<CreateSchoolTypeHasSubjectDto> = [];

    createSubjecteDto.schools_type_ID.forEach((schoolTypeId) => {
      schoolTypeHasSubject.push({
        school_type_ID: schoolTypeId,
      });
    });
    var result = await this.prismaService.subjects.create({
      data: {
        Name: createSubjecteDto.Name,
        Active: createSubjecteDto.Active,
        Created_At: new Date(),
        InExam: createSubjecteDto.InExam,
        Created_By: createdBy,
        school_type_has_subjects: {
          create: schoolTypeHasSubject,
        },
      },
    });

    return result;
  }

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

  async findAll() {
    var results = await this.prismaService.subjects.findMany({
      select: {
        ID: true,
        Name: true,
        InExam: true,
        Active: true,
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

  async findOne(id: number) {
    var result = await this.prismaService.subjects.findUnique({
      where: {
        ID: id,
      },
    });
    return result;
  }

  async update(
    id: number,
    updateSubjecteDto: UpdateSubjectDto,
    updatedBy: number,
  ) {
    var schoolTypeHasSubject: Array<CreateSchoolTypeHasSubjectDto> = [];

    updateSubjecteDto.schools_type_ID.forEach((schoolTypeId) => {
      schoolTypeHasSubject.push({
        school_type_ID: schoolTypeId,
      });
    });
    var result = await this.prismaService.subjects.update({
      where: {
        ID: id,
      },
      data: {
        Active: updateSubjecteDto.Active,
        Name: updateSubjecteDto.Name,
        InExam: updateSubjecteDto.InExam,
        Updated_By: updatedBy,
        Updated_At: new Date().toISOString(),
        school_type_has_subjects: {
          create: schoolTypeHasSubject,
        },
      },
    });

    return result;
  }

  async remove(id: number) {
    var result = await this.prismaService.subjects.delete({
      where: {
        ID: id,
      },
    });
    return result;
  }

  async chageInExamState(id: number, number: number, updatedBy: number) {
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
