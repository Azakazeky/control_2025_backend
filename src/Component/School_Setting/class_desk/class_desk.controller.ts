import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/Common/Guard/local-auth.guard';
import { ClassDeskService } from './class_desk.service';
import { CreateClassDeskDto } from './dto/create-class_desk.dto';
import { CreateManyClassDeskDto } from './dto/create-many-class-desk.dto';
import { UpdateClassDeskDto } from './dto/update-class_desk.dto';
@UseGuards(JwtAuthGuard)
@ApiTags('Class-Desk')
@Controller('class-desk')
export class ClassDeskController {
  constructor(private readonly classDeskService: ClassDeskService) {}

  // @Roles(Role.SuperAdmin)
  @Post()
  /**
   * Creates a new class desk.
   * @param createClassDeskDto the class desk data to be created
   * @returns the newly created class desk
   */
  create(@Body() createClassDeskDto: CreateClassDeskDto) {
    return this.classDeskService.create(createClassDeskDto);
  }
  // @Roles(Role.SuperAdmin)
  @Post('many')
  /**
   * Creates multiple new class desks.
   * @param createManyClassDeskDto the class desk data to be created
   * @returns the newly created class desks
   */
  createMany(@Body() createManyClassDeskDto: CreateManyClassDeskDto) {
    return this.classDeskService.createMany(createManyClassDeskDto);
  }

  @Get()
  /**
   * Retrieves all class desks.
   * @returns all class desks
   */
  findAll() {
    return this.classDeskService.findAll();
  }

  // ControlSystem
  @Get('class/:id')
  /**
   * Retrieves all class desks associated with a school class.
   * @param id the school class id
   * @returns all class desks associated with the school class
   */
  findAllByClassId(@Param('id') id: string) {
    return this.classDeskService.findAllByClassId(+id);
  }

  @Get(':id')
  /**
   * Retrieves a single class desk by id.
   * @param id the class desk id
   * @returns the class desk with the specified id
   */
  findOne(@Param('id') id: string) {
    return this.classDeskService.findOne(+id);
  }
  // @Roles(Role.SuperAdmin)
  @Patch(':id')
  /**
   * Updates a class desk.
   * @param id the class desk id
   * @param updateClassDeskDto the class desk data to be updated
   * @returns the updated class desk
   */
  update(
    @Param('id') id: string,
    @Body() updateClassDeskDto: UpdateClassDeskDto,
  ) {
    return this.classDeskService.update(+id, updateClassDeskDto);
  }
  // @Roles(Role.SuperAdmin)
  @Delete('class/:id')
  /**
   * Removes all class desks associated with a school class.
   * @param id the school class id
   */
  removeAllByClassId(@Param('id') id: string) {
    return this.classDeskService.removeAllByClassId(+id);
  }
  @Delete(':id')
  /**
   * Removes a class desk by its id.
   * @param id the class desk id
   * @returns the deleted class desk
   * @throws {NotFoundException} If no class desk with the given id is found.
   */
  remove(@Param('id') id: string) {
    return this.classDeskService.remove(+id);
  }

  // @Roles( Role.SuperAdmin )

  // @Patch( 'activate/:id' )
  // activate ( @Param( 'id' ) id: string )
  // {
  //   return this.classDeskService.activate( +id );
  // }

  // @Roles( Role.SuperAdmin )

  // @Patch( 'deactivate/:id' )
  // deactivate ( @Param( 'id' ) id: string )
  // {
  //   return this.classDeskService.deactivate( +id );
  // }
}
