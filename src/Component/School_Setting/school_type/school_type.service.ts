import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateSchoolTypeDto } from './dto/create-school_type.dto';
import { UpdateSchoolTypeDto } from './dto/update-school_type.dto';

@Injectable()
export class SchoolTypeService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Creates a new school type.
   * @param createdBy the user id of the user who created the school type
   * @param createSchoolTypeDto the school type data to be created
   * @returns the newly created school type
   */
  async create(createdBy: number, createSchoolTypeDto: CreateSchoolTypeDto) {
    console.log(
      createSchoolTypeDto.Name + ' is create by ' + createdBy + ' id',
    );
    var result = await this.prismaService.school_type.create({
      data: {
        ...createSchoolTypeDto,
        Created_By: createdBy,
      },
    });
    return result;
  }

  /**
   * Retrieves all school types.
   * @returns an array of school types
   */
  async findAll() {
    var results = await this.prismaService.school_type.findMany({});

    return results;
  }

  /**
   * Retrieves a single school type by its id.
   * @param id the school type id
   * @returns the school type with the specified id
   */
  async findOne(id: number) {
    var result = await this.prismaService.school_type.findUnique({
      where: {
        ID: id,
      },
    });
    return result;
  }

  /**
   * Updates a school type by its id.
   * @param id the school type id
   * @param updateSchoolTypeDto the school type data to be updated
   * @returns the updated school type
   */
  async update(id: number, updateSchoolTypeDto: UpdateSchoolTypeDto) {
    var result = await this.prismaService.school_type.update({
      where: {
        ID: id,
      },
      data: updateSchoolTypeDto,
    });
    return result;
  }

  /**
   * Removes a school type by its id.
   * @param id the school type id
   * @returns the deleted school type
   * @throws {NotFoundException} If no school type with the given id is found.
   */
  async remove(id: number) {
    var result = await this.prismaService.school_type.delete({
      where: {
        ID: id,
      },
    });
    return result;
  }

  /**
   * Activates a school type.
   * @param id the school type id
   * @returns the activated school type
   * @throws {NotFoundException} If no school type with the given id is found.
   */
  async activate(id: number) {
    var result = await this.prismaService.school_type.update({
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
   * Deactivates a school type.
   * @param id the school type id
   * @returns the deactivated school type
   * @throws {NotFoundException} If no school type with the given id is found.
   */
  async deactivate(id: number) {
    var result = await this.prismaService.school_type.update({
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
