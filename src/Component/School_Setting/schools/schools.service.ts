import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';

@Injectable()
export class SchoolsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createSchoolDto: CreateSchoolDto) {
    var result = await this.prismaService.schools.create({
      data: createSchoolDto,
      include: {
        school_type: true,
      },
    });
    return result;
  }

  async findAll() {
    var schools = await this.prismaService.schools.findMany({
      include: {
        school_type: true,
      },
    });

    return schools;
  }
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

  async remove(id: number) {
    var result = await this.prismaService.schools.delete({
      where: {
        ID: id,
      },
    });
    return result;
  }

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
