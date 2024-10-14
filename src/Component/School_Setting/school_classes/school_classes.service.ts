import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateSchoolClassDto } from './dto/create-school_class.dto';
import { UpdateSchoolClassDto } from './dto/update-school_class.dto';

@Injectable()
export class SchoolClassesService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Creates a new school class.
   * @param createSchoolClassDto the school class data to be created
   * @param createdBy the user id of the user who created the school class
   * @param schoolId the school id of the school of the school class
   * @returns the newly created school class, including the class desks
   */
  async create(
    createSchoolClassDto: CreateSchoolClassDto,
    createdBy: number,
    schoolId: number,
  ) {
    const numberOfRows = JSON.parse(createSchoolClassDto.Rows);
    var classDesks: Array<{ Cloumn_Num: number; Row_Num: number }> = new Array<{
      Cloumn_Num: number;
      Row_Num: number;
    }>();
    for (var i = 0; i < numberOfRows.length; i++) {
      for (var j = 0; j < numberOfRows[i]; j++) {
        classDesks.push({ Cloumn_Num: j, Row_Num: i });
      }
    }
    var result = await this.prismaService.school_class.create({
      data: {
        ...createSchoolClassDto,
        Created_By: createdBy,
        Schools_ID: schoolId,
        class_desk: {
          createMany: {
            data: classDesks,
          },
        },
      },
    });
    return result;
  }

  /**
   * Retrieves all school classes.
   * @returns an array of school classes
   */
  async findAll() {
    var results = await this.prismaService.school_class.findMany({});

    return results;
  }

  /**
   * Retrieves a single school class by its id.
   * @param id the school class id
   * @returns the school class with the specified id
   */
  async findOne(id: number) {
    var result = await this.prismaService.school_class.findUnique({
      where: {
        ID: id,
      },
    });
    return result;
  }

  /**
   * Retrieves all school classes associated with a school.
   * @param id the school id
   * @returns an array of school classes associated with the school, sorted by class number
   */
  async findBySchool(id: number) {
    var result = await this.prismaService.school_class.findMany({
      where: {
        Schools_ID: id,
      },
      orderBy: {
        Class_Number: 'asc',
      },
    });
    return result;
  }

  /**
   * Updates a school class.
   * @param id the school class id
   * @param updateSchoolClassDto the school class data to be updated
   * @param updatedBy the user id who made the update
   * @returns the updated school class
   *
   * Note: If the new max capacity is less than the current max capacity,
   * the update will be rejected with a 400 error.
   */
  async update(
    id: number,
    updateSchoolClassDto: UpdateSchoolClassDto,
    updatedBy: number,
  ) {
    var classDesks: Array<{ Cloumn_Num: number; Row_Num: number }> = new Array<{
      Cloumn_Num: number;
      Row_Num: number;
    }>();
    var schoolClass = await this.prismaService.school_class.findUnique({
      where: {
        ID: id,
      },
      select: {
        Max_Capacity: true,
        class_desk: {
          select: {
            ID: true,
          },
        },
      },
    });
    if (
      parseInt(schoolClass.Max_Capacity) <=
      parseInt(updateSchoolClassDto.Max_Capacity)
    ) {
      const numberOfRows = JSON.parse(updateSchoolClassDto.Rows);
      for (var i = 0; i < numberOfRows.length; i++) {
        for (var j = 0; j < parseInt(numberOfRows[i]); j++) {
          classDesks.push({ Cloumn_Num: j, Row_Num: i });
        }
      }
      var oldClassDesks = schoolClass.class_desk;
      for (var i = 0; i < oldClassDesks.length; i++) {
        await this.prismaService.class_desk.update({
          where: {
            ID: oldClassDesks[i].ID,
          },
          data: { ...classDesks[i] },
        });
      }
      for (var i = oldClassDesks.length; i < classDesks.length; i++) {
        await this.prismaService.class_desk.create({
          data: { ...classDesks[i], School_Class_ID: id },
        });
      }
    } else {
      throw new HttpException(
        'Max Capacity cannot be less than current capacity',
        HttpStatus.BAD_REQUEST,
      );
    }
    var result = await this.prismaService.school_class.update({
      where: {
        ID: id,
      },
      data: {
        ...updateSchoolClassDto,
        Updated_By: updatedBy,
        Updated_At: new Date().toISOString(),
      },
    });
    return result;
  }

  /**
   * Deletes a school class.
   * @param id the id of the school class to delete.
   * @returns the deleted school class.
   * @throws {NotFoundException} If no school class with the given id is found.
   */
  async remove(id: number) {
    var result = await this.prismaService.school_class.delete({
      where: {
        ID: id,
      },
    });
    return result;
  }

  /**
   * Activates a school class.
   * @param id the school class id
   * @returns the activated school class
   * @throws {NotFoundException} If no school class with the given id is found.
   */
  async activate(id: number) {
    var result = await this.prismaService.school_class.update({
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
   * Deactivates a school class.
   * @param id the school class id
   * @returns the deactivated school class
   * @throws {NotFoundException} If no school class with the given id is found.
   */
  async deactivate(id: number) {
    var result = await this.prismaService.school_class.update({
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
