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
import {
  CreateScreenDto,
  CreateUserRolesSystemDto,
} from './dto/create-user_roles_system.dto';
import { UpdateUserRolesSystemDto } from './dto/update-user_roles_system.dto';
import { UserRolesSystemsService } from './user_roles_systems.service';

@UseGuards(JwtAuthGuard)
@ApiTags('User-Roles-Systems')
@Controller('user-roles-systems')
export class UserRolesSystemsController {
  /**
   * The constructor for the UserRolesSystemsController class.
   * @param userRolesSystemsService The UserRolesSystemsService to be injected.
   */
  constructor(
    private readonly userRolesSystemsService: UserRolesSystemsService,
  ) {}

  @Post('screen')
  /**
   * Create a new screen for the user roles system.
   * @param createScreenDto The CreateScreenDto to be used to create the new screen.
   * @returns The newly created screen.
   */
  createNewScreen(@Body() createScreenDto: CreateScreenDto) {
    return this.userRolesSystemsService.createScreen(createScreenDto);
  }

  @Get('screen')
  /**
   * Retrieves all the screens for the user roles system.
   * @returns An array of all the screens.
   */
  findAllScreens() {
    return this.userRolesSystemsService.findAllScreens();
  }

  // @Roles(Role.SuperAdmin)
  @Post()
  /**
   * Create a new user roles system.
   * @param createUserRolesSystemDto The CreateUserRolesSystemDto to be used to create the new user roles system.
   * @returns The newly created user roles system.
   */
  create(@Body() createUserRolesSystemDto: CreateUserRolesSystemDto) {
    return this.userRolesSystemsService.create(createUserRolesSystemDto);
  }
  // @Roles(Role.SuperAdmin)
  @Patch('connect-roles-to-screens/:id')
  /**
   * Connects the role with the given id to the given array of screen ids.
   * @param id The id of the role to be connected.
   * @param screensIds The array of screen ids to connect the role to.
   * @returns The result of the connection.
   */
  connectScreen(@Param('id') id: string, @Body() screensIds: number[]) {
    return this.userRolesSystemsService.connectScreen(+id, screensIds);
  }

  // @Roles(Role.SuperAdmin)
  @Patch('disconnect-roles-from-screens/:id')
  /**
   * Disconnects the role with the given id from the given array of screen ids.
   * @param id The id of the role to be disconnected.
   * @param screensIds The array of screen ids to disconnect the role from.
   * @returns The result of the disconnection.
   */
  disconnectScreen(@Param('id') id: string, @Body() screensIds: number[]) {
    return this.userRolesSystemsService.disconnectScreen(+id, screensIds);
  }

  @Get()
  /**
   * Returns all user roles systems.
   * @returns An array of user roles systems.
   */
  findAll() {
    return this.userRolesSystemsService.findAll();
  }

  @Get(':id')
  /**
   * Finds a user roles system by the given id.
   * @param id The id of the user roles system to find.
   * @returns The user roles system with the given id or undefined if it does not exist.
   */
  findOne(@Param('id') id: string) {
    return this.userRolesSystemsService.findOne(+id);
  }

  // @Roles(Role.SuperAdmin)
  @Patch(':id')
  /**
   * Updates a user roles system.
   * @param id The id of the user roles system to be updated.
   * @param updateUserRolesSystemDto The UpdateUserRolesSystemDto to be used to update the user roles system.
   * @returns The updated user roles system.
   */
  update(
    @Param('id') id: string,
    @Body() updateUserRolesSystemDto: UpdateUserRolesSystemDto,
  ) {
    return this.userRolesSystemsService.update(+id, updateUserRolesSystemDto);
  }
  // @Roles(Role.SuperAdmin)
  @Delete(':id')
  /**
   * Deletes a user roles system by the given id.
   * @param id The id of the user roles system to be deleted.
   * @returns The result of the deletion.
   */
  remove(@Param('id') id: string) {
    return this.userRolesSystemsService.remove(+id);
  }
}
