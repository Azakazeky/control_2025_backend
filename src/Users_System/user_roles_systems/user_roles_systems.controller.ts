import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaExceptionFilter } from 'src/Common/Db/prisma.filter';
import { JwtAuthGuard } from 'src/Common/Guard/local-auth.guard';
import Role from 'src/Common/Guard/role.enum';
import { Roles } from 'src/Common/Guard/roles.decorator';
import { ConnectRolesToScreens, CreateScreenDto, CreateUserRolesSystemDto } from './dto/create-user_roles_system.dto';
import { UpdateUserRolesSystemDto } from './dto/update-user_roles_system.dto';
import { UserRolesSystemsService } from './user_roles_systems.service';

@UseGuards(JwtAuthGuard)
@ApiTags("User-Roles-Systems")
@UseGuards(PrismaExceptionFilter)
@Controller('user-roles-systems')
export class UserRolesSystemsController {
  constructor(private readonly userRolesSystemsService: UserRolesSystemsService) { }

  @Post('screen')
  createNewScreen(@Body() createScreenDto: CreateScreenDto) {
    return this.userRolesSystemsService.createScreen(createScreenDto);
  }

  @Get('screen')
  findAllScreens() {
    return this.userRolesSystemsService.findAllScreens();
  }

  @Roles(Role.SuperAdmin)
  @Post()
  create(@Body() createUserRolesSystemDto: CreateUserRolesSystemDto) {
    return this.userRolesSystemsService.create(createUserRolesSystemDto);
  }
  @Roles(Role.SuperAdmin)
  @Patch('connect-roles-to-screens/:id')
  connectScreen(@Param('id') id: string, @Body() screensIds: number[]) {
    return this.userRolesSystemsService.connectScreen(+id, screensIds);
  }

  @Get()
  findAll() {
    return this.userRolesSystemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userRolesSystemsService.findOne(+id);
  }

  @Roles(Role.SuperAdmin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserRolesSystemDto: UpdateUserRolesSystemDto) {
    return this.userRolesSystemsService.update(+id, updateUserRolesSystemDto);
  }
  @Roles(Role.SuperAdmin)

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userRolesSystemsService.remove(+id);
  }
}
