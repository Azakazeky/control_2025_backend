import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateClassDeskDto } from './dto/create-class_desk.dto';
import { CreateManyClassDeskDto } from './dto/create-many-class-desk.dto';
import { UpdateClassDeskDto } from './dto/update-class_desk.dto';

@Injectable()
export class ClassDeskService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Creates a new class desk.
   * @param createClassDeskDto the class desk data to be created
   * @returns the newly created class desk
   */
  async create(createClassDeskDto: CreateClassDeskDto) {
    var result = await this.prismaService.class_desk.create({
      data: createClassDeskDto,
    });
    return result;
  }

  /**
   * Creates multiple new class desks.
   * @param createManyClassDeskDto the class desk data to be created
   * @returns the newly created class desks
   */
  async createMany(createManyClassDeskDto: CreateManyClassDeskDto) {
    var result: any;
    createManyClassDeskDto.Rows.map(async (row, index) => {
      for (var i = 0; i < row; i++) {
        await this.prismaService.class_desk.create({
          data: {
            Cloumn_Num: index,
            Row_Num: i,
            School_Class_ID: createManyClassDeskDto.School_Class_ID,
          },
        });
      }
    });
    return result;
  }

  /**
   * Retrieves all class desks.
   * @returns all class desks
   */
  async findAll() {
    var results = await this.prismaService.class_desk.findMany({});

    return results;
  }
  /**
   * Retrieves all class desks associated with a school class.
   * @param schoolClassId the school class id
   * @returns all class desks associated with the school class, sorted by column number
   */
  async findAllByClassId(schoolClassId: number) {
    var results = await this.prismaService.class_desk.findMany({
      where: {
        School_Class_ID: schoolClassId,
      },
      orderBy: {
        Cloumn_Num: 'asc',
      },
    });
    return results;
  }

  /**
   * Retrieves a single class desk by id.
   * @param id the class desk id
   * @returns the class desk with the specified id
   */
  async findOne(id: number) {
    var result = await this.prismaService.class_desk.findUnique({
      where: {
        ID: id,
      },
    });
    return result;
  }

  /**
   * Updates a class desk.
   * @param id the class desk id
   * @param updateClassDeskDto the class desk data to be updated
   * @returns the updated class desk
   */
  async update(id: number, updateClassDeskDto: UpdateClassDeskDto) {
    var result = await this.prismaService.class_desk.update({
      where: {
        ID: id,
      },
      data: updateClassDeskDto,
    });
    return result;
  }

  /**
   * Removes all class desks associated with a school class.
   * @param schoolClassId the school class id
   * @returns the number of class desks removed
   */
  async removeAllByClassId(schoolClassId: number) {
    var result = await this.prismaService.class_desk.deleteMany({
      where: {
        School_Class_ID: schoolClassId,
      },
    });
    return result;
  }

  /**
   * Removes a class desk by its id.
   * @param id the class desk id
   * @returns the deleted class desk
   * @throws {NotFoundException} If no class desk with the given id is found.
   */
  async remove(id: number) {
    var result = await this.prismaService.class_desk.delete({
      where: {
        ID: id,
      },
    });
    return result;
  }

  // TODO? need to check how to activate and deactivate
  //? no Active field in class_desk table
  // async activate ( id: number )
  // {
  //   var result = await this.prismaService.class_desk.update( {
  //     where: {
  //       ID: id
  //     },
  //     data: {
  //       Active: 1
  //     }
  //   } );
  //   return result;
  // }

  // async deactivate ( id: number )
  // {
  //   var result = await this.prismaService.class_desk.update( {
  //     where: {
  //       ID: id
  //     },
  //     data: {
  //       Active: 0
  //     }
  //   } );
  //   return result;
  // }
}
