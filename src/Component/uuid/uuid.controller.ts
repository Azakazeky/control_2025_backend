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
  /**
   * Creates a new uuid.
   * @param createUuidDto the uuid data to be created
   * @param req the request object
   * @returns the newly created uuid
   */
  create(@Body() createUuidDto: CreateUuidDto, @Req() req: Request) {
    return this.uuidService.create(
      createUuidDto,
      req.headers['user']['userId'],
    );
  }

  @Get()
  /**
   * Returns all uuids
   * @returns an array of uuids
   */
  findAll() {
    return this.uuidService.findAll();
  }

  @Get(':id')
  /**
   * Retrieves a single uuid by its id.
   * @param id the uuid id
   * @returns the uuid with the specified id
   */
  findOne(@Param('id') id: string) {
    return this.uuidService.findOne(+id);
  }
  @Get('validate-student/:id')
  /**
   * Validates a student using their uuid and exam mission id.
   * @param id the uuid id
   * @param examMissionId the exam mission id
   * @param req the request object
   * @returns the result of the validation
   */
  validateStudent(
    @Param('id') id: string,
    @Query('examMissionId') examMissionId: string,
    @Req() req: Request,
  ) {
    return this.uuidService.validateStudent(+id, +examMissionId);
  }
  @Patch(':id')
  /**
   * Updates a uuid.
   * @param id the uuid id
   * @param updateUuidDto the uuid data to be updated
   * @param req the request object
   * @returns the updated uuid
   */
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
  /**
   * Activates a uuid.
   * @param id the uuid id
   * @param req the request object
   * @returns the activated uuid
   */
  activate(@Param('id') id: string, @Req() req: Request) {
    return this.uuidService.activate(+id, +req.headers['user']['userId']);
  }
  @Delete(':id')
  /**
   * Removes a uuid.
   * @param id the uuid id
   * @returns the deleted uuid
   * @throws {NotFoundException} If no uuid with the given id is found.
   */
  remove(@Param('id') id: string) {
    return this.uuidService.remove(+id);
  }
}
