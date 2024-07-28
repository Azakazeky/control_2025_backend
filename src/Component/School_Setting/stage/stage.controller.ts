import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/Common/Guard/local-auth.guard';
import { CreateStageDto } from './dto/create-stage.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { StageService } from './stage.service';

@UseGuards(JwtAuthGuard)
@ApiTags('Stage')
@Controller('stage')
export class StageController {
  constructor(private readonly stageService: StageService) {}

  @Post()
  create(@Body() createStageDto: CreateStageDto, @Req() req: Request) {
    return this.stageService.create(
      createStageDto,
      req.headers['user']['userId'],
    );
  }

  @Get()
  findAll() {
    return this.stageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStageDto: UpdateStageDto) {
    return this.stageService.update(+id, updateStageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stageService.remove(+id);
  }
}
