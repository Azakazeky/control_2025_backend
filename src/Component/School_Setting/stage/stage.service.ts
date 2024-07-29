import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateStageDto } from './dto/create-stage.dto';
import { UpdateStageDto } from './dto/update-stage.dto';

@Injectable()
export class StageService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createStageeDto: CreateStageDto, createdBy: number) {
    var result = await this.prismaService.stage.create({
      data: { ...createStageeDto, Created_By: createdBy },
    });
    return result;
  }

  async findAll() {
    var results = await this.prismaService.stage.findMany({});

    return results;
  }

  async findOne(id: number) {
    var result = await this.prismaService.stage.findUnique({
      where: {
        ID: id,
      },
    });
    return result;
  }

  async update(
    id: number,
    updateStageeDto: UpdateStageDto,
    Updated_By: number,
  ) {
    var result = await this.prismaService.stage.update({
      where: {
        ID: id,
      },
      data: { ...updateStageeDto, Updated_By: Updated_By },
    });
    return result;
  }

  async remove(id: number) {
    var result = await this.prismaService.stage.delete({
      where: {
        ID: id,
      },
    });
    return result;
  }

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
