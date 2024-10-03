import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/Common/Guard/local-auth.guard';
import { CreateUuidDto } from './dto/create-uuid.dto';
import { UpdateUuidDto } from './dto/update-uuid.dto';
import { UuidService } from './uuid.service';

@UseGuards(JwtAuthGuard)
@ApiTags('Uuid')
@Controller('uuid')
export class UuidController {
  constructor(private readonly uuidService: UuidService) {}
  @Post()
  create(@Body() createUuidDto: CreateUuidDto, @Req() req: Request) {
    return this.uuidService.create(
      createUuidDto,
      req.headers['user']['userId'],
    );
  }

  @Get()
  findAll() {
    return this.uuidService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uuidService.findOne(+id);
  }
  @Get('validate-student/:id')
  validateStudent(
    @Param('id') id: string,
    @Query('examMissionId') examMissionId: string,
  ) {
    return this.uuidService.validateStudent(+id, +examMissionId);
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUuidDto: UpdateUuidDto,
    @Req() req: Request,
  ) {
    return this.uuidService.update(
      +id,
      updateUuidDto,
      req.headers['user']['userId'],
    );
  }

  @Patch(':id/activate')
  activate(
    @Param('id') id: string,
    @Query('examMissionId') examMissionId: string,
    @Req() req: Request,
  ) {
    return this.uuidService.activate(
      +id,
      +examMissionId,
      +req.headers['user']['userId'],
    );
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uuidService.remove(+id);
  }
}
