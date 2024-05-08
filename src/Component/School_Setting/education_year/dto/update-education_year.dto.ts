import { PartialType } from '@nestjs/swagger';
import { CreateEducationYearDto } from './create-education_year.dto';

export class UpdateEducationYearDto extends PartialType(CreateEducationYearDto) {}
