import { PartialType } from '@nestjs/swagger';
import { CreateClassDeskDto } from './create-class_desk.dto';

export class UpdateClassDeskDto extends PartialType(CreateClassDeskDto) {}
