import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateEducationYearDto } from './dto/create-education_year.dto';
import { UpdateEducationYearDto } from './dto/update-education_year.dto';

@Injectable()
export class EducationYearService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Creates a new education year.
   * @param createEducationYeareDto the education year data to be created
   * @returns the newly created education year
   */
  async create(createEducationYeareDto: CreateEducationYearDto) {
    var result = await this.prismaService.education_year.create({
      data: createEducationYeareDto,
    });
    return result;
  }

  /**
   * Retrieves all education years.
   * @returns an array of education years
   */
  async findAll() {
    var results = await this.prismaService.education_year.findMany({});

    return results;
  }

  // TODO: need to check how to filter
  // async findAllBy....Id ( ....: number )
  // {
  //   var results = await this.prismaService.education_year.findMany( {
  //     where: {

  //     }
  //   } );
  //   return results;
  // }

  /**
   * Retrieves an education year by its id.
   * @param id the education year id
   * @returns the education year
   */
  async findOne(id: number) {
    var result = await this.prismaService.education_year.findUnique({
      where: {
        ID: id,
      },
    });
    return result;
  }

  /**
   * Updates an education year by its id.
   * @param id the education year id
   * @param updateEducationYeareDto the education year data to be updated
   * @returns the updated education year
   */
  async update(id: number, updateEducationYeareDto: UpdateEducationYearDto) {
    var result = await this.prismaService.education_year.update({
      where: {
        ID: id,
      },
      data: updateEducationYeareDto,
    });
    return result;
  }

  /**
   * Removes an education year by its id.
   * @param id the education year id
   * @returns the deleted education year
   */
  async remove(id: number) {
    var result = await this.prismaService.education_year.delete({
      where: {
        ID: id,
      },
    });
    return result;
  }

  // TODO? need to check how to activate and deactivate
  //? no Active field in table
  // async activate ( id: number )
  // {
  //   var result = await this.prismaService.education_year.update( {
  //     where: {
  //       ID: id
  //     },
  //     data: {
  //       Active: 1
  //     }
  //   } );
  //   return result;
  // }

  // async deactivate ( id: number )
  // {
  //   var result = await this.prismaService.education_year.update( {
  //     where: {
  //       ID: id
  //     },
  //     data: {
  //       Active: 0
  //     }
  //   } );
  //   return result;
  // }
}
