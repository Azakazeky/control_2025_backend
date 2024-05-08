import { Injectable } from '@nestjs/common';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { PrismaService } from 'src/Common/Db/prisma.service';

@Injectable()
export class GradesService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createGradeDto: CreateGradeDto) {
    var result = await this.prismaService.grades.create({
      data: createGradeDto
    });
    return result;
  }

  async findAll() {
    var schools = await this.prismaService.grades.findMany({

    });

    return schools;
  }
  async findAllBySchoolId(schoolId: number) {
    var schools = await this.prismaService.grades.findMany({
      where: {
        Schools_ID: schoolId
      }
    });
    return schools;
  }

  async findOne(id: number) {
    var result = await this.prismaService.grades.findUnique({
      where: {
        ID: id
      },

    });
    return result;
  }

  async update(id: number, updateGradeDto: UpdateGradeDto) {
    var result = await this.prismaService.grades.update({
      where: {
        ID: id
      },
      data: updateGradeDto
    });
    return result;
  }

  async remove(id: number) {
    var result = await this.prismaService.grades.delete({
      where: {
        ID: id
      }
    });
    return result;
  }

}
