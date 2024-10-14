import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';

@Injectable()
export class GradesService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Creates a new grade.
   * @param createGradeDto the grade data to be created
   * @returns the newly created grade
   */
  async create(createGradeDto: CreateGradeDto) {
    var result = await this.prismaService.grades.create({
      data: createGradeDto,
    });
    return result;
  }

  /**
   * Retrieves all grades.
   * @returns all grades
   */
  async findAll() {
    var schools = await this.prismaService.grades.findMany({});

    return schools;
  }
  /**
   * Retrieves all grades associated with a school.
   * @param schoolId the school id
   * @returns all grades associated with the school
   */
  async findAllBySchoolId(schoolId: number) {
    var schools = await this.prismaService.grades.findMany({
      where: {
        Schools_ID: schoolId,
      },
    });
    return schools;
  }

  /**
   * Retrieves a single grade by its id.
   * @param id the grade id
   * @returns the grade with the specified id
   */
  async findOne(id: number) {
    var result = await this.prismaService.grades.findUnique({
      where: {
        ID: id,
      },
    });
    return result;
  }

  /**
   * Updates a grade.
   * @param id the grade id
   * @param updateGradeDto the grade data to be updated
   * @param Updated_By the user id of the user who updated the grade
   * @returns the updated grade
   */
  async update(id: number, updateGradeDto: UpdateGradeDto, Updated_By: number) {
    var result = await this.prismaService.grades.update({
      where: {
        ID: id,
      },
      data: {
        ...updateGradeDto,
        Updated_By: Updated_By,
        Updated_At: new Date().toISOString(),
      },
    });
    return result;
  }

  /**
   * Removes a grade by its id.
   * @param id the grade id
   * @returns the deleted grade
   * @throws {NotFoundException} If no grade with the given id is found.
   */
  async remove(id: number) {
    var result = await this.prismaService.grades.delete({
      where: {
        ID: id,
      },
    });
    return result;
  }

  /**
   * Activates a grade.
   * @param id the grade id
   * @returns the activated grade
   * @throws {NotFoundException} If no grade with the given id is found.
   */
  async activate(id: number) {
    var result = await this.prismaService.grades.update({
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
   * Deactivates a grade.
   * @param id the grade id
   * @returns the deactivated grade
   * @throws {NotFoundException} If no grade with the given id is found.
   */
  async deactivate(id: number) {
    var result = await this.prismaService.grades.update({
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
