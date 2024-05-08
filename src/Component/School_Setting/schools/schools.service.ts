import { Injectable } from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { PrismaService } from 'src/Common/Db/prisma.service';

@Injectable()
export class SchoolsService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createSchoolDto: CreateSchoolDto) {
    var result = await this.prismaService.schools.create({
      data: createSchoolDto
    });
    return result;
  }
  
  async findAll(userId: number) {
    var schools = await this.prismaService.schools.findMany({
      where: {
        users_has_schools:{
        some:{
          Users_ID:userId
        }
      }
      },
    });

    return schools;
  }

  async findOne(id: number) {
    var result = await this.prismaService.schools.findUnique({
      where: {
        ID: id
      },
      include: {
        school_type: true
      }
    });
    return result;
  }

  async update(id: number, updateSchoolDto: UpdateSchoolDto) {
    var result = await this.prismaService.schools.update({
      where: {
        ID: id
      },
      data: updateSchoolDto
    });
    return result;
  }




  

  async remove(id: number) {
    var result = await this.prismaService.schools.delete({
      where: {
        ID: id
      }
    });
    return result;
  }
}
