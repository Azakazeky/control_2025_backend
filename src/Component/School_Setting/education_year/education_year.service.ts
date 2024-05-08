import { Injectable } from '@nestjs/common';
import { CreateEducationYearDto } from './dto/create-education_year.dto';
import { UpdateEducationYearDto } from './dto/update-education_year.dto';

@Injectable()
export class EducationYearService {
  create(createEducationYearDto: CreateEducationYearDto) {
    return 'This action adds a new educationYear';
  }

  findAll() {
    return `This action returns all educationYear`;
  }

  findOne(id: number) {
    return `This action returns a #${id} educationYear`;
  }

  update(id: number, updateEducationYearDto: UpdateEducationYearDto) {
    return `This action updates a #${id} educationYear`;
  }

  remove(id: number) {
    return `This action removes a #${id} educationYear`;
  }
}
