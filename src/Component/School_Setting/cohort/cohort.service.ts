import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { AddSubjectsToCohort, CreateCohortDto } from './dto/create-cohort.dto';
import { UpdateCohortDto } from './dto/update-cohort.dto';
@Injectable()
export class CohortService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createCohortDto: CreateCohortDto) {
    var result = await this.prismaService.cohort.create({
      data: createCohortDto
    });
    return result;
  }

  async findAll() {
    var results = await this.prismaService.cohort.findMany({

    });

    return results;
  }

  // TODO: need to check how to filter
  // async findAllBy....Id ( ....: number )
  // {
  //   var results = await this.prismaService.cohort.findMany( {
  //     where: {

  //     }
  //   } );
  //   return results;
  // }

  async findOne(id: number) {
    var result = await this.prismaService.cohort.findUnique({
      where: {
        ID: id
      },

    });
    return result;
  }
  async addSubjects(cohortId: number, addSubjectsToCohort: number[]) {
    var data: AddSubjectsToCohort[] = [];

    for (let i = 0; i < addSubjectsToCohort.length; i++) {
      var sub: AddSubjectsToCohort = {
        Subjects_ID: addSubjectsToCohort[i]
      }
      data.push(sub);
    }


    try {
      var result = await this.prismaService.cohort.update({
        where: {
          ID: cohortId,
        },
        data: {
          cohort_has_subjects: {
            create: data
          }
        }
      });

      return result

    } catch (error) {
      return error;
    }

  }




  async update(id: number, updateCohortDto: UpdateCohortDto) {
    var result = await this.prismaService.cohort.update({
      where: {
        ID: id
      },
      data: updateCohortDto
    });
    return result;
  }

  async remove(id: number) {
    var result = await this.prismaService.cohort.delete({
      where: {
        ID: id
      }
    });
    return result;
  }

}
