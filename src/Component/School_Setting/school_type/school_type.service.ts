import { Injectable } from '@nestjs/common';
import { CreateSchoolTypeDto } from './dto/create-school_type.dto';
import { UpdateSchoolTypeDto } from './dto/update-school_type.dto';
import { PrismaService } from 'src/Common/Db/prisma.service';

@Injectable()
export class SchoolTypeService {

  constructor(private readonly prismaService: PrismaService) { }

  async create(createSchoolTypeDto: CreateSchoolTypeDto) {
    var result = await this.prismaService.school_type.create({
      data: createSchoolTypeDto
    });
    return result;
  }

  async findAll() {
    var schools = await this.prismaService.school_type.findMany({

    });

    return schools;
  }

  async findOne(id: number) {
    var result = await this.prismaService.school_type.findUnique({
      where: {
        ID: id
      },
    });
    return result;
  }

  async update(id: number, updateSchoolTypeDto: UpdateSchoolTypeDto) {
    var result = await this.prismaService.school_type.update({
      where: {
        ID: id
      },
      data: updateSchoolTypeDto
    });
    return result;
  }

  async remove(id: number) {
    var result = await this.prismaService.school_type.delete({
      where: {
        ID: id
      }
    });
    return result;
  }
}
