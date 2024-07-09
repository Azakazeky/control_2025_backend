import { PartialType } from '@nestjs/swagger';
import { CreateProctorDto } from './create-proctor.dto';

export class UpdateProctorDto extends PartialType(CreateProctorDto) {}
