import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';

@Injectable()
export class SchoolsService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Creates a new school.
   * @param createSchoolDto the school data to be created
   * @returns the newly created school, including the school type
   */
  async create(createSchoolDto: CreateSchoolDto) {
    var result = await this.prismaService.schools.create({
      data: createSchoolDto,
      include: {
        school_type: true,
      },
    });
    return result;
  }

  /**
   * Retrieves all schools from the database.
   * @returns an array of schools, including each school's school type
   */
  async findAll() {
    var schools = await this.prismaService.schools.findMany({
      include: {
        school_type: true,
      },
    });

    return schools;
  }
  /**
   * Retrieves all schools associated with a user.
   * @param userId the user id
   * @returns an array of schools, including each school's school type
   */
  async findAllByUser(userId: number) {
    var schools = await this.prismaService.schools.findMany({
      where: {
        users_has_schools: {
          some: {
            Users_ID: userId,
          },
        },
      },
    });

    return schools;
  }

  /**
   * Retrieves a single school by its id.
   * @param id the school id
   * @returns the school with the specified id, including the school type
   */
  async findOne(id: number) {
    var result = await this.prismaService.schools.findUnique({
      where: {
        ID: id,
      },
      include: {
        school_type: true,
      },
    });
    return result;
  }

  /**
   * Updates a school.
   * @param id the school id
   * @param updateSchoolDto the school data to be updated
   * @param Updated_By the user id of the user who updated the school
   * @returns the updated school
   */
  async update(
    id: number,
    updateSchoolDto: UpdateSchoolDto,
    Updated_By: number,
  ) {
    var result = await this.prismaService.schools.update({
      where: {
        ID: id,
      },
      data: {
        ...updateSchoolDto,
        Updated_By: Updated_By,
        Updated_At: new Date().toISOString(),
      },
    });
    return result;
  }

  /**
   * Deletes a school.
   * @param id the id of the school to delete.
   * @returns the deleted school.
   * @throws {NotFoundException} If no school with the given id is found.
   */
  async remove(id: number) {
    var result = await this.prismaService.schools.delete({
      where: {
        ID: id,
      },
    });
    return result;
  }

  /**
   * Activates a school.
   * @param id the id of the school to activate
   * @returns the activated school
   * @throws {NotFoundException} If no school with the given id is found.
   */
  async activate(id: number) {
    var result = await this.prismaService.schools.update({
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
   * Deactivates a school.
   * @param id the id of the school to deactivate
   * @returns the deactivated school
   * @throws {NotFoundException} If no school with the given id is found.
   */
  async deactivate(id: number) {
    var result = await this.prismaService.schools.update({
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
