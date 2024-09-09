import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';

@Injectable()
export class GradesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createGradeDto: CreateGradeDto, schoolId: number) {
    var result = await this.prismaService.grades.create({
      data: { ...createGradeDto, Schools_ID: schoolId },
    });
    return result;
  }

  async findAll() {
    var schools = await this.prismaService.grades.findMany({});

    return schools;
  }
  async findAllBySchoolId(schoolId: number) {
    var schools = await this.prismaService.grades.findMany({
      where: {
        Schools_ID: schoolId,
      },
    });
    return schools;
  }

  async findOne(id: number) {
    var result = await this.prismaService.grades.findUnique({
      where: {
        ID: id,
      },
    });
    return result;
  }

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

  async remove(id: number) {
    var result = await this.prismaService.grades.delete({
      where: {
        ID: id,
      },
    });
    return result;
  }

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
