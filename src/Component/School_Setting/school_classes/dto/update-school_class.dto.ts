import { PartialType } from '@nestjs/swagger';
import { CreateSchoolClassDto } from './create-school_class.dto';

export class UpdateSchoolClassDto extends PartialType(CreateSchoolClassDto) {}
