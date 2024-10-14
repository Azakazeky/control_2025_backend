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
  /**
   * Creates a new stage in the database.
   * @param createStageDto the stage data to be created
   * @param req the request object
   * @returns the newly created stage
   */
  create(@Body() createStageDto: CreateStageDto, @Req() req: Request) {
    return this.stageService.create(
      createStageDto,
      req.headers['user']['userId'],
    );
  }

  @Get()
  /**
   * Finds all stages in the database.
   * @returns an array of all stages
   */
  findAll() {
    return this.stageService.findAll();
  }

  @Get(':id')
  /**
   * Finds a single stage by its id.
   * @param id the stage id
   * @returns the stage with the specified id
   */
  findOne(@Param('id') id: string) {
    return this.stageService.findOne(+id);
  }

  @Patch(':id')
  /**
   * Updates a stage in the database.
   * @param id the stage id
   * @param updateStageDto the stage data to be updated
   * @param req the request object
   * @returns the updated stage
   */
  update(
    @Param('id') id: string,
    @Body() updateStageDto: UpdateStageDto,
    @Req() req: Request,
  ) {
    return this.stageService.update(
      +id,
      updateStageDto,
      req.headers['user']['userId'],
    );
  }

  @Delete(':id')
  /**
   * Removes a stage from the database.
   * @param id the stage id
   * @returns the removed stage
   */
  remove(@Param('id') id: string) {
    return this.stageService.remove(+id);
  }
}
