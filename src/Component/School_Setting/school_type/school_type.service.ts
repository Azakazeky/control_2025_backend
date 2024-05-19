import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateSchoolTypeDto } from './dto/create-school_type.dto';
import { UpdateSchoolTypeDto } from './dto/update-school_type.dto';

@Injectable()
export class SchoolTypeService {

  constructor(private readonly prismaService: PrismaService) { }

  async create(createdBy: number, createSchoolTypeDto: CreateSchoolTypeDto) {
    console.log(createSchoolTypeDto.Name +' is create by '+ createdBy+' id');
    var result = await this.prismaService.school_type.create({
      data: {
        ...createSchoolTypeDto,
        Created_By: createdBy
      }
    });
    return result;
  }

  async findAll() {
    var results = await this.prismaService.school_type.findMany({

    });

    return results;
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
