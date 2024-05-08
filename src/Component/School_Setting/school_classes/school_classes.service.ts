import { Injectable } from '@nestjs/common';
import { CreateSchoolClassDto } from './dto/create-school_class.dto';
import { UpdateSchoolClassDto } from './dto/update-school_class.dto';
import { PrismaService } from 'src/Common/Db/prisma.service';

@Injectable()
export class SchoolClassesService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createSchoolClassDto: CreateSchoolClassDto) {
    var result = await this.prismaService.school_class.create({
      data: createSchoolClassDto
    });
    return result;
  }

  async findAll() {
    var schools = await this.prismaService.school_class.findMany({

    });

    return schools;
  }

  async findOne(id: number) {
    var result = await this.prismaService.school_class.findUnique({
      where: {
        ID: id
      },
    });
    return result;
  }

  async update(id: number, updateSchoolClassDto: UpdateSchoolClassDto) {
    var result = await this.prismaService.school_class.update({
      where: {
        ID: id
      },
      data: updateSchoolClassDto
    });
    return result;
  }
  
  async remove(id: number) {
    var result = await this.prismaService.school_class.delete({
      where: {
        ID: id
      }
    });
    return result;
  }
}
