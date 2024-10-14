import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateStageDto } from './dto/create-stage.dto';
import { UpdateStageDto } from './dto/update-stage.dto';

@Injectable()
export class StageService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Creates a new stage in the database.
   * @param createStageeDto the stage data to be created
   * @param createdBy the user id of the user who created the stage
   * @returns the newly created stage
   */
  async create(createStageeDto: CreateStageDto, createdBy: number) {
    var result = await this.prismaService.stage.create({
      data: { ...createStageeDto, Created_By: createdBy },
    });
    return result;
  }

  /**
   * Finds all stages in the database.
   * @returns an array of all stages
   */
  async findAll() {
    var results = await this.prismaService.stage.findMany({});

    return results;
  }

  /**
   * Finds a single stage by its id.
   * @param id the stage id
   * @returns the stage with the specified id
   */
  async findOne(id: number) {
    var result = await this.prismaService.stage.findUnique({
      where: {
        ID: id,
      },
    });
    return result;
  }

  /**
   * Updates a stage in the database.
   * @param id the stage id
   * @param updateStageeDto the stage data to be updated
   * @param Updated_By the user id of the user who updated the stage
   * @returns the updated stage
   */
  async update(
    id: number,
    updateStageeDto: UpdateStageDto,
    Updated_By: number,
  ) {
    var result = await this.prismaService.stage.update({
      where: {
        ID: id,
      },
      data: {
        ...updateStageeDto,
        Updated_By: Updated_By,
        Updated_At: new Date().toISOString(),
      },
    });
    return result;
  }

  /**
   * Removes a stage from the database.
   * @param id the stage id
   * @returns the removed stage
   */
  async remove(id: number) {
    var result = await this.prismaService.stage.delete({
      where: {
        ID: id,
      },
    });
    return result;
  }

  /**
   * Activates a stage.
   * @param id the stage id
   * @returns the updated stage
   */
  async activate(id: number) {
    var result = await this.prismaService.stage.update({
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
   * Deactivates a stage.
   * @param id the stage id
   * @returns the deactivated stage
   */
  async deactivate(id: number) {
    var result = await this.prismaService.stage.update({
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
