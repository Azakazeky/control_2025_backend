import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserRolesSystemsService } from './user_roles_systems.service';
import { CreateUserRolesSystemDto } from './dto/create-user_roles_system.dto';
import { UpdateUserRolesSystemDto } from './dto/update-user_roles_system.dto';

@Controller('user-roles-systems')
export class UserRolesSystemsController {
  constructor(private readonly userRolesSystemsService: UserRolesSystemsService) {}

  @Post()
  create(@Body() createUserRolesSystemDto: CreateUserRolesSystemDto) {
    return this.userRolesSystemsService.create(createUserRolesSystemDto);
  }

  @Get()
  findAll() {
    return this.userRolesSystemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userRolesSystemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserRolesSystemDto: UpdateUserRolesSystemDto) {
    return this.userRolesSystemsService.update(+id, updateUserRolesSystemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userRolesSystemsService.remove(+id);
  }
}
